import { Err, Ok, type Result } from '@hazae41/result'
import { useCircuit } from 'h/useCircuit'
import { useProof } from 'h/useProof'
import { useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'
import { ageAtom } from 's/atoms'

export function useAgeProof() {
  const { initialize, isInitialized, isInitializing, error: circuitError } = useCircuit()
  const { generateProof, verifyProof, isGenerating, isVerifying, proofGeneration, proofVerification } = useProof()

  const [age, setAge] = useAtom(ageAtom)

  // Auto-initialize circuit
  useEffect(() => {
    initialize().then((result) => {
      result.mapOrElseSync(
        (error: string) => console.error('Failed to initialize circuit:', error),
        () => undefined,
      )
    })
  }, [initialize])

  const handleGenerateProof = useCallback(async () => {
    if (!age || isGenerating || isVerifying) return

    const proofResult = await generateProof({ age })
    await proofResult.andThen(async (result) => await verifyProof(result.proof, result.publicInputs))
  }, [age, generateProof, verifyProof, isGenerating, isVerifying])

  const reset = useCallback(() => {
    setAge('')
  }, [setAge])

  // Get first available error (circuit > proof generation > proof verification)
  const error: Result<unknown, string> = (() => {
    // Check circuit error first
    if (circuitError.isSome()) return new Err(circuitError.inner)

    // Check proof generation error
    if (proofGeneration.isSome() && proofGeneration.inner.isErr())
      return proofGeneration.inner

    // Check proof verification error
    if (proofVerification.isSome() && proofVerification.inner.isErr())
      return proofVerification.inner

    // No errors
    return new Ok('')
  })()

  return {
    age,
    proofGeneration,
    proofVerification,
    error,

    isInitializing,
    isInitialized,
    isGenerating,
    isVerifying,

    setAge,
    generateProof: handleGenerateProof,
    reset,

    canSubmit: Boolean(age) && !isInitializing && isInitialized && !isGenerating && !isVerifying,
    isLoading: isInitializing || isGenerating || isVerifying,
  }
}
