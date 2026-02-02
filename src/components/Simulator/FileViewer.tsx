import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { FileText, Folder } from 'lucide-react'

interface FileViewerProps {
  path: string
  content: string
  isVisible: boolean
  highlightSections?: string[]
  className?: string
}

export function FileViewer({
  path,
  content,
  isVisible,
  highlightSections = [],
  className,
}: FileViewerProps) {
  const pathParts = path.split('/')
  const fileName = pathParts.pop() || ''
  const folderPath = pathParts.join('/')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      className={cn('', className)}
    >
      {/* File path breadcrumb */}
      <div className="flex items-center gap-1 mb-2 text-sm text-gray-500">
        <Folder className="w-4 h-4" />
        <span>{folderPath}/</span>
        <FileText className="w-4 h-4 text-green-600" />
        <span className="text-green-600 font-medium">{fileName}</span>
      </div>

      {/* File content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-500">
          {fileName}
        </div>

        <motion.div
          className="p-4 font-mono text-xs max-h-80 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {content.split('\n').map((line, i) => {
            const isHighlighted = highlightSections.some((section) =>
              line.toLowerCase().includes(section.toLowerCase())
            )

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className={cn(
                  'py-0.5 px-2 -mx-2 rounded',
                  isHighlighted && 'bg-green-50 border-l-2 border-green-500'
                )}
              >
                {formatMarkdownLine(line)}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}

function formatMarkdownLine(line: string): React.ReactNode {
  // Frontmatter
  if (line === '---') {
    return <span className="text-gray-400">{line}</span>
  }

  // YAML key-value
  if (line.match(/^[a-z]+:/)) {
    const [key, ...value] = line.split(':')
    return (
      <>
        <span className="text-purple-600">{key}</span>
        <span className="text-gray-400">:</span>
        <span className="text-green-600">{value.join(':')}</span>
      </>
    )
  }

  // Headings
  if (line.startsWith('# ')) {
    return <span className="text-amber-600 font-bold text-base">{line}</span>
  }
  if (line.startsWith('## ')) {
    return <span className="text-amber-500 font-semibold">{line}</span>
  }
  if (line.startsWith('### ')) {
    return <span className="text-amber-500">{line}</span>
  }

  // Code blocks
  if (line.startsWith('```')) {
    return <span className="text-pink-600">{line}</span>
  }

  // Bullet points
  if (line.startsWith('- ')) {
    return (
      <>
        <span className="text-gray-400">- </span>
        <span className="text-gray-700">{line.slice(2)}</span>
      </>
    )
  }

  // Inline code
  if (line.includes('`')) {
    const parts = line.split(/(`[^`]+`)/)
    return (
      <>
        {parts.map((part, i) =>
          part.startsWith('`') ? (
            <span key={i} className="bg-gray-100 px-1 rounded text-pink-600">
              {part}
            </span>
          ) : (
            <span key={i} className="text-gray-700">
              {part}
            </span>
          )
        )}
      </>
    )
  }

  return <span className="text-gray-700">{line}</span>
}
