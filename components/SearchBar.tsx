'use client'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
}

export default function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder="Search logs..."
        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
      />
      <button
        onClick={onSearch}
        className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
      >
        Search
      </button>
    </div>
  )
}
