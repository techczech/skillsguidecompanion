import { motion } from 'framer-motion'
import { AskChat } from '@/components/AskChat/AskChat'

export function AskPage() {
  return (
    <div className="min-h-screen py-4">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Ask About Skills
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Chat with an AI assistant about LLM Skills, tool calling, and how language models work.
          </p>
        </motion.div>
        <AskChat />
      </div>
    </div>
  )
}
