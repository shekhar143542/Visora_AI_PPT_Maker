const CreatePageSkeleton = () => {
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-700 rounded-md w-64 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded-md w-96 animate-pulse"></div>
      </div>

      {/* Grid of card skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 space-y-4">
            {/* Image placeholder */}
            <div className="h-32 bg-gray-700 rounded-md animate-pulse"></div>

            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-700 rounded-md w-full animate-pulse"></div>
              <div className="h-5 bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
            </div>

            {/* Subtitle skeleton */}
            <div className="h-3 bg-gray-600 rounded-md w-24 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreatePageSkeleton
