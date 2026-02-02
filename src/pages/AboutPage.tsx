import { motion } from 'framer-motion'
import { ExternalLink, Github, BookOpen, Cpu, ArrowRight, User } from 'lucide-react'

export function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">About This Guide</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            An interactive companion to help you understand how LLM Skills work.
          </p>
        </motion.div>

        {/* Author */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Created by Dominik Lukes
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This guide and the original article were written by Dominik Lukes, who explores
                the intersection of language, technology, and learning.
              </p>
              <a
                href="https://dominiklukes.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Visit dominiklukes.net
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Original Article */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Based on the Article
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This interactive guide is a companion to the Substack article that explains
                the surprisingly simple architecture behind LLM Skills.
              </p>
              <a
                href="https://schemasandpropositions.substack.com/p/weve-been-using-ai-wrong-agent-skills"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Read the Original Article
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* How it was built */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Cpu className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Built with Claude Code
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This entire interactive guide was created using Claude Code. The Product
                Requirements Document (PRD) was designed collaboratively, and Claude Code
                implemented the complete prototype - from component architecture to animations.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tech Stack</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    React 19 + TypeScript
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    Vite for build tooling
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    Tailwind CSS for styling
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    Framer Motion for animations
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    Zustand for state management
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    Deployed on Cloudflare Pages
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* GitHub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Open Source
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The source code for this guide is available on GitHub. Feel free to explore,
                fork, or contribute.
              </p>
              <a
                href="https://github.com/techczech/skillsguidecompanion"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>
          </div>
        </motion.div>

        {/* Key Concepts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-green-50 to-purple-50 dark:from-green-900/20 dark:to-purple-900/20 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            What You'll Learn
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Skills are just folders',
                desc: 'Text files that Claude reads on demand',
              },
              {
                title: 'LLMs only do text',
                desc: 'Everything else is software intercepting output',
              },
              {
                title: 'Context window limits',
                desc: 'Why skills load instructions just-in-time',
              },
              {
                title: 'Tool calling patterns',
                desc: 'How JSON output becomes real actions',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
