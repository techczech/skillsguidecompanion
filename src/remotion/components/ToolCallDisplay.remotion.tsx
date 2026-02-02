import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

interface ToolCallDisplayRemotionProps {
  toolCall: {
    name: string
    arguments: Record<string, unknown>
  }
  revealSpeed?: number // lines per second
  showAnnotation?: boolean
}

export function ToolCallDisplayRemotion({
  toolCall,
  revealSpeed = 10,
  showAnnotation = true,
}: ToolCallDisplayRemotionProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const jsonString = JSON.stringify(toolCall, null, 2)
  const lines = jsonString.split('\n')

  // Calculate how many lines to show
  const linesPerFrame = revealSpeed / fps
  const visibleLineCount = Math.min(Math.ceil(frame * linesPerFrame), lines.length)
  const isComplete = visibleLineCount >= lines.length

  // Entry animation
  const entrySpring = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 },
  })
  const containerOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' })
  const containerScale = interpolate(entrySpring, [0, 1], [0.95, 1])

  return (
    <div
      style={{
        opacity: containerOpacity,
        transform: `scale(${containerScale})`,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '2px solid #fed7aa',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(249, 115, 22, 0.1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fff7ed',
            borderBottom: '1px solid #fed7aa',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#c2410c',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Tool Call
          </span>

          {showAnnotation && isComplete && (
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: '#6b7280',
                fontFamily: 'Inter, system-ui, sans-serif',
                opacity: interpolate(frame - lines.length / linesPerFrame, [0, 15], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              <span>Model output</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              <span>Software intercepts</span>
            </div>
          )}
        </div>

        {/* JSON content */}
        <div
          style={{
            padding: '16px',
            backgroundColor: '#fafafa',
            fontFamily: 'JetBrains Mono, Consolas, monospace',
            fontSize: '16px',
          }}
        >
          {lines.slice(0, visibleLineCount).map((line, i) => {
            const lineOpacity = interpolate(
              frame - (i / linesPerFrame) * fps,
              [0, 3],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )
            const lineX = interpolate(
              frame - (i / linesPerFrame) * fps,
              [0, 5],
              [-10, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )

            return (
              <div
                key={i}
                style={{
                  opacity: lineOpacity,
                  transform: `translateX(${lineX}px)`,
                }}
              >
                {formatJsonLine(line)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function formatJsonLine(line: string): React.ReactNode {
  // Match key: "value" pattern
  const keyMatch = line.match(/^(\s*)"([^"]+)"(:)/)
  const stringMatch = line.match(/:\s*"([^"]+)"/)

  if (keyMatch) {
    const [, indent, key, colon] = keyMatch
    const rest = line.slice(keyMatch[0].length)

    return (
      <>
        {indent}
        <span style={{ color: '#8b5cf6' }}>"{key}"</span>
        <span style={{ color: '#6b7280' }}>{colon}</span>
        {stringMatch ? (
          <>
            {' '}
            <span style={{ color: '#16a34a' }}>"{stringMatch[1]}"</span>
            {rest.slice(stringMatch[0].length - 1)}
          </>
        ) : (
          rest
        )}
      </>
    )
  }

  // Brackets
  if (line.trim() === '{' || line.trim() === '}' || line.includes('{') || line.includes('}')) {
    return <span style={{ color: '#6b7280' }}>{line}</span>
  }

  return <span style={{ color: '#374151' }}>{line}</span>
}
