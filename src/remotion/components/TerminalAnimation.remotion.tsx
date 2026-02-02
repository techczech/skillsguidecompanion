import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

interface TerminalAnimationRemotionProps {
  command: string
  args?: string[]
  typingSpeed?: number // characters per second
  showProgress?: boolean
  progressComplete?: boolean
  outputText?: string
}

export function TerminalAnimationRemotion({
  command,
  args = [],
  typingSpeed = 40,
  showProgress = true,
  progressComplete = false,
  outputText = 'Created: water-cycle.pptx',
}: TerminalAnimationRemotionProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const fullCommand = `${command} ${args.join(' ')}`.trim()
  const charsPerFrame = typingSpeed / fps
  const typedChars = Math.min(Math.floor(frame * charsPerFrame), fullCommand.length)
  const isTypingComplete = typedChars >= fullCommand.length

  // Calculate timing phases
  const typingEndFrame = Math.ceil(fullCommand.length / charsPerFrame)
  const progressStartFrame = typingEndFrame + 10
  const progressDuration = 60 // 2 seconds at 30fps
  const completeFrame = progressStartFrame + progressDuration

  // Progress bar animation
  const progressFrame = Math.max(0, frame - progressStartFrame)
  const progressPercent = progressComplete
    ? 100
    : Math.min(100, interpolate(progressFrame, [0, progressDuration], [0, 100]))

  // Entry animation
  const entrySpring = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 },
  })
  const containerOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' })
  const containerY = interpolate(entrySpring, [0, 1], [30, 0])

  // Cursor blink
  const cursorOpacity = interpolate(Math.sin(frame * 0.3), [-1, 1], [0, 1])

  return (
    <div
      style={{
        opacity: containerOpacity,
        transform: `translateY(${containerY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          border: '1px solid #374151',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Terminal header */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#111827',
            borderBottom: '1px solid #374151',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
          </div>
          <span style={{ fontSize: '14px', color: '#9ca3af', marginLeft: '8px', fontFamily: 'Inter, system-ui, sans-serif' }}>
            Terminal
          </span>
        </div>

        {/* Terminal content */}
        <div style={{ padding: '20px', fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
          {/* Command line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#22c55e', fontSize: '18px' }}>$</span>
            <span style={{ color: '#f3f4f6', fontSize: '18px' }}>
              {fullCommand.slice(0, typedChars)}
              {!isTypingComplete && (
                <span style={{ color: '#9ca3af', opacity: cursorOpacity }}>|</span>
              )}
            </span>
          </div>

          {/* Progress section */}
          {showProgress && isTypingComplete && frame > progressStartFrame && (
            <div style={{ marginTop: '20px' }}>
              {progressPercent < 100 ? (
                <div>
                  <div style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>
                    Processing...
                  </div>
                  <div
                    style={{
                      height: '8px',
                      backgroundColor: '#374151',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        backgroundColor: '#f59e0b',
                        borderRadius: '4px',
                        transition: 'width 0.1s linear',
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span style={{ color: '#22c55e', fontSize: '18px' }}>{outputText}</span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
                    File saved to output directory
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Annotation */}
      {showProgress && progressPercent >= 100 && (
        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#6b7280',
            fontFamily: 'Inter, system-ui, sans-serif',
            opacity: interpolate(frame - completeFrame, [0, 15], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          <span>Pre-written script executed - same code, same result, every time</span>
        </div>
      )}
    </div>
  )
}
