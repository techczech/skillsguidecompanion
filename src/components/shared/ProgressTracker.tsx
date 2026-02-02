import { useState, useRef } from 'react'
import { useProgressStore } from '@/store/progressStore'
import { useReaderStore } from '@/store/readerStore'
import { cn } from '@/utils/cn'
import { CheckCircle, Circle, Download, Upload, RotateCcw } from 'lucide-react'
import { articleSections } from '@/data/articleContent'

export function ProgressTracker() {
  const { simulatorCompleted, completedNodes, wizardCompleted, exportProgress, importProgress, resetProgress } = useProgressStore()
  const readSections = useReaderStore((s) => s.readSections)
  const [showActions, setShowActions] = useState(false)
  const [importMessage, setImportMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const articleProgress = readSections.length >= Math.ceil(articleSections.length / 2)

  const milestones = [
    { label: 'Read Article', completed: articleProgress },
    { label: 'Watch Simulator', completed: simulatorCompleted },
    { label: 'Explore Concepts', completed: completedNodes.length >= 4 },
    { label: 'Build a Skill', completed: wizardCompleted },
  ]

  const completedCount = milestones.filter((m) => m.completed).length

  const handleExport = () => {
    const data = exportProgress()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'skills-guide-progress.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      const success = importProgress(content)
      setImportMessage(success ? 'Progress imported!' : 'Invalid file')
      setTimeout(() => setImportMessage(null), 2000)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleReset = () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      resetProgress()
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setShowActions(!showActions)}
          className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          Your Progress
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {completedCount}/{milestones.length}
        </span>
      </div>

      <div className="flex gap-2 mb-3">
        {milestones.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full',
              i < completedCount ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
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
              <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
            )}
            <span className={milestone.completed ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}>
              {milestone.label}
            </span>
          </div>
        ))}
      </div>

      {showActions && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-3 h-3" />
              Export
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Upload className="w-3 h-3" />
              Import
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-2 py-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
          {importMessage && (
            <p className="text-xs text-green-600 dark:text-green-400">{importMessage}</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Progress auto-saves to browser storage
          </p>
        </div>
      )}
    </div>
  )
}
