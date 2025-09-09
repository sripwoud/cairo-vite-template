import init, { runCairoProgram } from '@cryptonerdcn/wasm-cairo'
import { Err, Ok, type Result } from '@hazae41/result'
import { expose } from 'comlink'
import type { CircuitInput, ProofResult } from './types'

export type CircuitWorkerAPI = {
  ping(): Promise<string>
  initialize(): Promise<Result<void, string>>
  generateProof(input: CircuitInput): Promise<Result<ProofResult, string>>
  verifyProof(proof: Uint8Array, publicInputs: string[]): Promise<Result<boolean, string>>
}

class CircuitWorker implements CircuitWorkerAPI {
  private initialized = false

  async ping(): Promise<string> {
    return 'Cairo Worker ready'
  }

  async initialize(): Promise<Result<void, string>> {
    try {
      await init()
      this.initialized = true
      console.log('Cairo WASM initialized successfully')
      return new Ok(undefined)
    } catch (error) {
      console.error('Failed to initialize Cairo WASM:', error)
      return new Err(`Failed to initialize Cairo WASM: ${error}`)
    }
  }

  async generateProof(input: CircuitInput): Promise<Result<ProofResult, string>> {
    if (!this.initialized)
      return new Err('Worker not initialized. Call initialize() first.')

    try {
      // Load the Cairo source code
      const cairoResponse = await fetch('/src/lib.cairo')
      if (!cairoResponse.ok)
        return new Err('Failed to load Cairo source. Ensure circuit exists at /src/lib.cairo')

      const cairoSource = await cairoResponse.text()

      // For wasm-cairo, we need to modify the Cairo source to include the input
      // Create a wrapper that calls our function with the input
      const wrappedCairoSource = `
${cairoSource}

use circuit::is_over_eighteen;

fn main() -> bool {
    is_over_eighteen(${input.age})
}
      `

      // Execute the Cairo program
      // Parameters: cairo_program, available_gas, allow_warnings, print_full_memory, run_profiler, use_dbg_print_hint
      const result = runCairoProgram(
        wrappedCairoSource,
        100000, // available_gas
        false, // allow_warnings
        false, // print_full_memory
        false, // run_profiler
        false, // use_dbg_print_hint
      )

      // Parse the result - wasm-cairo returns execution output as string
      const output = result.trim()
      console.log('Cairo execution result:', output)

      // Extract boolean result from output
      const isOverEighteen = output.includes('true') || output.includes('1')

      // Create a mock proof structure to match noir-vite interface
      // In a real Cairo implementation, this would be the actual STARK proof
      const proof = new Uint8Array([isOverEighteen ? 1 : 0])
      const publicInputs = [input.age, isOverEighteen.toString()]

      return new Ok({
        proof,
        publicInputs,
      })
    } catch (error) {
      console.error('Cairo execution failed:', error)
      return new Err(`Cairo execution failed: ${error}`)
    }
  }

  async verifyProof(proof: Uint8Array, publicInputs: string[]): Promise<Result<boolean, string>> {
    if (!this.initialized)
      return new Err('Worker not initialized. Call initialize() first.')

    try {
      // Mock verification logic - in a real implementation this would verify the STARK proof
      // For now, we'll just check the proof data consistency
      const isValidProof = proof.length > 0 && publicInputs.length >= 2
      const ageInput = publicInputs[0]
      const expectedResult = publicInputs[1]

      // Simple validation: check if age > 18 matches the expected result
      const ageNumber = Number.parseInt(ageInput, 10)
      const actualResult = ageNumber > 18
      const isConsistent = actualResult.toString() === expectedResult

      return new Ok(isValidProof && isConsistent)
    } catch (error) {
      console.error('Proof verification failed:', error)
      return new Err(`Proof verification failed: ${error}`)
    }
  }
}

const worker = new CircuitWorker()
expose(worker)
