import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { ChatInterfaceRemotion } from '../../../components/ChatInterface.remotion'
import { NarrationOverlay } from '../../../components/NarrationOverlay'

export function TheProblem() {
  const frame = useCurrentFrame()

  // Scene: Chat getting confused on a long task
  // Duration: 15 seconds (450 frames)

  const messages: { role: 'user' | 'assistant'; content: string }[] = [
    { role: 'user', content: 'Help me write a 20-page research paper on climate change' },
  ]

  // Add confused response after a delay
  const showConfusion = frame > 200
  if (showConfusion) {
    messages.push({
      role: 'assistant',
      content: "I apologize, but I seem to have lost track of what we discussed earlier. Could you remind me what specific aspects of climate change we were focusing on? I don't have context from our previous messages...",
    })
  }

  // Show thinking state between
  const showThinking = frame > 80 && frame < 200

  // Frustrated emoji appears
  const showFrustration = frame > 350
  const frustrationOpacity = showFrustration ? interpolate(frame - 350, [0, 30], [0, 1]) : 0

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
      }}
    >
      {/* Main chat container */}
      <div
        style={{
          width: '800px',
          height: '600px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          position: 'relative',
        }}
      >
        <ChatInterfaceRemotion
          messages={messages}
          showThinking={showThinking}
          messageDelayFrames={30}
        />

        {/* Frustrated overlay */}
        {showFrustration && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '120px',
              opacity: frustrationOpacity,
            }}
          >
            😤
          </div>
        )}
      </div>

      {/* Narration */}
      <NarrationOverlay
        text="Ever wonder why your AI assistant gets confused on long tasks?"
        startFrame={30}
        position="bottom"
      />
    </AbsoluteFill>
  )
}
