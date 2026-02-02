import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

interface NarrationOverlayProps {
  text: string
  startFrame?: number
  position?: 'bottom' | 'top' | 'center'
  style?: 'default' | 'highlight' | 'minimal'
}

export function NarrationOverlay({
  text,
  startFrame = 0,
  position = 'bottom',
  style = 'default',
}: NarrationOverlayProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const relativeFrame = frame - startFrame

  const opacity = interpolate(relativeFrame, [0, 15, 60, 90], [0, 1, 1, 0.8], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  })

  const translateY = spring({
    frame: relativeFrame,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
      mass: 0.5,
    },
  })

  const positionStyles = {
    bottom: { bottom: 80, left: 0, right: 0 },
    top: { top: 80, left: 0, right: 0 },
    center: { top: '50%', left: 0, right: 0, transform: 'translateY(-50%)' },
  }

  const styleVariants = {
    default: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      color: 'white',
      padding: '24px 48px',
      borderRadius: '8px',
    },
    highlight: {
      backgroundColor: 'rgba(34, 197, 94, 0.95)',
      color: 'white',
      padding: '24px 48px',
      borderRadius: '8px',
    },
    minimal: {
      backgroundColor: 'transparent',
      color: 'white',
      textShadow: '0 2px 8px rgba(0,0,0,0.8)',
      padding: '24px 48px',
    },
  }

  const initialOffset = position === 'bottom' ? 30 : position === 'top' ? -30 : 0
  const yOffset = interpolate(translateY, [0, 1], [initialOffset, 0])

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyles[position],
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${yOffset}px)`,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          fontSize: '32px',
          fontWeight: 500,
          lineHeight: 1.4,
          textAlign: 'center',
          fontFamily: 'Inter, system-ui, sans-serif',
          ...styleVariants[style],
        }}
      >
        {text}
      </div>
    </div>
  )
}
