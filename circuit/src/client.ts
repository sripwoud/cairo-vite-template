import { Err, Ok, Result } from '@hazae41/result'
import * as Comlink from 'comlink'
import type { CircuitInput, ProofResult } from './types'
import type { CircuitWorkerAPI } from './worker'

export class CircuitClient {
  private worker: Worker
  private api: Comlink.Remote<CircuitWorkerAPI>
  private _initialized = false

  constructor(baseUrl = '') {
    // Use provided base URL (from Vite's import.meta.env.BASE_URL) or default to root
    // This ensures the worker URL works in all environments:
    // - Local dev: baseUrl = '/' → '/worker.js'
    // - GitHub Pages: baseUrl = '/cairo-vite-template/' → '/cairo-vite-template/worker.js'
    const workerUrl = `${baseUrl}worker.js`
    this.worker = new Worker(workerUrl, { type: 'module' })
    this.api = Comlink.wrap<CircuitWorkerAPI>(this.worker)
  }

  async initialize(): Promise<Result<void, string>> {
    if (this._initialized)
      return new Ok(undefined)

    const workerReady = await this.waitForWorkerReady()
    if (workerReady.isErr()) return workerReady

    const result = await this.api.initialize()
    if (result.isOk())
      this._initialized = true
    return result
  }

  private async waitForWorkerReady(): Promise<Result<void, string>> {
    const maxRetries = 10
    const initialDelay = 100

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await Result.runAndWrap(async () => {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Ping timeout')), 2000)
        })

        const pingPromise = this.api.ping()
        await Promise.race([pingPromise, timeoutPromise])
      })

      if (result.isOk())
        return result

      if (attempt === maxRetries)
        return new Err('Worker communication failed after retries')

      const delay = initialDelay * 2 ** (attempt - 1)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    return new Err('Worker ready check failed')
  }

  async generateProof(input: CircuitInput): Promise<Result<ProofResult, string>> {
    if (!this._initialized) {
      const initResult = await this.initialize()
      if (initResult.isErr())
        return initResult as Result<ProofResult, string>
    }

    return this.api.generateProof(input)
  }

  async verifyProof(proof: Uint8Array, publicInputs: string[]): Promise<Result<boolean, string>> {
    if (!this._initialized) {
      const initResult = await this.initialize()
      if (initResult.isErr())
        return initResult
    }

    return this.api.verifyProof(proof, publicInputs)
  }

  get initialized(): boolean {
    return this._initialized
  }

  terminate(): void {
    this.worker.terminate()
    this._initialized = false
  }
}
