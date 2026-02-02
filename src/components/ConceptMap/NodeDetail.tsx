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
      <div className="text-sm text-purple-600 italic">"{node.tagline}"</div>

      {/* Explanation */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Explanation
        </h3>
        <p className="text-sm text-gray-700 whitespace-pre-line">{node.shortExplanation}</p>
      </div>

      {/* Example */}
      {node.example && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Example
          </h3>
          <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-700 whitespace-pre-line border border-gray-200">
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
                className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded-lg border border-gray-100"
              >
                <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-800">{targetNode?.title}</span>
                    {isTargetCompleted && (
                      <CheckCircle className="w-3 h-3 text-green-500" />
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
            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Test your understanding
          </button>

          {showQuiz && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <p className="text-sm text-gray-800 mb-3">{node.quiz.question}</p>

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
                        'w-full flex items-center gap-2 p-2 rounded-lg text-sm text-left transition-colors border',
                        !submitted && 'hover:bg-white hover:border-gray-300',
                        !submitted && !isSelected && 'bg-white border-gray-200',
                        isSelected && !submitted && 'bg-purple-50 border-purple-300',
                        submitted && isCorrect && 'bg-green-50 border-green-300',
                        submitted && isSelected && !isCorrect && 'bg-red-50 border-red-300',
                        submitted && !isSelected && !isCorrect && 'bg-white border-gray-200'
                      )}
                    >
                      {submitted ? (
                        isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : isSelected ? (
                          <Circle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        )
                      ) : (
                        <Circle
                          className={cn(
                            'w-4 h-4 flex-shrink-0',
                            isSelected ? 'text-purple-600' : 'text-gray-300'
                          )}
                        />
                      )}
                      <span className="text-gray-700">{option}</span>
                    </button>
                  )
                })}
              </div>

              {!submitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={selectedAnswer === null}
                  className="mt-3 w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                >
                  Check Answer
                </button>
              ) : (
                <div className="mt-3 space-y-2">
                  <div
                    className={cn(
                      'p-3 rounded-lg text-sm',
                      selectedAnswer === node.quiz.correct
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
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
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
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
      <div className="pt-4 border-t border-gray-200">
        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            You've explored this concept
          </div>
        ) : (
          <button
            onClick={onComplete}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Circle className="w-4 h-4" />
            Mark as understood
          </button>
        )}
      </div>
    </div>
  )
}
