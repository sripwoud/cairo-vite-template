import { None, Some } from '@hazae41/option'
import { Ok, type Result } from '@hazae41/result'
import { CircuitClient } from 'circuit'
import { useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'
import { circuitClientAtom, circuitInitAtom, initPromiseAtom, isInitializingAtom } from 's/atoms'

export function useCircuit() {
  const [circuitInit, setCircuitInit] = useAtom(circuitInitAtom)
  const [circuitClient, setCircuitClient] = useAtom(circuitClientAtom)
  const [initPromise, setInitPromise] = useAtom(initPromiseAtom)
  const [isInitializing, setIsInitializing] = useAtom(isInitializingAtom)

  const initialize = useCallback(async (): Promise<Result<CircuitClient, string>> => {
    // Check if both client and successful init exist
    const hasValidClient = circuitClient.isSome() && circuitInit.isSome() && circuitInit.inner.isOk()

    if (hasValidClient && circuitClient.isSome())
      return new Ok(circuitClient.inner)

    // Early return for existing promise
    if (initPromise.isSome())
      return await initPromise.inner

    // Create and store the initialization promise with functional result handling
    const newPromise = (async (): Promise<Result<CircuitClient, string>> => {
      setIsInitializing(true)

      const client = new CircuitClient(import.meta.env.BASE_URL)
      const initResult = await client.initialize()

      setIsInitializing(false)
      setCircuitInit(new Some(initResult))

      return initResult.andThen(() => {
        setCircuitClient(new Some(client))
        return new Ok(client)
      })
    })()

    setInitPromise(new Some(newPromise))
    const result = await newPromise
    setInitPromise(new None())
    return result
  }, [circuitInit, circuitClient, initPromise, setCircuitClient, setCircuitInit, setInitPromise, setIsInitializing])

  useEffect(() => {
    return () => {
      if (circuitClient.isSome()) {
        circuitClient.inner.terminate()
        setCircuitClient(new None())
      }
    }
  }, [circuitClient, setCircuitClient])

  return {
    isInitialized: circuitInit.isSome() && circuitInit.inner.isOk(),
    isInitializing,
    error: circuitInit.isSome() && circuitInit.inner.isErr()
      ? new Some(circuitInit.inner.inner)
      : new None(),
    initialize,
    client: circuitClient,
  }
}
