import { ClipLoader } from 'react-spinners'

interface LoadingSpinnerProps {
  isLoading: boolean
  message?: string
  size?: number
  color?: string
}

export function LoadingSpinner({
  isLoading,
  message = 'Loading...',
  size = 24,
  color = '#3B82F6',
}: LoadingSpinnerProps) {
  if (!isLoading) return null

  return (
    <div className='flex items-center justify-center gap-3 py-4'>
      <ClipLoader
        aria-label={message}
        color={color}
        loading={isLoading}
        size={size}
      />
      {message && (
        <span className='text-sm text-gray-600 animate-pulse'>
          {message}
        </span>
      )}
    </div>
  )
}
