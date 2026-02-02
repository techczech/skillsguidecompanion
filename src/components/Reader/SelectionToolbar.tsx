import { motion } from 'framer-motion'
import { Highlighter, X } from 'lucide-react'

interface SelectionToolbarProps {
  selectedText: string
  position: { x: number; y: number }
  onHighlight: () => void
  onClose: () => void
}

export function SelectionToolbar({ selectedText, position, onHighlight, onClose }: SelectionToolbarProps) {
  const truncatedText = selectedText.length > 60 ? selectedText.slice(0, 60) + '...' : selectedText

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 max-w-xs"
      style={{
        left: Math.min(position.x, window.innerWidth - 280),
        top: position.y + 10,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs text-gray-500 dark:text-gray-400 italic line-clamp-2">
          "{truncatedText}"
        </p>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <button
        onClick={onHighlight}
        className="flex items-center gap-2 w-full px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors text-sm font-medium"
      >
        <Highlighter className="w-4 h-4" />
        Highlight
      </button>
    </motion.div>
  )
}
