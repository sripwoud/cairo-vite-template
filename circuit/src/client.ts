import { Ok, type Result } from '@hazae41/result'
import * as Comlink from 'comlink'
import type { CircuitInput, ProofResult } from './types'
import type { CircuitWorkerAPI } from './worker'

export class CircuitClient {
  private worker: Worker
  private api: Comlink.Remote<CircuitWorkerAPI>
  private _initialized = false

  constructor(baseUrl = '') {
    // Create worker URL - the worker will be built as worker.js
    const workerUrl = new URL('./worker.js', baseUrl || window.location.origin)
    this.worker = new Worker(workerUrl, { type: 'module' })
    this.api = Comlink.wrap<CircuitWorkerAPI>(this.worker)
  }

  async ping(): Promise<string> {
    return this.api.ping()
  }

  async initialize(): Promise<Result<void, string>> {
    if (this._initialized)
      return new Ok(undefined)

    const result = await this.api.initialize()
    if (result.isOk())
      this._initialized = true
    return result
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
