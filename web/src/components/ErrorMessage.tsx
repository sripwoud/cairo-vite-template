import type { Result } from '@hazae41/result'

interface ErrorProps {
  error: Result<unknown, string>
}

export function ErrorMessage({ error }: ErrorProps) {
  return error.mapOrElseSync(
    (errorMessage) => (
      <div className='mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
        {errorMessage}
      </div>
    ),
    () => null,
  )
}
