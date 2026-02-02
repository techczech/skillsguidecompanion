import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { TerminalAnimationRemotion } from '../../../components/TerminalAnimation.remotion'
import { NarrationOverlay } from '../../../components/NarrationOverlay'

export function TheScripts() {
  const frame = useCurrentFrame()

  // Scene: Focus on script execution
  // Duration: 20 seconds (600 frames)

  // Show comparison: LLM-generated code vs pre-written scripts
  const showComparison = frame > 100
  const comparisonOpacity = interpolate(frame - 100, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const showTerminal = frame > 250
  const terminalOpacity = interpolate(frame - 250, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1e293b',
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
          fontSize: '42px',
          fontWeight: 700,
          color: 'white',
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center',
          opacity: interpolate(frame, [0, 30], [0, 1]),
        }}
      >
        Why Pre-Written Scripts?
      </div>

      {/* Comparison cards */}
      {showComparison && (
        <div
          style={{
            display: 'flex',
            gap: '40px',
            opacity: comparisonOpacity,
          }}
        >
          {/* LLM-generated code (bad) */}
          <div
            style={{
              width: '400px',
              backgroundColor: '#fee2e2',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid #fca5a5',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontSize: '24px' }}>❌</span>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#991b1b',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                LLM writes code each time
              </span>
            </div>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '16px',
                color: '#7f1d1d',
                fontFamily: 'Inter, system-ui, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <li>• Different output every run</li>
              <li>• May have bugs</li>
              <li>• Unpredictable behavior</li>
              <li>• Hard to debug</li>
            </ul>
          </div>

          {/* Pre-written scripts (good) */}
          <div
            style={{
              width: '400px',
              backgroundColor: '#dcfce7',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid #86efac',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontSize: '24px' }}>✅</span>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#166534',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                Pre-written scripts
              </span>
            </div>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '16px',
                color: '#14532d',
                fontFamily: 'Inter, system-ui, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <li>• Same result every time</li>
              <li>• Tested and reliable</li>
              <li>• Predictable output</li>
              <li>• Easy to maintain</li>
            </ul>
          </div>
        </div>
      )}

      {/* Terminal animation */}
      {showTerminal && (
        <div style={{ width: '700px', opacity: terminalOpacity }}>
          <TerminalAnimationRemotion
            command="node scripts/html2pptx.js"
            args={['--output', 'presentation.pptx']}
            typingSpeed={40}
            showProgress={true}
            progressComplete={frame > 500}
          />
        </div>
      )}

      {/* Narration */}
      <NarrationOverlay
        text="Pre-written scripts. Same code, same result, every time."
        startFrame={20}
        position="bottom"
        style="minimal"
      />
    </AbsoluteFill>
  )
}
