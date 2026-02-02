import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

interface FileViewerRemotionProps {
  path: string
  content: string
  highlightSections?: string[]
  revealSpeed?: number // lines per second
}

export function FileViewerRemotion({
  path,
  content,
  highlightSections = [],
  revealSpeed = 8,
}: FileViewerRemotionProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const pathParts = path.split('/')
  const fileName = pathParts.pop() || ''
  const folderPath = pathParts.join('/')
  const lines = content.split('\n')

  // Calculate how many lines to show
  const linesPerFrame = revealSpeed / fps
  const visibleLineCount = Math.min(Math.ceil(frame * linesPerFrame), lines.length)

  // Entry animation
  const entrySpring = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 },
  })
  const containerOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' })
  const containerY = interpolate(entrySpring, [0, 1], [30, 0])

  return (
    <div
      style={{
        opacity: containerOpacity,
        transform: `translateY(${containerY}px)`,
      }}
    >
      {/* File path breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '12px',
          fontSize: '16px',
          color: '#6b7280',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <span>{folderPath}/</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span style={{ color: '#16a34a', fontWeight: 500 }}>{fileName}</span>
      </div>

      {/* File content */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        {/* File header */}
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
            fontSize: '14px',
            color: '#6b7280',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {fileName}
        </div>

        {/* File content */}
        <div
          style={{
            padding: '16px',
            fontFamily: 'JetBrains Mono, Consolas, monospace',
            fontSize: '14px',
            maxHeight: '400px',
            overflow: 'hidden',
          }}
        >
          {lines.slice(0, visibleLineCount).map((line, i) => {
            const isHighlighted = highlightSections.some((section) =>
              line.toLowerCase().includes(section.toLowerCase())
            )

            const lineOpacity = interpolate(
              frame - (i / linesPerFrame) * fps,
              [0, 5],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )

            return (
              <div
                key={i}
                style={{
                  padding: '3px 8px',
                  margin: '0 -8px',
                  borderRadius: '4px',
                  backgroundColor: isHighlighted ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                  borderLeft: isHighlighted ? '3px solid #22c55e' : '3px solid transparent',
                  opacity: lineOpacity,
                }}
              >
                {formatMarkdownLine(line)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function formatMarkdownLine(line: string): React.ReactNode {
  // Frontmatter delimiter
  if (line === '---') {
    return <span style={{ color: '#9ca3af' }}>{line}</span>
  }

  // YAML key-value in frontmatter
  if (line.match(/^[a-z]+:/)) {
    const colonIndex = line.indexOf(':')
    const key = line.slice(0, colonIndex)
    const value = line.slice(colonIndex + 1)
    return (
      <>
        <span style={{ color: '#8b5cf6' }}>{key}</span>
        <span style={{ color: '#9ca3af' }}>:</span>
        <span style={{ color: '#16a34a' }}>{value}</span>
      </>
    )
  }

  // Headings
  if (line.startsWith('# ')) {
    return <span style={{ color: '#d97706', fontWeight: 700, fontSize: '18px' }}>{line}</span>
  }
  if (line.startsWith('## ')) {
    return <span style={{ color: '#d97706', fontWeight: 600 }}>{line}</span>
  }
  if (line.startsWith('### ')) {
    return <span style={{ color: '#d97706', fontWeight: 500 }}>{line}</span>
  }

  // Code blocks
  if (line.startsWith('```')) {
    return <span style={{ color: '#ec4899' }}>{line}</span>
  }

  // Bullet points
  if (line.startsWith('- ')) {
    return (
      <>
        <span style={{ color: '#9ca3af' }}>- </span>
        <span style={{ color: '#374151' }}>{line.slice(2)}</span>
      </>
    )
  }

  // Numbered list
  if (line.match(/^\d+\. /)) {
    const match = line.match(/^(\d+\. )(.*)/)
    if (match) {
      return (
        <>
          <span style={{ color: '#9ca3af' }}>{match[1]}</span>
          <span style={{ color: '#374151' }}>{match[2]}</span>
        </>
      )
    }
  }

  // Inline code
  if (line.includes('`')) {
    const parts = line.split(/(`[^`]+`)/)
    return (
      <>
        {parts.map((part, i) =>
          part.startsWith('`') ? (
            <span
              key={i}
              style={{
                backgroundColor: '#f3f4f6',
                padding: '2px 6px',
                borderRadius: '4px',
                color: '#ec4899',
              }}
            >
              {part}
            </span>
          ) : (
            <span key={i} style={{ color: '#374151' }}>
              {part}
            </span>
          )
        )}
      </>
    )
  }

  return <span style={{ color: '#374151' }}>{line}</span>
}
