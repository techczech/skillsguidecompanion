import { Player } from '@remotion/player'
import { SkillsExplainer } from '@/remotion/compositions/SkillsExplainer'
import { FPS, TOTAL_DURATION_SECONDS } from '@/remotion/utils/timing'
import { Play, Download, Clock, Film, ChevronRight } from 'lucide-react'

const scenes = [
  { id: 'theProblem', name: 'The Problem', time: '0:00', description: 'AI getting confused on long tasks' },
  { id: 'theLimit', name: 'The Limit', time: '0:15', description: 'Context window filling up' },
  { id: 'theIdea', name: 'The Idea', time: '0:30', description: 'Introducing Skills concept' },
  { id: 'theDemo', name: 'The Demo', time: '0:50', description: 'Skill execution walkthrough' },
  { id: 'theMagic', name: 'The Magic', time: '1:20', description: 'Inside SKILL.md' },
  { id: 'theScripts', name: 'The Scripts', time: '1:50', description: 'Pre-written scripts' },
  { id: 'theReveal', name: 'The Reveal', time: '2:10', description: 'Complete picture' },
  { id: 'callToAction', name: 'Call to Action', time: '2:30', description: 'Next steps' },
]

export function VideoPage() {
  const totalFrames = TOTAL_DURATION_SECONDS * FPS

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Skills Explainer Video</h1>
              <p className="text-gray-400 text-sm mt-1">
                A {formatTime(TOTAL_DURATION_SECONDS)} animated explanation of how LLM Skills work
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>{formatTime(TOTAL_DURATION_SECONDS)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Film className="w-4 h-4" />
                <span>1920x1080</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main player area */}
          <div className="lg:col-span-3">
            {/* Video player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              <Player
                component={SkillsExplainer}
                durationInFrames={totalFrames}
                fps={FPS}
                compositionWidth={1920}
                compositionHeight={1080}
                style={{ width: '100%', height: '100%' }}
                controls
                loop
                clickToPlay
                spaceKeyToPlayOrPause
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="bg-gray-800 rounded-lg px-4 py-3 flex items-center gap-3">
                <Download className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium">Export Video</p>
                  <p className="text-xs text-gray-400">
                    Run <code className="bg-gray-700 px-1 rounded">npm run remotion:render</code>
                  </p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg px-4 py-3 flex items-center gap-3">
                <Play className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm font-medium">Remotion Studio</p>
                  <p className="text-xs text-gray-400">
                    Run <code className="bg-gray-700 px-1 rounded">npm run remotion:studio</code>
                  </p>
                </div>
              </div>
            </div>

            {/* About section */}
            <div className="mt-8 bg-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">About This Video</h2>
              <p className="text-gray-300 leading-relaxed">
                This animated explainer video walks through how LLM Skills work, from the problem
                they solve (context window limits) to the elegant solution (folders with text files).
                The video is built with Remotion and can be exported as an MP4 for sharing.
              </p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">8</div>
                  <div className="text-xs text-gray-400">Scenes</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-400">30</div>
                  <div className="text-xs text-gray-400">FPS</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-400">{totalFrames}</div>
                  <div className="text-xs text-gray-400">Total Frames</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-2xl font-bold text-amber-400">1080p</div>
                  <div className="text-xs text-gray-400">Resolution</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scene list sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                Scenes
              </h3>
              <div className="space-y-2">
                {scenes.map((scene, index) => (
                  <div
                    key={scene.id}
                    className="group p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-medium group-hover:bg-green-600 transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">{scene.name}</span>
                          <span className="text-xs text-gray-500">{scene.time}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{scene.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-4 bg-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <a
                  href="/simulator"
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Interactive Simulator</span>
                </a>
                <a
                  href="/anatomy"
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">Skill Anatomy Explorer</span>
                </a>
                <a
                  href="/builder"
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Build Your Own Skill</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
