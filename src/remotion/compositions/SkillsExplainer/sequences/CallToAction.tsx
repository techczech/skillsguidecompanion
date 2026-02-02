import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { NarrationOverlay } from '../../../components/NarrationOverlay'

export function CallToAction() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Scene: Call to action
  // Duration: 15 seconds (450 frames)

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  })

  const buttonsOpacity = interpolate(frame - 60, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const buttons = [
    {
      label: 'Learn How Skills Work',
      description: 'Interactive step-by-step guide',
      color: '#22c55e',
      icon: '📚',
      delay: 60,
    },
    {
      label: 'Build Your Own Skill',
      description: 'Hands-on wizard to create a skill',
      color: '#8b5cf6',
      icon: '🛠️',
      delay: 90,
    },
    {
      label: 'Read the Full Article',
      description: 'Deep dive into LLM capabilities',
      color: '#3b82f6',
      icon: '📖',
      delay: 120,
    },
  ]

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
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
          transform: `scale(${titleSpring})`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '56px',
            fontWeight: 700,
            color: 'white',
            fontFamily: 'Inter, system-ui, sans-serif',
            marginBottom: '16px',
          }}
        >
          Want to learn more?
        </div>
        <div
          style={{
            fontSize: '24px',
            color: '#94a3b8',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Explore the Skills Learning Companion
        </div>
      </div>

      {/* CTA Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          opacity: buttonsOpacity,
        }}
      >
        {buttons.map((button, i) => {
          const buttonSpring = spring({
            frame: frame - button.delay,
            fps,
            config: { damping: 12, stiffness: 100 },
          })
          const buttonScale = interpolate(buttonSpring, [0, 1], [0.8, 1])
          const buttonOpacity = interpolate(frame - button.delay, [0, 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })

          return (
            <div
              key={i}
              style={{
                width: '280px',
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                transform: `scale(${buttonScale})`,
                opacity: buttonOpacity,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ fontSize: '48px' }}>{button.icon}</div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: button.color,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  textAlign: 'center',
                }}
              >
                {button.label}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  textAlign: 'center',
                }}
              >
                {button.description}
              </div>
            </div>
          )
        })}
      </div>

      {/* URL/Logo */}
      <div
        style={{
          marginTop: '20px',
          opacity: interpolate(frame - 200, [0, 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div
          style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#22c55e',
            fontFamily: 'Inter, system-ui, sans-serif',
            padding: '12px 32px',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: '2px solid rgba(34, 197, 94, 0.3)',
          }}
        >
          skills.edutools.fyi
        </div>
      </div>

      {/* Narration */}
      <NarrationOverlay
        text="Want to understand how this works? Or build your own?"
        startFrame={20}
        position="bottom"
        style="minimal"
      />
    </AbsoluteFill>
  )
}
