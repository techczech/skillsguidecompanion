import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'

export function TitleScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Title animation
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const titleY = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  })
  const titleTranslateY = interpolate(titleY, [0, 1], [30, 0])

  // Subtitle animation (delayed)
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' })
  const subtitleY = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  })
  const subtitleTranslateY = interpolate(subtitleY, [0, 1], [20, 0])

  // Decorative elements
  const decorOpacity = interpolate(frame, [30, 50], [0, 0.6], { extrapolateRight: 'clamp' })

  // Folder icon animation
  const folderScale = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 80, stiffness: 150, mass: 0.8 },
  })

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          opacity: decorOpacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
          opacity: decorOpacity,
        }}
      />

      {/* Folder icon */}
      <div
        style={{
          transform: `scale(${folderScale})`,
          marginBottom: 40,
        }}
      >
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
          {/* Folder back */}
          <path
            d="M10 25 L10 85 Q10 90 15 90 L105 90 Q110 90 110 85 L110 35 Q110 30 105 30 L55 30 L45 20 L15 20 Q10 20 10 25Z"
            fill="#7c3aed"
          />
          {/* Folder front */}
          <path
            d="M5 35 L5 85 Q5 92 12 92 L108 92 Q115 92 115 85 L115 40 Q115 33 108 33 L12 33 Q5 33 5 40Z"
            fill="#8b5cf6"
          />
          {/* SKILL.md file */}
          <rect x="25" y="45" width="35" height="40" rx="3" fill="white" />
          <rect x="30" y="52" width="25" height="3" rx="1" fill="#a78bfa" />
          <rect x="30" y="58" width="20" height="2" rx="1" fill="#c4b5fd" />
          <rect x="30" y="63" width="22" height="2" rx="1" fill="#c4b5fd" />
          <rect x="30" y="68" width="18" height="2" rx="1" fill="#c4b5fd" />
          {/* Script file */}
          <rect x="65" y="50" width="30" height="32" rx="3" fill="#22c55e" />
          <text x="72" y="70" fill="white" fontSize="10" fontFamily="monospace">.py</text>
        </svg>
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: 'white',
          margin: 0,
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `translateY(${titleTranslateY}px)`,
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        LLM Skills
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 28,
          color: '#c4b5fd',
          margin: '16px 0 0 0',
          textAlign: 'center',
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleTranslateY}px)`,
          fontWeight: 500,
        }}
      >
        How a folder with text files
        <br />
        unlocks the power of AI
      </p>

      {/* Duration badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 20,
            padding: '8px 16px',
            color: '#e9d5ff',
            fontSize: 16,
          }}
        >
          2:45 explainer
        </div>
      </div>
    </AbsoluteFill>
  )
}
