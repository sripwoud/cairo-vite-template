import { None, Some } from '@hazae41/option'
import { Ok, type Result } from '@hazae41/result'
import type { CircuitInput, ProofResult } from 'circuit'
import { useCircuit } from 'h/useCircuit'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { isGeneratingAtom, isVerifyingAtom, proofGenerationAtom, proofVerificationAtom } from 's/atoms'

export function useProof() {
  const { initialize, client } = useCircuit()
  const [isGenerating, setIsGenerating] = useAtom(isGeneratingAtom)
  const [isVerifying, setIsVerifying] = useAtom(isVerifyingAtom)
  const [proofGeneration, setProofGeneration] = useAtom(proofGenerationAtom)
  const [proofVerification, setProofVerification] = useAtom(proofVerificationAtom)

  const generateProof = useCallback(
    async (input: CircuitInput): Promise<Result<ProofResult, string>> => {
      const clientResult = await client.mapOrElse(
        async () => await initialize(),
        async (existingClient) => new Ok(existingClient),
      )

      return clientResult.andThen(async (circuitClient) => {
        setIsGenerating(true)

        const result = await circuitClient.generateProof(input)
        setIsGenerating(false)
        setProofGeneration(new Some(result))

        return result
      })
    },
    [client, initialize, setIsGenerating, setProofGeneration],
  )

  const verifyProof = useCallback(
    async (proof: Uint8Array, publicInputs: string[]): Promise<Result<boolean, string>> => {
      const clientResult = await client.mapOrElse(
        async () => await initialize(),
        async (existingClient) => new Ok(existingClient),
      )

      return clientResult.andThen(async (circuitClient) => {
        setIsVerifying(true)

        const result = await circuitClient.verifyProof(proof, publicInputs)
        setIsVerifying(false)
        setProofVerification(new Some(result))

        return result
      })
    },
    [client, initialize, setIsVerifying, setProofVerification],
  )

  const reset = useCallback(() => {
    setIsGenerating(false)
    setIsVerifying(false)
    setProofGeneration(new None())
    setProofVerification(new None())
  }, [setIsGenerating, setIsVerifying, setProofGeneration, setProofVerification])

  return {
    isGenerating,
    isVerifying,
    proofGeneration,
    proofVerification,
    generateProof,
    verifyProof,
    reset,
  }
}
