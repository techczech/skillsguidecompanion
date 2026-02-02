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

  // Auto-play logic
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

  // Build messages for chat based on current step
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
    <div className="h-full flex flex-col">
      {/* Controls bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{step.title}</span>
          <span className="text-xs text-gray-500">
            {currentStep + 1}/{simulatorSteps.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Mode toggle */}
          <button
            onClick={() => setMode(mode === 'auto' ? 'step' : 'auto')}
            className={cn(
              'px-2 py-1 text-xs rounded transition-colors',
              mode === 'auto' ? 'bg-model/20 text-model' : 'bg-gray-800 text-gray-400'
            )}
          >
            {mode === 'auto' ? 'Auto' : 'Step'}
          </button>

          <div className="w-px h-4 bg-gray-700 mx-1" />

          {/* Playback controls */}
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="p-1.5 rounded hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {mode === 'auto' ? (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded hover:bg-gray-800 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="p-1.5 rounded bg-model/20 text-model hover:bg-model/30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={isLastStep}
            className="p-1.5 rounded hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-gray-700 mx-1" />

          <button
            onClick={handleReset}
            className="p-1.5 rounded hover:bg-gray-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-800">
        <motion.div
          className="h-full bg-model"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / simulatorSteps.length) * 100}%` }}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat interface */}
        <div className="w-1/2 border-r border-gray-800">
          <ChatInterface
            messages={messages}
            isThinking={step.phase === 'thinking'}
            className="h-full"
          />
        </div>

        {/* Right: Behind the scenes */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence mode="wait">
              {/* System prompt phase */}
              {(step.phase === 'system-prompt' || step.phase === 'setup') && (
                <SystemPromptPanel
                  key="system-prompt"
                  content={systemPromptContent}
                  highlightLines={step.phase === 'system-prompt' ? ['pptx', 'docx', 'pdf'] : []}
                  isVisible={true}
                />
              )}

              {/* Thinking phase */}
              {step.phase === 'thinking' && (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-gray-900 rounded-lg border border-gray-800"
                >
                  <div className="text-sm text-gray-400 mb-2">Model is reasoning...</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">User wants:</span>
                      <span className="text-model">PowerPoint presentation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Available skill:</span>
                      <span className="text-system">pptx</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Action:</span>
                      <span className="text-tool">Read SKILL.md for instructions</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tool call read phase */}
              {step.phase === 'tool-call-read' && (
                <ToolCallDisplay key="tool-read" toolCall={toolCallRead} isVisible={true} />
              )}

              {/* File contents phase */}
              {step.phase === 'file-contents' && (
                <FileViewer
                  key="file-contents"
                  path="skills/pptx/SKILL.md"
                  content={skillMdContent}
                  isVisible={true}
                  highlightSections={['html2pptx.js', 'presentations']}
                />
              )}

              {/* Tool call execute phase */}
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

              {/* Terminal phase */}
              {step.phase === 'terminal' && (
                <TerminalAnimation
                  key="terminal"
                  command="node scripts/html2pptx.js"
                  args={['--input', 'slides.html', '--output', 'water-cycle.pptx']}
                  isVisible={true}
                />
              )}

              {/* Response phase */}
              {step.phase === 'response' && (
                <motion.div
                  key="response"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-gray-900 rounded-lg border border-model/30"
                >
                  <div className="text-model text-sm font-medium mb-2">
                    Result sent back to model
                  </div>
                  <div className="text-sm text-gray-300">
                    The script executed successfully. Claude can now tell the user their
                    presentation is ready.
                  </div>
                </motion.div>
              )}

              {/* Reveal phase */}
              {step.phase === 'reveal' && (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg border border-gray-700"
                >
                  <h3 className="text-lg font-semibold mb-4">The Complete Flow</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'User request', color: 'user', text: 'Text in' },
                      { label: 'Model reads skill', color: 'system', text: 'Text processing' },
                      { label: 'Tool call output', color: 'tool', text: 'Text out (JSON)' },
                      { label: 'Script executes', color: 'tool', text: 'Software intercepts' },
                      { label: 'Result returned', color: 'model', text: 'Text back in' },
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
                            item.color === 'user' && 'bg-user',
                            item.color === 'model' && 'bg-model',
                            item.color === 'tool' && 'bg-tool',
                            item.color === 'system' && 'bg-system'
                          )}
                        />
                        <span className="text-sm text-gray-300">{item.label}</span>
                        <span className="text-xs text-gray-500 ml-auto">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-400">
                    Just folders with text files. No magic.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Narration bar */}
          {step.narration && (
            <div className="px-4 py-3 border-t border-gray-800 bg-gray-900/50">
              <p className="text-sm text-gray-300">{step.narration}</p>
              {step.expandable && (
                <button
                  onClick={() => setShowExpandable(!showExpandable)}
                  className="flex items-center gap-1 text-xs text-system hover:text-system/80 mt-2 transition-colors"
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
                    className="mt-2 p-3 bg-system/10 rounded-lg text-xs text-gray-300 border border-system/20"
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
