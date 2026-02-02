import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { FolderStructure } from '../../../components/FolderStructure'
import { NarrationOverlay } from '../../../components/NarrationOverlay'

export function TheReveal() {
  const frame = useCurrentFrame()

  // Scene: Pull back to show complete picture
  // Duration: 20 seconds (600 frames)

  // Zoom out effect
  const scale = interpolate(frame, [0, 150], [1.2, 1], {
    extrapolateRight: 'clamp',
  })

  // Key insight cards
  const insights = [
    { text: 'Text In', icon: '📝', delay: 150 },
    { text: 'Text Out', icon: '📤', delay: 200 },
    { text: 'Software Intercepts', icon: '⚡', delay: 250 },
    { text: 'Result', icon: '✨', delay: 300 },
  ]

  // Final tagline
  const showTagline = frame > 400
  const taglineOpacity = interpolate(frame - 400, [0, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        gap: '30px',
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: '48px',
          fontWeight: 700,
          color: '#111827',
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center',
          opacity: interpolate(frame, [0, 30], [0, 1]),
        }}
      >
        The Complete Flow
      </div>

      {/* Flow diagram */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        {insights.map((insight, i) => {
          const itemOpacity = interpolate(frame - insight.delay, [0, 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const itemY = interpolate(frame - insight.delay, [0, 20], [20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })

          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: itemOpacity,
                  transform: `translateY(${itemY}px)`,
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    border: '3px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '36px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  {insight.icon}
                </div>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#374151',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {insight.text}
                </span>
              </div>

              {/* Arrow between items */}
              {i < insights.length - 1 && (
                <svg
                  width="40"
                  height="24"
                  viewBox="0 0 40 24"
                  style={{
                    opacity: interpolate(frame - insight.delay - 30, [0, 15], [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }),
                  }}
                >
                  <path
                    d="M0 12 L30 12 M22 4 L30 12 L22 20"
                    stroke="#9ca3af"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              )}
            </div>
          )
        })}
      </div>

      {/* Folder structure */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <FolderStructure
          title="Skill = Folder + Text Files"
          revealDelay={5}
        />
      </div>

      {/* Final tagline */}
      {showTagline && (
        <div
          style={{
            fontSize: '36px',
            fontWeight: 700,
            color: '#22c55e',
            fontFamily: 'Inter, system-ui, sans-serif',
            textAlign: 'center',
            opacity: taglineOpacity,
            marginTop: '20px',
          }}
        >
          No magic. Just folders. Just text. Just... Skills.
        </div>
      )}

      {/* Narration */}
      <NarrationOverlay
        text="No magic. Just folders. Just text. Just... Skills."
        startFrame={400}
        position="bottom"
        style="highlight"
      />
    </AbsoluteFill>
  )
}
