export interface ConceptNode {
  id: string
  title: string
  tagline: string
  shortExplanation: string
  example?: string
  connections: Array<{
    to: string
    relationship: string
  }>
  quiz?: {
    question: string
    options: string[]
    correct: number
    explanation: string
  }
  position: { x: number; y: number }
}

export const conceptNodes: ConceptNode[] = [
  {
    id: 'semantic-machines',
    title: 'LLMs are Semantic Machines',
    tagline: 'Not fancy autocomplete',
    shortExplanation: `LLMs don't predict the most likely next word based on frequency. They understand meaning—they "get it" in ways that matter. The numbers inside represent meaningful relationships between concepts.`,
    example: `Phone autocomplete: "walk in..." → "the" (most frequent)
LLM: "There's nothing more annoying when my parents walk in..." → "my" (semantically correct)`,
    connections: [
      { to: 'text-in-text-out', relationship: 'This understanding works on...' },
      { to: 'tool-calling', relationship: 'Enables reliable...' },
      { to: 'instruction-following', relationship: 'Powers complex...' },
    ],
    quiz: {
      question: "Why is 'glorified autocomplete' misleading?",
      options: [
        'LLMs use vectors representing meaning, not word frequencies',
        'LLMs are faster than autocomplete',
        'LLMs use more data',
      ],
      correct: 0,
      explanation: 'The numbers inside LLMs represent meaningful relationships between concepts, not just frequency statistics.',
    },
    position: { x: 400, y: 50 },
  },
  {
    id: 'text-in-text-out',
    title: 'Text-In, Text-Out',
    tagline: 'The only thing LLMs actually do',
    shortExplanation: `LLMs cannot browse the web. Cannot run code. Cannot search. They can ONLY read text and output text. Everything else is software intercepting that text and doing things with it.`,
    example: `When you think Claude "searched the web":
1. Claude outputs: {"tool": "web_search", "query": "..."}
2. Software sees this, runs actual search
3. Results sent back as text for Claude to read`,
    connections: [
      { to: 'tool-calling', relationship: 'Text output becomes...' },
      { to: 'skills', relationship: 'Skills are just text files Claude reads' },
    ],
    quiz: {
      question: "When Claude 'runs a Python script', what actually happens?",
      options: [
        'Claude executes Python internally',
        'Claude outputs text that software intercepts and executes',
        'Claude connects to a Python server',
      ],
      correct: 1,
      explanation: 'The model outputs a tool call (JSON text), which software intercepts and executes. Results come back as text.',
    },
    position: { x: 150, y: 180 },
  },
  {
    id: 'tool-calling',
    title: 'Tool Calling',
    tagline: 'Text that makes things happen',
    shortExplanation: `The model outputs specially formatted text (usually JSON). The software running the model watches for this format, intercepts it, and executes the requested action.`,
    example: `Model outputs:
{
  "name": "execute_shell_command",
  "arguments": {
    "command": "ls -la"
  }
}

Software sees this → runs the command → sends results back`,
    connections: [
      { to: 'text-in-text-out', relationship: 'Powered by...' },
      { to: 'skills', relationship: 'Skills use tool calls to read files and run scripts' },
      { to: 'mcp', relationship: 'MCP standardizes how tools are described' },
    ],
    quiz: {
      question: 'What makes tool calling reliable?',
      options: [
        'The model runs the tools itself',
        'The model outputs predictable JSON that software can parse',
        'Tools are built into the model',
      ],
      correct: 1,
      explanation: 'Tool calls work because models reliably output structured JSON that software can parse and act on.',
    },
    position: { x: 400, y: 180 },
  },
  {
    id: 'instruction-following',
    title: 'Instruction Following',
    tagline: 'The underrated superpower',
    shortExplanation: `Modern LLMs can follow complex multi-step instructions reliably: "First do X, then if user says Y do Z, otherwise do W." 2025's models crossed a threshold—they actually DO this now.`,
    example: `SKILL.md says: "Use html2pptx.js for presentations"
Model reads this → remembers → user asks for slides → model uses that script

Not 100% reliable, but reliable ENOUGH for real automation.`,
    connections: [
      { to: 'skills', relationship: 'Skills ARE instructions' },
      { to: 'semantic-machines', relationship: 'Semantic understanding enables instruction following' },
    ],
    position: { x: 650, y: 180 },
  },
  {
    id: 'skills',
    title: 'Skills',
    tagline: 'Just folders with text files',
    shortExplanation: `A Skill is a folder containing:
- SKILL.md (what to do and when)
- references/ (additional prompts)
- scripts/ (code to execute)
- assets/ (images, templates)

That's it. The "magic" is in the instructions, not the technology.`,
    connections: [
      { to: 'context-window', relationship: 'Solves the context problem' },
      { to: 'tool-calling', relationship: 'Model uses tool calls to read skill files' },
      { to: 'system-prompts', relationship: 'Skills are listed in the system prompt' },
      { to: 'instruction-following', relationship: 'Model follows SKILL.md instructions' },
    ],
    position: { x: 400, y: 350 },
  },
  {
    id: 'context-window',
    title: 'Context Window',
    tagline: 'The fundamental constraint',
    shortExplanation: `LLMs see 150,000-1,000,000 words at once but leave NO trace. Unlike humans who build mental models while reading, LLMs only know what's in their current window. Nothing persists.`,
    example: `Human: Reads a book → remembers the gist even without the book
LLM: Sees text → generates response → forgets everything

That's why every message includes the full conversation history!`,
    connections: [
      { to: 'skills', relationship: 'Skills solve this by loading text on-demand' },
      { to: 'system-prompts', relationship: 'System prompts consume context window space' },
    ],
    quiz: {
      question: "Why can't we just put everything in the context window?",
      options: [
        'It would be too slow',
        'Hard limits exist and filling them causes information loss',
        'The model refuses long inputs',
      ],
      correct: 1,
      explanation: 'When context fills up, systems summarize and discard. Information loss is inevitable. Skills minimize this by loading only what\'s needed.',
    },
    position: { x: 150, y: 500 },
  },
  {
    id: 'system-prompts',
    title: 'System Prompts',
    tagline: 'The hidden instructions',
    shortExplanation: `Every message you send includes a hidden prompt the company wrote. Claude's is ~3,000 words. It defines personality, capabilities, and—crucially—lists available Skills.`,
    example: `When you type "Hello":
[System prompt: 3,000 words] + [Your message: "Hello"]

The model sees ALL of this, every single time.`,
    connections: [
      { to: 'context-window', relationship: 'Consumes context window space' },
      { to: 'skills', relationship: 'Lists available skills' },
    ],
    quiz: {
      question: 'Why are skill descriptions kept short (under 200 words)?',
      options: [
        "The model can't read longer descriptions",
        'To leave context window space for actual conversation',
        "It's a design preference",
      ],
      correct: 1,
      explanation: 'Every word in skill descriptions uses up context window space. Keeping them short leaves more room for conversation and actual work.',
    },
    position: { x: 400, y: 500 },
  },
  {
    id: 'mcp',
    title: 'MCP Protocol',
    tagline: 'How tools describe themselves',
    shortExplanation: `Instead of reading complicated API documentation, models ask servers "what can you do?" and get simple examples back. The model's semantic understanding handles the rest.`,
    example: `Old way: Read 50 pages of REST API docs
MCP way: Server says "I have get_books_by_author, just send author name"

LLMs are SO good at example-following that this just works.`,
    connections: [
      { to: 'tool-calling', relationship: 'Standardizes tool descriptions' },
      { to: 'semantic-machines', relationship: 'Relies on semantic understanding' },
    ],
    position: { x: 650, y: 500 },
  },
]

export const nodeConnections = conceptNodes.flatMap((node) =>
  node.connections.map((conn) => ({
    from: node.id,
    to: conn.to,
    label: conn.relationship,
  }))
)
