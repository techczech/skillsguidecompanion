import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Bot, User, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: 'user' | 'model'
  content: string
}

interface ChatHistory {
  role: 'user' | 'model'
  parts: { text: string }[]
}

interface TokenUsage {
  promptTokens: number
  responseTokens: number
  totalTokens: number
}

export function AskChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionTokens, setSessionTokens] = useState(0)
  const [showContext, setShowContext] = useState(false)
  const [contextData, setContextData] = useState<{ systemPrompt: string; description: string } | null>(null)
  const [contextExpanded, setContextExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch context data when toggle is enabled
  useEffect(() => {
    if (showContext && !contextData) {
      fetch('/api/context')
        .then(res => res.json())
        .then(data => setContextData(data))
        .catch(err => console.error('Failed to fetch context:', err))
    }
  }, [showContext, contextData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const history: ChatHistory[] = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.response
      }

      setMessages(prev => [...prev, assistantMessage])

      // Track token usage
      if (data.tokenUsage) {
        setSessionTokens(prev => prev + (data.tokenUsage as TokenUsage).totalTokens)
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const clearChat = () => {
    setMessages([])
    setSessionTokens(0)
  }

  const suggestedQuestions = [
    "What are Skills?",
    "How does tool calling work?",
    "What is a context window?",
    "How are Skills different from Custom GPTs?"
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* Context Transparency Toggle */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowContext(!showContext)}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            {showContext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            Context Transparency
          </button>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Session tokens: {sessionTokens.toLocaleString()}
          </div>
        </div>

        {showContext && contextData && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3"
          >
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setContextExpanded(!contextExpanded)}
                className="w-full px-3 py-2 flex items-center justify-between text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span>Full System Prompt (includes complete article)</span>
                {contextExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {contextExpanded && (
                <div className="px-3 pb-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {contextData.description}
                  </p>
                  <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded overflow-auto max-h-64 whitespace-pre-wrap font-mono text-gray-700 dark:text-gray-300">
                    {contextData.systemPrompt}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
              <Bot className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Ask about LLM Skills
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              I can answer questions about how Skills work, tool calling, context windows,
              and other LLM concepts covered in the article.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => setInput(question)}
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'model' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {message.role === 'model' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:my-2 prose-pre:bg-gray-200 dark:prose-pre:bg-gray-700 prose-pre:p-2 prose-pre:rounded prose-code:text-purple-600 dark:prose-code:text-purple-400">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </p>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 text-gray-500 dark:text-gray-400 animate-spin" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="flex gap-3">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearChat}
              className="p-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about Skills..."
              rows={1}
              className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Powered by Gemini 3 Flash Preview. Max 1,000 tokens per response.
        </p>
      </div>
    </div>
  )
}
