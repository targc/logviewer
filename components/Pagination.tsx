'use client'

interface PaginationProps {
  offset: number
  maxHits: number
  hasMore: boolean
  totalHits: number
  onPrevious: () => void
  onNext: () => void
}

export default function Pagination({
  offset,
  maxHits,
  hasMore,
  totalHits,
  onPrevious,
  onNext,
}: PaginationProps) {
  const currentPage = Math.floor(offset / maxHits) + 1
  const startItem = offset + 1
  const endItem = Math.min(offset + maxHits, totalHits)

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalHits}</span> results
      </div>

      <div className="flex gap-2">
        <button
          onClick={onPrevious}
          disabled={offset === 0}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <div className="px-4 py-2 text-sm text-gray-700">
          Page {currentPage}
        </div>
        <button
          onClick={onNext}
          disabled={!hasMore}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
