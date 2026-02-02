import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { FileText, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface SystemPromptPanelProps {
  content: string
  highlightLines?: string[]
  isVisible: boolean
  className?: string
}

export function SystemPromptPanel({
  content,
  highlightLines = [],
  isVisible,
  className,
}: SystemPromptPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const lines = content.split('\n')

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
      className={cn('flex flex-col h-full', className)}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
        <FileText className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-medium text-gray-900">System Prompt</span>
        <span className="text-xs text-gray-500 ml-auto">~3,000 words</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-500 flex items-center justify-between">
            <span>system_prompt.txt</span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 hover:text-gray-700 transition-colors"
            >
              {expanded ? 'Collapse' : 'Expand'}
              <ChevronDown
                className={cn('w-3 h-3 transition-transform', expanded && 'rotate-180')}
              />
            </button>
          </div>

          <div className={cn('p-3 font-mono text-xs', !expanded && 'max-h-64 overflow-hidden')}>
            {lines.map((line, i) => {
              const shouldHighlight = highlightLines.some((h) => line.includes(h))
              return (
                <motion.div
                  key={i}
                  initial={shouldHighlight ? { backgroundColor: 'transparent' } : {}}
                  animate={
                    shouldHighlight
                      ? { backgroundColor: ['transparent', 'rgba(147, 51, 234, 0.15)', 'rgba(147, 51, 234, 0.1)'] }
                      : {}
                  }
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className={cn(
                    'py-0.5 px-1 -mx-1 rounded',
                    shouldHighlight && 'border-l-2 border-purple-500'
                  )}
                >
                  {line.startsWith('#') ? (
                    <span className="text-purple-600 font-semibold">{line}</span>
                  ) : line.startsWith('-') ? (
                    <span className="text-gray-700">{line}</span>
                  ) : line.startsWith('**') ? (
                    <span className="text-amber-600">{line}</span>
                  ) : (
                    <span className="text-gray-500">{line}</span>
                  )}
                </motion.div>
              )
            })}
          </div>

          {!expanded && (
            <div className="h-12 bg-gradient-to-t from-white to-transparent -mt-12 relative" />
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          <strong className="text-gray-700">What's this?</strong> A hidden prompt sent with every
          message. It tells Claude what skills are available.
        </div>
      </div>
    </motion.div>
  )
}
