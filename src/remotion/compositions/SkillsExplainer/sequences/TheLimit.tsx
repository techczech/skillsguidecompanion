import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { ContextWindow } from '../../../components/ContextWindow'
import { NarrationOverlay } from '../../../components/NarrationOverlay'

export function TheLimit() {
  const frame = useCurrentFrame()

  // Scene: Context window filling up
  // Duration: 15 seconds (450 frames)

  // Progress fills from 0 to 100% over the scene
  const fillProgress = interpolate(frame, [30, 400], [0.1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Show warning when > 80%
  const showWarning = fillProgress > 0.8

  // Text blocks representing conversation history
  const textBlocks = [
    'User: Tell me about...',
    'Assistant: Of course...',
    'User: Can you explain...',
    'Assistant: Here is...',
    'User: What about...',
    'Assistant: That relates...',
    'User: And how does...',
    'Assistant: Well, when...',
  ]

  const visibleBlocks = Math.floor(
    interpolate(frame, [60, 350], [0, textBlocks.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  )

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1f2937',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        gap: '40px',
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: '48px',
          fontWeight: 700,
          color: 'white',
          fontFamily: 'Inter, system-ui, sans-serif',
          opacity: interpolate(frame, [0, 20], [0, 1]),
        }}
      >
        The Context Window
      </div>

      {/* Main visualization area */}
      <div
        style={{
          display: 'flex',
          gap: '60px',
          alignItems: 'center',
        }}
      >
        {/* Text blocks on the left */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '400px',
          }}
        >
          {textBlocks.slice(0, visibleBlocks).map((text, i) => {
            const blockOpacity = interpolate(
              frame - (60 + i * 35),
              [0, 15],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )

            // Fade out older blocks as space fills
            const fadeOut =
              fillProgress > 0.7 && i < visibleBlocks - 3
                ? interpolate(fillProgress, [0.7, 0.9], [1, 0.3])
                : 1

            return (
              <div
                key={i}
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: text.startsWith('User') ? '#60a5fa' : '#34d399',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  opacity: blockOpacity * fadeOut,
                }}
              >
                {text}
              </div>
            )
          })}

          {fillProgress > 0.85 && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#ef4444',
                fontFamily: 'Inter, system-ui, sans-serif',
                opacity: interpolate(frame - 380, [0, 20], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              Earlier messages forgotten...
            </div>
          )}
        </div>

        {/* Context window visualization on the right */}
        <ContextWindow
          fillProgress={fillProgress}
          label="Memory Capacity"
          showWarning={showWarning}
        />
      </div>

      {/* Narration */}
      <NarrationOverlay
        text="LLMs have a limit. When it fills up, they start forgetting."
        startFrame={20}
        position="bottom"
        style="minimal"
      />
    </AbsoluteFill>
  )
}
