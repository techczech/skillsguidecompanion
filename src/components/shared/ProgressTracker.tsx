import { useProgressStore } from '@/store/progressStore'
import { cn } from '@/utils/cn'
import { CheckCircle, Circle } from 'lucide-react'

export function ProgressTracker() {
  const { simulatorCompleted, completedNodes, wizardCompleted } = useProgressStore()

  const milestones = [
    { label: 'Watch Simulator', completed: simulatorCompleted },
    { label: 'Explore Concepts', completed: completedNodes.length >= 4 },
    { label: 'View Skill Files', completed: false },
    { label: 'Build a Skill', completed: wizardCompleted },
  ]

  const completedCount = milestones.filter((m) => m.completed).length

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-900">Your Progress</span>
        <span className="text-sm text-gray-500">
          {completedCount}/{milestones.length}
        </span>
      </div>

      <div className="flex gap-2 mb-3">
        {milestones.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full',
              i < completedCount ? 'bg-green-500' : 'bg-gray-200'
            )}
          />
        ))}
      </div>

      <div className="space-y-2">
        {milestones.map((milestone, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            {milestone.completed ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Circle className="w-4 h-4 text-gray-300" />
            )}
            <span className={milestone.completed ? 'text-gray-700' : 'text-gray-400'}>
              {milestone.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
