import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  ChevronRight,
  Info,
} from 'lucide-react'
import { ChatInterface } from './ChatInterface'
import { SystemPromptPanel } from './SystemPromptPanel'
import { ToolCallDisplay } from './ToolCallDisplay'
import { FileViewer } from './FileViewer'
import { TerminalAnimation } from './TerminalAnimation'
import {
  simulatorSteps,
  systemPromptContent,
  skillMdContent,
  toolCallRead,
  toolCallExecute,
} from '@/data/simulatorSteps'
import { useProgressStore } from '@/store/progressStore'

type Mode = 'auto' | 'step'

export function SimulatorController() {
  const [currentStep, setCurrentStep] = useState(0)
  const [mode, setMode] = useState<Mode>('step')
  const [isPlaying, setIsPlaying] = useState(false)
  const [showExpandable, setShowExpandable] = useState(false)
  const markSimulatorComplete = useProgressStore((s) => s.markSimulatorComplete)

  const step = simulatorSteps[currentStep]
  const isLastStep = currentStep === simulatorSteps.length - 1

  useEffect(() => {
    if (mode !== 'auto' || !isPlaying) return

    const timer = setTimeout(() => {
      if (currentStep < simulatorSteps.length - 1) {
        setCurrentStep((s) => s + 1)
      } else {
        setIsPlaying(false)
        markSimulatorComplete()
      }
    }, step.duration)

    return () => clearTimeout(timer)
  }, [mode, isPlaying, currentStep, step.duration, markSimulatorComplete])

  const handleNext = useCallback(() => {
    if (currentStep < simulatorSteps.length - 1) {
      setCurrentStep((s) => s + 1)
      setShowExpandable(false)
    } else {
      markSimulatorComplete()
    }
  }, [currentStep, markSimulatorComplete])

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
      setShowExpandable(false)
    }
  }, [currentStep])

  const handleReset = useCallback(() => {
    setCurrentStep(0)
    setIsPlaying(false)
    setShowExpandable(false)
  }, [])

  const messages = []
  if (currentStep >= 0) {
    messages.push({
      role: 'user' as const,
      content: 'Create a PowerPoint about the water cycle',
    })
  }
  if (step.phase === 'response' || step.phase === 'reveal') {
    messages.push({
      role: 'assistant' as const,
      content:
        "I've created your presentation about the water cycle. The file has been saved as water-cycle.pptx with 8 slides covering evaporation, condensation, precipitation, and collection.",
    })
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Controls bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{step.title}</span>
          <span className="text-xs text-gray-500">
            {currentStep + 1}/{simulatorSteps.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode(mode === 'auto' ? 'step' : 'auto')}
            className={cn(
              'px-2 py-1 text-xs rounded transition-colors',
              mode === 'auto' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            )}
          >
            {mode === 'auto' ? 'Auto' : 'Step'}
          </button>

          <div className="w-px h-4 bg-gray-200 mx-1" />

          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <SkipBack className="w-4 h-4 text-gray-600" />
          </button>

          {mode === 'auto' ? (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-gray-600" /> : <Play className="w-4 h-4 text-gray-600" />}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="p-1.5 rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={isLastStep}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <SkipForward className="w-4 h-4 text-gray-600" />
          </button>

          <div className="w-px h-4 bg-gray-200 mx-1" />

          <button
            onClick={handleReset}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <motion.div
          className="h-full bg-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / simulatorSteps.length) * 100}%` }}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat interface */}
        <div className="w-1/2 border-r border-gray-200">
          <ChatInterface
            messages={messages}
            isThinking={step.phase === 'thinking'}
            className="h-full"
          />
        </div>

        {/* Right: Behind the scenes */}
        <div className="w-1/2 flex flex-col overflow-hidden bg-gray-100">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence mode="wait">
              {(step.phase === 'system-prompt' || step.phase === 'setup') && (
                <SystemPromptPanel
                  key="system-prompt"
                  content={systemPromptContent}
                  highlightLines={step.phase === 'system-prompt' ? ['pptx', 'docx', 'pdf'] : []}
                  isVisible={true}
                />
              )}

              {step.phase === 'thinking' && (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="text-sm text-gray-500 mb-2">Model is reasoning...</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">User wants:</span>
                      <span className="text-green-600 font-medium">PowerPoint presentation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Available skill:</span>
                      <span className="text-purple-600 font-medium">pptx</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Action:</span>
                      <span className="text-orange-600 font-medium">Read SKILL.md for instructions</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {step.phase === 'tool-call-read' && (
                <ToolCallDisplay key="tool-read" toolCall={toolCallRead} isVisible={true} />
              )}

              {step.phase === 'file-contents' && (
                <FileViewer
                  key="file-contents"
                  path="skills/pptx/SKILL.md"
                  content={skillMdContent}
                  isVisible={true}
                  highlightSections={['html2pptx.js', 'presentations']}
                />
              )}

              {step.phase === 'tool-call-execute' && (
                <div key="tool-execute" className="space-y-4">
                  <FileViewer
                    path="skills/pptx/SKILL.md"
                    content={skillMdContent}
                    isVisible={true}
                    highlightSections={['html2pptx.js']}
                  />
                  <ToolCallDisplay toolCall={toolCallExecute} isVisible={true} />
                </div>
              )}

              {step.phase === 'terminal' && (
                <TerminalAnimation
                  key="terminal"
                  command="node scripts/html2pptx.js"
                  args={['--input', 'slides.html', '--output', 'water-cycle.pptx']}
                  isVisible={true}
                />
              )}

              {step.phase === 'response' && (
                <motion.div
                  key="response"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-white rounded-lg border border-green-200 shadow-sm"
                >
                  <div className="text-green-700 text-sm font-medium mb-2">
                    Result sent back to model
                  </div>
                  <div className="text-sm text-gray-600">
                    The script executed successfully. Claude can now tell the user their
                    presentation is ready.
                  </div>
                </motion.div>
              )}

              {step.phase === 'reveal' && (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">The Complete Flow</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'User request', color: 'blue', text: 'Text in' },
                      { label: 'Model reads skill', color: 'purple', text: 'Text processing' },
                      { label: 'Tool call output', color: 'orange', text: 'Text out (JSON)' },
                      { label: 'Script executes', color: 'orange', text: 'Software intercepts' },
                      { label: 'Result returned', color: 'green', text: 'Text back in' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            item.color === 'blue' && 'bg-blue-500',
                            item.color === 'green' && 'bg-green-500',
                            item.color === 'orange' && 'bg-orange-500',
                            item.color === 'purple' && 'bg-purple-500'
                          )}
                        />
                        <span className="text-sm text-gray-700">{item.label}</span>
                        <span className="text-xs text-gray-400 ml-auto">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                    Just folders with text files. No magic.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step.narration && (
            <div className="px-4 py-3 border-t border-gray-200 bg-white">
              <p className="text-sm text-gray-700">{step.narration}</p>
              {step.expandable && (
                <button
                  onClick={() => setShowExpandable(!showExpandable)}
                  className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 mt-2 transition-colors"
                >
                  <Info className="w-3 h-3" />
                  {step.expandable.title}
                </button>
              )}

              <AnimatePresence>
                {showExpandable && step.expandable && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-3 bg-purple-50 rounded-lg text-xs text-gray-700 border border-purple-100"
                  >
                    {step.expandable.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
