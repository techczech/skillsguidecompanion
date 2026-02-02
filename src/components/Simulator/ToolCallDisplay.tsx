import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Terminal, ArrowRight } from 'lucide-react'

interface ToolCallDisplayProps {
  toolCall: {
    name: string
    arguments: Record<string, unknown>
  }
  isVisible: boolean
  showAnimation?: boolean
  className?: string
}

export function ToolCallDisplay({
  toolCall,
  isVisible,
  showAnimation = true,
  className,
}: ToolCallDisplayProps) {
  const jsonString = JSON.stringify(toolCall, null, 2)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
      className={cn('', className)}
    >
      <div className="bg-white rounded-lg border border-orange-200 overflow-hidden shadow-sm shadow-orange-100">
        <div className="px-3 py-2 bg-orange-50 border-b border-orange-200 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-700">Tool Call</span>
          {showAnimation && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="ml-auto flex items-center gap-1 text-xs text-gray-500"
            >
              <span>Model output</span>
              <ArrowRight className="w-3 h-3" />
              <span>Software intercepts</span>
            </motion.div>
          )}
        </div>

        <div className="p-3 bg-gray-50">
          <pre className="font-mono text-sm overflow-x-auto">
            {jsonString.split('\n').map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {formatJsonLine(line)}
              </motion.div>
            ))}
          </pre>
        </div>
      </div>
    </motion.div>
  )
}

function formatJsonLine(line: string): React.ReactNode {
  const keyMatch = line.match(/^(\s*)"([^"]+)"(:)/)
  const stringMatch = line.match(/:\s*"([^"]+)"/)

  if (keyMatch) {
    const [, indent, key, colon] = keyMatch
    const rest = line.slice(keyMatch[0].length)
    return (
      <>
        {indent}
        <span className="text-purple-600">"{key}"</span>
        <span className="text-gray-500">{colon}</span>
        {stringMatch ? (
          <>
            {' '}
            <span className="text-green-600">"{stringMatch[1]}"</span>
            {rest.slice(stringMatch[0].length - 1)}
          </>
        ) : (
          rest
        )}
      </>
    )
  }

  return <span className="text-gray-700">{line}</span>
}
