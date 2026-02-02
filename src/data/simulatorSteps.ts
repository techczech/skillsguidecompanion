export interface SimulatorStep {
  id: string
  phase: 'setup' | 'system-prompt' | 'thinking' | 'tool-call-read' | 'file-contents' | 'tool-call-execute' | 'terminal' | 'response' | 'reveal'
  title: string
  narration: string | null
  expandable?: {
    title: string
    content: string
  }
  duration: number // ms for auto-play
}

export const simulatorSteps: SimulatorStep[] = [
  {
    id: 'setup',
    phase: 'setup',
    title: 'The Setup',
    narration: null,
    duration: 2000,
  },
  {
    id: 'system-prompt',
    phase: 'system-prompt',
    title: 'System Prompt Reveal',
    narration: 'Claude always has access to a list of available skills in its system prompt',
    expandable: {
      title: "What's a system prompt?",
      content: "A hidden prompt sent with every message you send. Claude's system prompt is about 3,000 words and defines its personality, capabilities, and lists all available Skills.",
    },
    duration: 4000,
  },
  {
    id: 'thinking',
    phase: 'thinking',
    title: 'The Decision',
    narration: 'The model recognizes it needs the PowerPoint skill based on the user request',
    duration: 3000,
  },
  {
    id: 'tool-call-read',
    phase: 'tool-call-read',
    title: 'Tool Call: Read SKILL.md',
    narration: 'The model outputs a tool call to read the skill instructions',
    expandable: {
      title: "What's a tool call?",
      content: "When the model outputs specially formatted text (usually JSON) that the software intercepts and executes. The model itself can only read and write text.",
    },
    duration: 3000,
  },
  {
    id: 'file-contents',
    phase: 'file-contents',
    title: 'Reading Instructions',
    narration: 'The SKILL.md file tells Claude exactly what to do and what scripts are available',
    duration: 4000,
  },
  {
    id: 'tool-call-execute',
    phase: 'tool-call-execute',
    title: 'Following Instructions',
    narration: 'The skill tells the model to use html2pptx.js for creating presentations',
    duration: 3000,
  },
  {
    id: 'terminal',
    phase: 'terminal',
    title: 'Script Execution',
    narration: 'The pre-written script runs - same code, same result, every time',
    expandable: {
      title: 'Why pre-written scripts?',
      content: "LLMs can write code, but they're not 100% reliable. Pre-written scripts are tested and consistent. The model just needs to call them with the right parameters.",
    },
    duration: 4000,
  },
  {
    id: 'response',
    phase: 'response',
    title: 'The Response',
    narration: 'Claude responds with the result and a download link for the presentation',
    duration: 3000,
  },
  {
    id: 'reveal',
    phase: 'reveal',
    title: 'The Reveal',
    narration: "And that's it. Folders with text files. No magic - just well-organized instructions.",
    duration: 4000,
  },
]

export const systemPromptContent = `You are Claude, a helpful AI assistant by Anthropic.

## Available Skills
You have access to the following skills:
- **pptx**: Create and edit PowerPoint presentations
- **docx**: Create and edit Word documents
- **pdf**: Read and analyze PDF files
- **skill-creator**: Help users build new skills

When a user request matches a skill, read the SKILL.md file first.`

export const skillMdContent = `---
name: pptx
description: Create and edit PowerPoint presentations
---

# PPTX SKILL

## When to use this skill
Use this skill when the user asks to:
- Create a new presentation
- Modify existing .pptx files
- Convert content to slides

## Instructions
For creating presentations from scratch:
1. Generate HTML with slide structure
2. Use html2pptx.js to convert

## Available scripts
- \`html2pptx.js\` - Convert HTML to PowerPoint
- \`rearrange.py\` - Reorder slides

## Reference files
See \`references/\` for:
- Layout templates
- Theme specifications`

export const toolCallRead = {
  name: "read_file",
  arguments: {
    path: "skills/pptx/SKILL.md"
  }
}

export const toolCallExecute = {
  name: "execute_shell_command",
  arguments: {
    command: "node scripts/html2pptx.js",
    args: ["--input", "temp/slides.html", "--output", "water-cycle.pptx"]
  }
}
