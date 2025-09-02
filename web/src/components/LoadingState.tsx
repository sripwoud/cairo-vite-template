import { ClipLoader } from 'react-spinners'

interface LoadingStateProps {
  isInitializing?: boolean
  isGenerating?: boolean
  isVerifying?: boolean
  size?: number
  color?: string
}

const LOADING_MESSAGES = {
  initializing: 'Initializing Circuit...',
  generating: 'Generating Proof...',
  verifying: 'Verifying Proof...',
} as const

export function LoadingState({
  isInitializing = false,
  isGenerating = false,
  isVerifying = false,
  size = 24,
  color = '#3B82F6',
}: LoadingStateProps) {
  // Functional approach: determine which loading state is active
  const activeLoadingState = (() => {
    if (isInitializing) return { key: 'initializing', message: LOADING_MESSAGES.initializing }
    if (isGenerating) return { key: 'generating', message: LOADING_MESSAGES.generating }
    if (isVerifying) return { key: 'verifying', message: LOADING_MESSAGES.verifying }
    return null
  })()

  // Early return if not loading
  if (!activeLoadingState) return null

  return (
    <div className='flex items-center justify-center gap-3 py-4'>
      <ClipLoader
        aria-label={activeLoadingState.message}
        color={color}
        loading={true}
        size={size}
      />
      <span className='text-sm text-gray-600 animate-pulse'>
        {activeLoadingState.message}
      </span>
    </div>
  )
}
