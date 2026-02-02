import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { CheckCircle, Circle, ArrowRight, HelpCircle, Lightbulb, MessageCircle, Send, Loader2 } from 'lucide-react'
import type { ConceptNode } from '@/data/conceptNodes'
import { conceptNodes } from '@/data/conceptNodes'
import { useProgressStore } from '@/store/progressStore'
import ReactMarkdown from 'react-markdown'

interface ChatMessage {
  id: string
  role: 'user' | 'model'
  content: string
}

interface NodeDetailProps {
  node: ConceptNode
  onComplete: () => void
}

export function NodeDetail({ node, onComplete }: NodeDetailProps) {
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const completedNodes = useProgressStore((s) => s.completedNodes)
  const isCompleted = completedNodes.includes(node.id)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Reset chat when node changes
  useEffect(() => {
    setChatMessages([])
    setChatInput('')
    setShowChat(false)
  }, [node.id])

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

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || chatLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput.trim()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setChatLoading(true)

    try {
      const history = chatMessages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }))

      const response = await fetch('/api/concept-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          concept: {
            title: node.title,
            tagline: node.tagline,
            explanation: node.shortExplanation,
            example: node.example
          },
          history
        })
      })

      const data = await response.json()

      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.response || 'Sorry, I could not respond.'
      }])
    } catch {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: 'Sorry, something went wrong.'
      }])
    } finally {
      setChatLoading(false)
    }
  }

  const quickPrompts = [
    "Give me another example",
    "How does this relate to Skills?",
    "Why is this important?"
  ]

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

      {/* Chat about concept */}
      <div>
        <button
          onClick={() => setShowChat(!showChat)}
          className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {showChat ? 'Hide chat' : 'Ask about this concept'}
        </button>

        {showChat && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Chat messages */}
            <div className="max-h-48 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {chatMessages.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-500 mb-3">Ask a question or try:</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {quickPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => setChatInput(prompt)}
                        className="text-xs px-2 py-1 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'text-xs rounded-lg p-2',
                      msg.role === 'user'
                        ? 'bg-purple-100 text-purple-800 ml-4'
                        : 'bg-white border border-gray-200 text-gray-700 mr-4'
                    )}
                  >
                    {msg.role === 'model' ? (
                      <div className="prose prose-xs max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mr-4">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat input */}
            <form onSubmit={handleChatSubmit} className="flex gap-2 p-2 bg-white border-t border-gray-200">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about this concept..."
                className="flex-1 text-xs px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="p-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 hover:bg-purple-700 transition-colors"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </motion.div>
        )}
      </div>

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
