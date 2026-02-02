import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

interface ContextWindowProps {
  fillProgress: number // 0 to 1
  label?: string
  showWarning?: boolean
}

export function ContextWindow({
  fillProgress,
  label = 'Context Window',
  showWarning = false,
}: ContextWindowProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Animated fill based on progress
  const fillWidth = interpolate(fillProgress, [0, 1], [0, 100])

  // Color changes as it fills
  const fillColor =
    fillProgress < 0.5
      ? '#22c55e' // green
      : fillProgress < 0.8
        ? '#f59e0b' // amber
        : '#ef4444' // red

  // Warning pulse animation
  const warningOpacity =
    showWarning && fillProgress > 0.8
      ? interpolate(Math.sin(frame * 0.2), [-1, 1], [0.5, 1])
      : 0

  // Entry animation
  const scaleSpring = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 },
  })
  const scale = interpolate(scaleSpring, [0, 1], [0.9, 1])
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Label */}
      <div
        style={{
          fontSize: '24px',
          fontWeight: 600,
          color: '#374151',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {label}
      </div>

      {/* Progress bar container */}
      <div
        style={{
          width: '600px',
          height: '60px',
          backgroundColor: '#f3f4f6',
          borderRadius: '12px',
          border: '3px solid #e5e7eb',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Fill bar */}
        <div
          style={{
            width: `${fillWidth}%`,
            height: '100%',
            backgroundColor: fillColor,
            transition: 'width 0.3s ease, background-color 0.3s ease',
            borderRadius: '8px',
          }}
        />

        {/* Percentage text */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '24px',
            fontWeight: 700,
            color: fillProgress > 0.5 ? 'white' : '#374151',
            textShadow: fillProgress > 0.5 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {Math.round(fillProgress * 100)}%
        </div>
      </div>

      {/* Warning message */}
      {showWarning && fillProgress > 0.8 && (
        <div
          style={{
            fontSize: '20px',
            color: '#ef4444',
            fontWeight: 500,
            opacity: warningOpacity,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Context limit approaching - information will be lost!
        </div>
      )}

      {/* Memory blocks visualization */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          maxWidth: '600px',
          justifyContent: 'center',
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => {
          const isFilled = i / 20 < fillProgress
          return (
            <div
              key={i}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                backgroundColor: isFilled ? fillColor : '#e5e7eb',
                opacity: isFilled ? 1 : 0.5,
                transition: 'background-color 0.2s ease',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
