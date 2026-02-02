import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { User, Bot, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isTyping?: boolean
}

interface ChatInterfaceProps {
  messages: Message[]
  isThinking?: boolean
  className?: string
}

export function ChatInterface({ messages, isThinking, className }: ChatInterfaceProps) {
  return (
    <div className={cn('flex flex-col h-full bg-white', className)}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm font-medium text-gray-900">Chat</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-green-600" />
                </div>
              )}

              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2 shadow-sm',
                  message.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                )}
              >
                <p className={message.isTyping ? 'typing-cursor' : ''}>
                  {message.content}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-green-600" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Claude is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3 text-gray-400">
          <span className="text-sm">Type a message...</span>
        </div>
      </div>
    </div>
  )
}
