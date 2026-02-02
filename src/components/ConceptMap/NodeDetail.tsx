import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { CheckCircle, Circle, ArrowRight, HelpCircle, Lightbulb } from 'lucide-react'
import type { ConceptNode } from '@/data/conceptNodes'
import { conceptNodes } from '@/data/conceptNodes'
import { useProgressStore } from '@/store/progressStore'

interface NodeDetailProps {
  node: ConceptNode
  onComplete: () => void
}

export function NodeDetail({ node, onComplete }: NodeDetailProps) {
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const completedNodes = useProgressStore((s) => s.completedNodes)
  const isCompleted = completedNodes.includes(node.id)

  const handleSubmitQuiz = () => {
    setSubmitted(true)
    if (selectedAnswer === node.quiz?.correct) {
      onComplete()
    }
  }

  const resetQuiz = () => {
    setSelectedAnswer(null)
    setSubmitted(false)
  }

  return (
    <div className="p-4 space-y-6">
      {/* Tagline */}
      <div className="text-sm text-system italic">"{node.tagline}"</div>

      {/* Explanation */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Explanation
        </h3>
        <p className="text-sm text-gray-300 whitespace-pre-line">{node.shortExplanation}</p>
      </div>

      {/* Example */}
      {node.example && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Example
          </h3>
          <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs text-gray-300 whitespace-pre-line">
            {node.example}
          </div>
        </div>
      )}

      {/* Connections */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Connected To
        </h3>
        <div className="space-y-2">
          {node.connections.map((conn, i) => {
            const targetNode = conceptNodes.find((n) => n.id === conn.to)
            const isTargetCompleted = completedNodes.includes(conn.to)

            return (
              <div
                key={i}
                className="flex items-center gap-2 text-sm p-2 bg-gray-950 rounded-lg"
              >
                <ArrowRight className="w-3 h-3 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-200">{targetNode?.title}</span>
                    {isTargetCompleted && (
                      <CheckCircle className="w-3 h-3 text-model" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{conn.relationship}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quiz */}
      {node.quiz && (
        <div>
          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="flex items-center gap-2 text-sm text-system hover:text-system/80 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Test your understanding
          </button>

          {showQuiz && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-4 bg-gray-950 rounded-lg border border-gray-800"
            >
              <p className="text-sm text-gray-200 mb-3">{node.quiz.question}</p>

              <div className="space-y-2">
                {node.quiz.options.map((option, i) => {
                  const isCorrect = i === node.quiz!.correct
                  const isSelected = selectedAnswer === i

                  return (
                    <button
                      key={i}
                      onClick={() => !submitted && setSelectedAnswer(i)}
                      disabled={submitted}
                      className={cn(
                        'w-full flex items-center gap-2 p-2 rounded-lg text-sm text-left transition-colors',
                        !submitted && 'hover:bg-gray-800',
                        isSelected && !submitted && 'bg-gray-800 border border-system',
                        submitted && isCorrect && 'bg-model/20 border border-model',
                        submitted && isSelected && !isCorrect && 'bg-red-500/20 border border-red-500'
                      )}
                    >
                      {submitted ? (
                        isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-model flex-shrink-0" />
                        ) : isSelected ? (
                          <Circle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        )
                      ) : (
                        <Circle
                          className={cn(
                            'w-4 h-4 flex-shrink-0',
                            isSelected ? 'text-system' : 'text-gray-600'
                          )}
                        />
                      )}
                      <span className="text-gray-300">{option}</span>
                    </button>
                  )
                })}
              </div>

              {!submitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={selectedAnswer === null}
                  className="mt-3 w-full py-2 bg-system text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-system/90 transition-colors"
                >
                  Check Answer
                </button>
              ) : (
                <div className="mt-3 space-y-2">
                  <div
                    className={cn(
                      'p-3 rounded-lg text-sm',
                      selectedAnswer === node.quiz.correct
                        ? 'bg-model/10 text-model'
                        : 'bg-red-500/10 text-red-400'
                    )}
                  >
                    {selectedAnswer === node.quiz.correct ? (
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Correct! {node.quiz.explanation}
                      </div>
                    ) : (
                      <div>
                        Not quite. {node.quiz.explanation}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={resetQuiz}
                    className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Mark complete */}
      <div className="pt-4 border-t border-gray-800">
        {isCompleted ? (
          <div className="flex items-center gap-2 text-model text-sm">
            <CheckCircle className="w-4 h-4" />
            You've explored this concept
          </div>
        ) : (
          <button
            onClick={onComplete}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            <Circle className="w-4 h-4" />
            Mark as understood
          </button>
        )}
      </div>
    </div>
  )
}
