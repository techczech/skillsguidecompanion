import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { ChatInterfaceRemotion } from '../../../components/ChatInterface.remotion'
import { ToolCallDisplayRemotion } from '../../../components/ToolCallDisplay.remotion'
import { FileViewerRemotion } from '../../../components/FileViewer.remotion'
import { TerminalAnimationRemotion } from '../../../components/TerminalAnimation.remotion'
import { NarrationOverlay } from '../../../components/NarrationOverlay'
import { FPS } from '../../../utils/timing'
import { skillMdContent, toolCallRead, toolCallExecute, generatedHtmlContent, toolCallWrite } from '../../../../data/simulatorSteps'

export function TheDemo() {
  const frame = useCurrentFrame()

  // Scene: Condensed skill execution demo
  // Duration: 30 seconds (900 frames)

  // Phase timing (condensed from the full simulator)
  const phases = {
    userMessage: { start: 0, duration: 4 * FPS },           // 0-4s: User sends message
    toolCallRead: { start: 4 * FPS, duration: 4 * FPS },    // 4-8s: Tool call to read skill
    fileContents: { start: 8 * FPS, duration: 5 * FPS },    // 8-13s: Show SKILL.md
    generateHtml: { start: 13 * FPS, duration: 6 * FPS },   // 13-19s: Model generates HTML content
    toolCallExecute: { start: 19 * FPS, duration: 3 * FPS }, // 19-22s: Tool call to execute
    terminal: { start: 22 * FPS, duration: 5 * FPS },       // 22-27s: Terminal runs
    response: { start: 27 * FPS, duration: 3 * FPS },       // 27-30s: Final response
  }

  // Determine current phase and messages
  const messages: { role: 'user' | 'assistant'; content: string }[] = [
    { role: 'user', content: 'Create a PowerPoint about the water cycle' },
  ]

  if (frame >= phases.response.start) {
    messages.push({
      role: 'assistant',
      content: "I've created your presentation! The file has been saved as water-cycle.pptx with 8 slides.",
    })
  }

  const showThinking = frame >= phases.userMessage.duration && frame < phases.toolCallRead.start + 30

  // Calculate what to show in the right panel
  const showToolCallRead = frame >= phases.toolCallRead.start && frame < phases.fileContents.start + 30
  const showFileContents = frame >= phases.fileContents.start && frame < phases.generateHtml.start + 30
  const showGenerateHtml = frame >= phases.generateHtml.start && frame < phases.terminal.start + 30
  const showToolCallExecute = frame >= phases.toolCallExecute.start && frame < phases.terminal.start + 20
  const showTerminal = frame >= phases.terminal.start

  // Right panel opacity for transitions
  const panelOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ backgroundColor: '#f3f4f6' }}>
      {/* Split screen layout */}
      <div
        style={{
          display: 'flex',
          height: '100%',
          padding: '40px',
          gap: '24px',
        }}
      >
        {/* Left: Chat interface */}
        <div
          style={{
            width: '45%',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          }}
        >
          <ChatInterfaceRemotion
            messages={messages}
            showThinking={showThinking}
            messageDelayFrames={20}
          />
        </div>

        {/* Right: Behind the scenes */}
        <div
          style={{
            width: '55%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            opacity: panelOpacity,
            padding: '16px',
            backgroundColor: '#e5e7eb',
            borderRadius: '16px',
          }}
        >
          {/* Header */}
          <div
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#374151',
              fontFamily: 'Inter, system-ui, sans-serif',
              paddingBottom: '8px',
              borderBottom: '1px solid #d1d5db',
            }}
          >
            Behind the Scenes
          </div>

          {/* Content area with sequences */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {/* Tool call to read */}
            {showToolCallRead && !showFileContents && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                <ToolCallDisplayRemotion
                  toolCall={toolCallRead}
                  revealSpeed={15}
                />
              </div>
            )}

            {/* File contents */}
            {showFileContents && !showGenerateHtml && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                <FileViewerRemotion
                  path="skills/pptx/SKILL.md"
                  content={skillMdContent}
                  highlightSections={['html2pptx.js', 'presentations']}
                  revealSpeed={12}
                />
              </div>
            )}

            {/* Generate HTML content */}
            {showGenerateHtml && !showTerminal && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Instruction callout */}
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#f3e8ff',
                    borderRadius: '8px',
                    border: '1px solid #c4b5fd',
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 600, marginBottom: '4px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Following instruction:
                  </div>
                  <div style={{ fontSize: '13px', color: '#5b21b6', fontFamily: 'monospace' }}>
                    1. Generate HTML with slide structure
                  </div>
                </div>

                {/* Generated content preview */}
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#22c55e',
                        borderRadius: '50%',
                        animation: 'pulse 1s infinite',
                      }}
                    />
                    <span style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Model generating content from "water cycle" request...
                    </span>
                  </div>
                  <pre
                    style={{
                      fontSize: '10px',
                      backgroundColor: '#f9fafb',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #f3f4f6',
                      overflow: 'hidden',
                      fontFamily: 'monospace',
                      color: '#374151',
                      maxHeight: '180px',
                      lineHeight: 1.4,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {generatedHtmlContent.slice(0, Math.min(generatedHtmlContent.length, Math.floor((frame - phases.generateHtml.start) * 8)))}
                  </pre>
                </div>

                {/* Tool call to write */}
                {frame >= phases.generateHtml.start + 3 * FPS && (
                  <ToolCallDisplayRemotion
                    toolCall={toolCallWrite}
                    revealSpeed={15}
                  />
                )}
              </div>
            )}

            {/* Tool call to execute (brief overlap) */}
            {showToolCallExecute && !showTerminal && !showGenerateHtml && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                <ToolCallDisplayRemotion
                  toolCall={toolCallExecute}
                  revealSpeed={12}
                />
              </div>
            )}

            {/* Terminal animation */}
            {showTerminal && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                <TerminalAnimationRemotion
                  command="node scripts/html2pptx.js"
                  args={['--input', 'slides.html', '--output', 'water-cycle.pptx']}
                  typingSpeed={50}
                  showProgress={true}
                  progressComplete={frame >= phases.response.start}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Narration - changes throughout */}
      {frame < phases.toolCallRead.start ? (
        <NarrationOverlay
          text="Watch what happens when you ask Claude to make a PowerPoint..."
          startFrame={10}
          position="bottom"
        />
      ) : frame < phases.fileContents.start ? (
        <NarrationOverlay
          text="The model outputs a tool call to read the skill file..."
          startFrame={0}
          position="bottom"
        />
      ) : frame < phases.generateHtml.start ? (
        <NarrationOverlay
          text="The SKILL.md file tells Claude exactly what to do..."
          startFrame={0}
          position="bottom"
        />
      ) : frame < phases.terminal.start ? (
        <NarrationOverlay
          text="Step 1: Generate HTML content. The model writes what the script needs."
          startFrame={0}
          position="bottom"
        />
      ) : (
        <NarrationOverlay
          text="Step 2: Pre-written script converts HTML to PowerPoint."
          startFrame={0}
          position="bottom"
        />
      )}
    </AbsoluteFill>
  )
}
