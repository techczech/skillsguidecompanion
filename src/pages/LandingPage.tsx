import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Map, FolderTree, Wrench, ArrowRight, Sparkles } from 'lucide-react'
import { ProgressTracker } from '@/components/shared/ProgressTracker'

const features = [
  {
    icon: Play,
    title: 'Skill Execution Simulator',
    description: 'Watch a skill execute step-by-step. See exactly how Claude reads instructions and runs scripts.',
    link: '/simulator',
    color: 'model',
  },
  {
    icon: Map,
    title: 'Concept Map',
    description: 'Explore the ideas behind Skills. Understand context windows, tool calling, and more.',
    link: '/concepts',
    color: 'system',
  },
  {
    icon: FolderTree,
    title: 'Skill Anatomy Explorer',
    description: 'Browse a real skill\'s file structure with explanations. See what\'s inside SKILL.md.',
    link: '/anatomy',
    color: 'tool',
  },
  {
    icon: Wrench,
    title: 'Build Your Own Skill',
    description: 'Design a skill concept step-by-step. Get a working structure you can use today.',
    link: '/builder',
    color: 'user',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
            <Sparkles className="w-4 h-4" />
            Interactive Learning Experience
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
        >
          How LLM Skills Work
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
        >
          Understand the surprisingly simple system that lets Claude execute complex tasks.
          <span className="text-gray-900 font-medium"> Just folders with text files.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/simulator"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
          >
            <Play className="w-5 h-5" />
            Start with the Simulator
          </Link>
          <Link
            to="/concepts"
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
          >
            Explore Concepts
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>

      {/* Features grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <Link
                to={feature.link}
                className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      feature.color === 'model'
                        ? 'bg-green-100'
                        : feature.color === 'system'
                        ? 'bg-purple-100'
                        : feature.color === 'tool'
                        ? 'bg-orange-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    <feature.icon
                      className={`w-6 h-6 ${
                        feature.color === 'model'
                          ? 'text-green-600'
                          : feature.color === 'system'
                          ? 'text-purple-600'
                          : feature.color === 'tool'
                          ? 'text-orange-600'
                          : 'text-blue-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key insights */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Key Insights You'll Discover</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Skills are just folders with text files',
                desc: 'The anti-climactic reveal that powers everything',
              },
              {
                title: 'LLMs only read and write text',
                desc: 'Tool use is text output that software intercepts',
              },
              {
                title: 'Context window is the fundamental constraint',
                desc: 'Skills elegantly work around it',
              },
              {
                title: "Semantic understanding isn't magic",
                desc: "It's predictable, learnable, exploitable",
              },
            ].map((insight, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold">{i + 1}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{insight.title}</div>
                  <div className="text-sm text-gray-500">{insight.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress sidebar hint */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1">
            <h3 className="font-semibold mb-2 text-gray-900">Track your progress</h3>
            <p className="text-sm text-gray-500">
              Your progress is saved locally. Complete all four experiences to fully understand
              how Skills work.
            </p>
          </div>
          <div className="w-full sm:w-64">
            <ProgressTracker />
          </div>
        </div>
      </div>
    </div>
  )
}
