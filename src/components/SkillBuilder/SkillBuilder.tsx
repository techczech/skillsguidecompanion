import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Folder,
  FileText,
  Download,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react'
import { useProgressStore } from '@/store/progressStore'

interface SkillDesign {
  task: string
  name: string
  description: string
  references: string[]
  scripts: string[]
}

const initialDesign: SkillDesign = {
  task: '',
  name: '',
  description: '',
  references: [],
  scripts: [],
}

const suggestedReferences = [
  { id: 'template', label: 'Template/format example', hint: 'Shows Claude what output should look like' },
  { id: 'style-guide', label: 'Style guide', hint: 'Tone, formatting rules, brand voice' },
  { id: 'examples', label: 'Input/output examples', hint: 'Sample transformations' },
  { id: 'rules', label: 'Business rules', hint: 'Domain-specific constraints' },
]

const suggestedScripts = [
  { id: 'count', label: 'Counting/arithmetic', hint: 'LLMs are bad at precise counting' },
  { id: 'dates', label: 'Date calculations', hint: 'LLMs struggle with date math' },
  { id: 'convert', label: 'File format conversion', hint: 'e.g., docx to md, html to pdf' },
  { id: 'api', label: 'External API calls', hint: 'e.g., send email, update calendar' },
]

export function SkillBuilder() {
  const [step, setStep] = useState(1)
  const [design, setDesign] = useState<SkillDesign>(initialDesign)
  const [copied, setCopied] = useState(false)
  const markWizardComplete = useProgressStore((s) => s.markWizardComplete)

  const totalSteps = 5

  const canProceed = () => {
    switch (step) {
      case 1:
        return design.task.length > 10
      case 2:
        return design.name.length > 0 && design.description.length > 10
      default:
        return true
    }
  }

  const generateNameFromTask = (task: string): string => {
    return task
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter((w) => w.length > 2)
      .slice(0, 3)
      .join('-')
  }

  const generateDescriptionFromTask = (task: string): string => {
    return `Automate the process of ${task.toLowerCase()}. Analyzes input content and produces formatted output according to specified requirements.`
  }

  const handleTaskChange = (task: string) => {
    setDesign({
      ...design,
      task,
      name: generateNameFromTask(task),
      description: generateDescriptionFromTask(task),
    })
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      markWizardComplete()
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleReset = () => {
    setStep(1)
    setDesign(initialDesign)
  }

  const generateSkillMd = (): string => {
    return `---
name: ${design.name}
description: ${design.description}
---

# ${design.name.toUpperCase()} SKILL

## When to use this skill

Use this skill when the user asks to:
- ${design.task}

## Instructions

1. Read the user's input carefully
2. Apply the transformation rules from the references
3. Generate the output in the specified format

${
  design.references.length > 0
    ? `## Reference files

See \`references/\` for:
${design.references.map((r) => `- ${r}`).join('\n')}`
    : ''
}

${
  design.scripts.length > 0
    ? `## Available scripts

${design.scripts.map((s) => `- \`${s}\` - [Description needed]`).join('\n')}`
    : ''
}`
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateSkillMd())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% complete</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-model"
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[400px]"
        >
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">What do you want to automate?</h2>
              <p className="text-gray-400 text-sm mb-6">
                Describe the task you want Claude to help with. Be specific about inputs
                and outputs.
              </p>

              <textarea
                value={design.task}
                onChange={(e) => handleTaskChange(e.target.value)}
                placeholder="e.g., Format my meeting notes into a template with action items extracted and assigned to people"
                className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-model transition-colors resize-none"
              />

              <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                <div className="flex items-start gap-2 text-sm">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div className="text-gray-400">
                    <span className="text-gray-300">Examples:</span>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• Convert recipes to shopping lists</li>
                      <li>• Generate social media posts from blog articles</li>
                      <li>• Create flashcards from lecture notes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Your skill description</h2>
              <p className="text-gray-400 text-sm mb-6">
                This is what appears in Claude's system prompt. Keep it concise.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Skill name</label>
                  <input
                    type="text"
                    value={design.name}
                    onChange={(e) => setDesign({ ...design, name: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-model transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    value={design.description}
                    onChange={(e) => setDesign({ ...design, description: e.target.value })}
                    className="w-full h-24 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-model transition-colors resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {design.description.length}/200 characters (keep under 200 to save context)
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-system/10 rounded-lg border border-system/20">
                <div className="flex items-start gap-2 text-sm">
                  <Lightbulb className="w-4 h-4 text-system mt-0.5 flex-shrink-0" />
                  <div className="text-gray-400">
                    <span className="text-system">Tip:</span> Add trigger words like "when user
                    mentions" or "when user asks to" to help Claude know when to use this skill.
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Reference files</h2>
              <p className="text-gray-400 text-sm mb-6">
                What additional information would Claude need? These become files in your
                references/ folder.
              </p>

              <div className="space-y-2">
                {suggestedReferences.map((ref) => (
                  <label
                    key={ref.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                      design.references.includes(ref.id)
                        ? 'bg-model/10 border-model/30'
                        : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={design.references.includes(ref.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDesign({ ...design, references: [...design.references, ref.id] })
                        } else {
                          setDesign({
                            ...design,
                            references: design.references.filter((r) => r !== ref.id),
                          })
                        }
                      }}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-gray-200">{ref.label}</div>
                      <div className="text-xs text-gray-500">{ref.hint}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Scripts (optional)</h2>
              <p className="text-gray-400 text-sm mb-6">
                Would any scripts help? Use these for tasks LLMs aren't great at.
              </p>

              <div className="space-y-2">
                {suggestedScripts.map((script) => (
                  <label
                    key={script.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                      design.scripts.includes(script.id)
                        ? 'bg-tool/10 border-tool/30'
                        : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={design.scripts.includes(script.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDesign({ ...design, scripts: [...design.scripts, script.id] })
                        } else {
                          setDesign({
                            ...design,
                            scripts: design.scripts.filter((s) => s !== script.id),
                          })
                        }
                      }}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-gray-200">{script.label}</div>
                      <div className="text-xs text-gray-500">{script.hint}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                <div className="flex items-start gap-2 text-sm text-gray-400">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  It's OK to start without scripts. You can always add them later!
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Your skill structure</h2>
              <p className="text-gray-400 text-sm mb-6">
                Here's what your skill would look like. This is a valid structure you could use
                in Claude Desktop today.
              </p>

              {/* Folder structure */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-4">
                <div className="flex items-center gap-2 text-sm mb-3">
                  <Folder className="w-4 h-4 text-yellow-500" />
                  <span className="font-mono text-model">{design.name}/</span>
                </div>
                <div className="ml-6 space-y-1 text-sm font-mono">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300">SKILL.md</span>
                  </div>
                  {design.references.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-300">references/</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        {design.references.map((ref) => (
                          <div key={ref} className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-400">{ref}.md</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {design.scripts.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-300">scripts/</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        {design.scripts.map((script) => (
                          <div key={script} className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-400">{script}.py</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SKILL.md preview */}
              <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                  <span className="text-xs text-gray-400">SKILL.md preview</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 text-xs font-mono text-gray-300 overflow-x-auto max-h-64">
                  {generateSkillMd()}
                </pre>
              </div>

              {/* Success message */}
              <div className="mt-4 p-4 bg-model/10 rounded-lg border border-model/30">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-model flex-shrink-0" />
                  <div>
                    <div className="font-medium text-model">Nice work!</div>
                    <div className="text-sm text-gray-400 mt-1">
                      This is a valid skill structure. You could use this in Claude Desktop today
                      by placing it in your skills directory.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
        <button
          onClick={step === 5 ? handleReset : handlePrev}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
        >
          {step === 5 ? (
            <>
              <RotateCcw className="w-4 h-4" />
              Start over
            </>
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              Back
            </>
          )}
        </button>

        {step < 5 ? (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
              canProceed()
                ? 'bg-model text-white hover:bg-model/90'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            )}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-model text-white rounded-lg font-medium hover:bg-model/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download SKILL.md
          </button>
        )}
      </div>
    </div>
  )
}
