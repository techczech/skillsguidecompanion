import { useReaderStore, Highlight } from '@/store/readerStore'
import { articleSections } from '@/data/articleContent'
import { Trash2, Download, Highlighter } from 'lucide-react'
import { cn } from '@/utils/cn'

interface HighlightsPanelProps {
  sectionId?: string
  showAll?: boolean
}

export function HighlightsPanel({ sectionId, showAll = false }: HighlightsPanelProps) {
  const { highlights, removeHighlight, exportHighlights } = useReaderStore()

  const filteredHighlights = showAll
    ? highlights
    : highlights.filter((h) => h.sectionId === sectionId)

  const handleExport = () => {
    const md = exportHighlights()
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'skills-article-highlights.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (filteredHighlights.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        <Highlighter className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No highlights yet</p>
        <p className="text-xs mt-1">Select text to highlight it</p>
      </div>
    )
  }

  // Group by section if showing all
  const grouped = showAll
    ? filteredHighlights.reduce(
        (acc, h) => {
          if (!acc[h.sectionId]) acc[h.sectionId] = []
          acc[h.sectionId].push(h)
          return acc
        },
        {} as Record<string, Highlight[]>
      )
    : { [sectionId || '']: filteredHighlights }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {filteredHighlights.length} highlight{filteredHighlights.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Download className="w-3 h-3" />
          Export
        </button>
      </div>

      {Object.entries(grouped).map(([secId, sectionHighlights]) => {
        const section = articleSections.find((s) => s.id === secId)
        return (
          <div key={secId}>
            {showAll && section && (
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {section.title}
              </h4>
            )}
            <div className="space-y-2">
              {sectionHighlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className={cn(
                    'group relative p-3 rounded-lg',
                    'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50'
                  )}
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300 pr-6 line-clamp-3">
                    "{highlight.text}"
                  </p>
                  <button
                    onClick={() => removeHighlight(highlight.id)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove highlight"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
