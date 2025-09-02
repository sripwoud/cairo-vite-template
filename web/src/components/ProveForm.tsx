import { ErrorMessage } from 'c/ErrorMessage'
import { LoadingState } from 'c/LoadingState'
import { ProofResult } from 'c/ProofResult'
import { useAgeProof } from 'h/useAgeProof'
import { useId } from 'react'

export function ProveForm() {
  const id = useId()
  const {
    age,
    setAge,
    generateProof,
    canSubmit,
    isLoading,
    isInitializing,
    isGenerating,
    isVerifying,
    proofGeneration,
    proofVerification,
    error,
  } = useAgeProof()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (canSubmit)
      await generateProof()
  }

  return (
    <div className='container mx-auto max-w-md p-4'>
      <h1 className='text-2xl font-bold mb-6'>Generate Proof</h1>

      <form className='space-y-4' onSubmit={handleSubmit}>
        <div>
          <label
            className='block text-sm font-medium mb-2'
            htmlFor='age'
          >
            Age
          </label>
          <input
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            disabled={isLoading}
            id={id}
            max='150'
            min='0'
            onChange={(e) => setAge(e.target.value)}
            placeholder='Enter your age'
            required
            type='number'
            value={age}
          />
          <p className='mt-1 text-sm text-gray-500'>
            Prove you are 18 or older without revealing your exact age
          </p>
        </div>

        <button
          className='w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={!canSubmit}
          type='submit'
        >
          Generate Proof
        </button>
      </form>

      <LoadingState
        isGenerating={isGenerating}
        isInitializing={isInitializing}
        isVerifying={isVerifying}
      />
      <ErrorMessage error={error} />
      <ProofResult proofGeneration={proofGeneration} proofVerification={proofVerification} />
    </div>
  )
}
