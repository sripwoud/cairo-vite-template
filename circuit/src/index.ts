import { Err, Ok, type Result } from '@hazae41/result'
import * as Comlink from 'comlink'

// Comlink transfer handler for Result types (must match worker)
Comlink.transferHandlers.set('result', {
  // biome-ignore lint/suspicious/noExplicitAny: Using generic type for Result
  canHandle: (obj: any): obj is Result<any, any> => {
    return obj && (obj.constructor.name === 'Ok' || obj.constructor.name === 'Err')
  },
  // biome-ignore lint/suspicious/noExplicitAny: Using generic type for Result
  serialize: (obj: Result<any, any>) => {
    const serialized = obj.isOk()
      ? { type: 'Ok', value: obj.inner }
      : { type: 'Err', error: obj.inner }
    return [serialized, []]
  },
  // biome-ignore lint/suspicious/noExplicitAny: Using generic type for Result
  deserialize: (obj: any) => {
    return obj.type === 'Ok' ? new Ok(obj.value) : new Err(obj.error)
  },
})

export { CircuitClient } from './client'
export type { CircuitInput, ProofResult } from './types'
export type { CircuitWorkerAPI } from './worker'
