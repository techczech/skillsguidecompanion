import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Terminal, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

interface TerminalAnimationProps {
  command: string
  args?: string[]
  isVisible: boolean
  onComplete?: () => void
  className?: string
}

export function TerminalAnimation({
  command,
  args = [],
  isVisible,
  onComplete,
  className,
}: TerminalAnimationProps) {
  const [phase, setPhase] = useState<'typing' | 'running' | 'complete'>('typing')
  const [progress, setProgress] = useState(0)
  const [typedChars, setTypedChars] = useState(0)

  const fullCommand = `${command} ${args.join(' ')}`

  useEffect(() => {
    if (!isVisible) {
      setPhase('typing')
      setProgress(0)
      setTypedChars(0)
      return
    }

    // Typing animation
    const typingInterval = setInterval(() => {
      setTypedChars((c) => {
        if (c >= fullCommand.length) {
          clearInterval(typingInterval)
          setPhase('running')
          return c
        }
        return c + 1
      })
    }, 30)

    return () => clearInterval(typingInterval)
  }, [isVisible, fullCommand])

  useEffect(() => {
    if (phase !== 'running') return

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval)
          setPhase('complete')
          onComplete?.()
          return 100
        }
        return p + 5
      })
    }, 50)

    return () => clearInterval(progressInterval)
  }, [phase, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      className={cn('', className)}
    >
      <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
        {/* Terminal header */}
        <div className="px-3 py-2 bg-gray-900 border-b border-gray-800 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-gray-500 ml-2">Terminal</span>
        </div>

        {/* Terminal content */}
        <div className="p-4 font-mono text-sm">
          {/* Command line */}
          <div className="flex items-center gap-2">
            <span className="text-green-400">$</span>
            <span className="text-gray-300">
              {fullCommand.slice(0, typedChars)}
              {phase === 'typing' && <span className="animate-blink">|</span>}
            </span>
          </div>

          {/* Progress */}
          {phase !== 'typing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3"
            >
              {phase === 'running' && (
                <div className="space-y-2">
                  <div className="text-gray-500 text-xs">Processing...</div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-tool rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {phase === 'complete' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Created: water-cycle.pptx</span>
                  </div>
                  <div className="text-gray-500 text-xs">
                    File saved to output directory
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Annotation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'complete' ? 1 : 0 }}
        className="mt-3 text-xs text-gray-400 flex items-center gap-2"
      >
        <Terminal className="w-3 h-3 text-tool" />
        <span>Pre-written script executed - same code, same result, every time</span>
      </motion.div>
    </motion.div>
  )
}
