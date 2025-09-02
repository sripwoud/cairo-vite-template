import type { Option } from '@hazae41/option'
import type { Result } from '@hazae41/result'
import type { ProofResult as ProofData } from 'circuit'

interface ProofResultProps {
  proofGeneration: Option<Result<ProofData, string>>
  proofVerification: Option<Result<boolean, string>>
}

export function ProofResult({ proofGeneration, proofVerification }: ProofResultProps) {
  return proofGeneration.mapOrSync(
    null,
    (result) =>
      result.mapOrSync(
        null,
        () => (
          <div className='mt-4 space-y-4'>
            <div className='p-3 bg-green-100 border border-green-400 text-green-700 rounded'>
              Proof generated successfully!
            </div>

            {proofVerification.mapOrSync(
              null,
              (verifyResult) =>
                verifyResult.mapOrSync(
                  null,
                  (isValid) => (
                    <div
                      className={`p-3 rounded border ${
                        isValid
                          ? 'bg-blue-100 border-blue-400 text-blue-700'
                          : 'bg-red-100 border-red-400 text-red-700'
                      }`}
                    >
                      {isValid
                        ? '✅ Proof is valid!'
                        : '❌ Proof verification failed.'}
                    </div>
                  ),
                ),
            )}
          </div>
        ),
      ),
  )
}
