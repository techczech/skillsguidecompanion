import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Info, Copy, Check, Eye, EyeOff } from 'lucide-react'

interface Annotation {
  line: number
  text: string
}

interface AnnotatedFileViewerProps {
  path: string
  content: string
  annotations?: Annotation[]
  className?: string
}

export function AnnotatedFileViewer({
  path,
  content,
  annotations = [],
  className,
}: AnnotatedFileViewerProps) {
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [copied, setCopied] = useState(false)
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)

  const lines = content.split('\n')
  const annotationMap = new Map(annotations.map((a) => [a.line, a.text]))

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fileName = path.split('/').pop() || path

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-200">{fileName}</span>
          <span className="text-xs text-gray-500">{path}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors',
              showAnnotations
                ? 'bg-system/20 text-system'
                : 'bg-gray-800 text-gray-400 hover:text-gray-200'
            )}
          >
            {showAnnotations ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
            Annotations
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          <pre className="p-4 font-mono text-sm">
            {lines.map((line, i) => {
              const lineNum = i + 1
              const annotation = annotationMap.get(lineNum)
              const isHovered = hoveredLine === lineNum

              return (
                <div
                  key={i}
                  className={cn(
                    'flex group relative',
                    annotation && showAnnotations && 'bg-system/5'
                  )}
                  onMouseEnter={() => setHoveredLine(lineNum)}
                  onMouseLeave={() => setHoveredLine(null)}
                >
                  {/* Line number */}
                  <span className="w-10 pr-3 text-right text-gray-600 select-none flex-shrink-0 border-r border-gray-800 mr-4">
                    {lineNum}
                  </span>

                  {/* Line content */}
                  <span className="flex-1">{formatLine(line, fileName)}</span>

                  {/* Annotation indicator */}
                  {annotation && showAnnotations && (
                    <span className="ml-2 flex-shrink-0">
                      <Info className="w-3.5 h-3.5 text-system" />
                    </span>
                  )}

                  {/* Annotation tooltip */}
                  <AnimatePresence>
                    {annotation && showAnnotations && isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute right-0 top-0 transform translate-x-full ml-2 z-10"
                      >
                        <div className="bg-gray-900 border border-system/30 rounded-lg px-3 py-2 text-xs text-gray-300 max-w-xs shadow-lg">
                          <div className="flex items-start gap-2">
                            <Info className="w-3 h-3 text-system flex-shrink-0 mt-0.5" />
                            <span>{annotation}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </pre>
        </div>
      </div>

      {/* Annotation legend */}
      {annotations.length > 0 && showAnnotations && (
        <div className="px-4 py-2 border-t border-gray-800 bg-gray-900/30">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Info className="w-3 h-3 text-system" />
            <span>Hover over highlighted lines to see explanations</span>
          </div>
        </div>
      )}
    </div>
  )
}

function formatLine(line: string, fileName: string): React.ReactNode {
  const ext = fileName.split('.').pop()

  // Markdown formatting
  if (ext === 'md') {
    if (line === '---') return <span className="text-gray-600">{line}</span>
    if (line.match(/^[a-z]+:/)) {
      const [key, ...value] = line.split(':')
      return (
        <>
          <span className="text-purple-400">{key}</span>
          <span className="text-gray-400">:</span>
          <span className="text-green-400">{value.join(':')}</span>
        </>
      )
    }
    if (line.startsWith('# ')) return <span className="text-yellow-400 font-bold">{line}</span>
    if (line.startsWith('## ')) return <span className="text-yellow-300 font-semibold">{line}</span>
    if (line.startsWith('### ')) return <span className="text-yellow-200">{line}</span>
    if (line.startsWith('```')) return <span className="text-pink-400">{line}</span>
    if (line.startsWith('- ')) {
      return (
        <>
          <span className="text-gray-500">- </span>
          <span className="text-gray-300">{line.slice(2)}</span>
        </>
      )
    }
    if (line.startsWith('|')) return <span className="text-gray-400">{line}</span>
  }

  // JavaScript/Python formatting
  if (ext === 'js' || ext === 'py') {
    if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
      return <span className="text-gray-500 italic">{line}</span>
    }
    if (line.includes('function') || line.includes('def ')) {
      return <span className="text-blue-400">{line}</span>
    }
    if (line.includes('const ') || line.includes('let ') || line.includes('var ')) {
      return <span className="text-purple-300">{line}</span>
    }
  }

  return <span className="text-gray-300">{line}</span>
}
