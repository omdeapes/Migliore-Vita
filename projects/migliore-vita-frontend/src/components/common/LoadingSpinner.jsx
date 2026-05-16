export function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-32 gap-3">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-blue-600 border-t-transparent`}
      />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  )
}
