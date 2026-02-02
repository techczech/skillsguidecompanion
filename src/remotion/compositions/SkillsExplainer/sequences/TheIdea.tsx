import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { FolderStructure } from '../../../components/FolderStructure'
import { NarrationOverlay } from '../../../components/NarrationOverlay'

export function TheIdea() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Scene: Introducing the folder/skill concept
  // Duration: 20 seconds (600 frames)

  // Phase 1: Question appears (0-150)
  // Phase 2: Lightbulb moment (150-250)
  // Phase 3: Folder structure reveals (250-600)

  const questionOpacity = interpolate(frame, [30, 60, 150, 200], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const lightbulbScale = spring({
    frame: frame - 180,
    fps,
    config: { damping: 12, stiffness: 100 },
  })
  const showLightbulb = frame > 180 && frame < 350
  const lightbulbOpacity = interpolate(frame, [180, 220, 320, 350], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const showFolder = frame > 300
  const folderOpacity = interpolate(frame, [300, 350], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Question text */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '42px',
          fontWeight: 600,
          color: '#1f2937',
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center',
          maxWidth: '800px',
          opacity: questionOpacity,
        }}
      >
        What if we could give the AI instructions...
        <br />
        <span style={{ color: '#22c55e' }}>on demand?</span>
      </div>

      {/* Lightbulb moment */}
      {showLightbulb && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${lightbulbScale})`,
            fontSize: '150px',
            opacity: lightbulbOpacity,
          }}
        >
          💡
        </div>
      )}

      {/* Folder structure */}
      {showFolder && (
        <div
          style={{
            opacity: folderOpacity,
            transform: `translateY(${interpolate(frame - 300, [0, 50], [40, 0])}px)`,
          }}
        >
          <FolderStructure
            title="A Skill is just a folder..."
            revealDelay={6}
          />
        </div>
      )}

      {/* Narration - changes based on phase */}
      {frame < 250 ? (
        <NarrationOverlay
          text="What if we could give the AI instructions... on demand?"
          startFrame={0}
          position="bottom"
        />
      ) : (
        <NarrationOverlay
          text="Introducing Skills: Just folders with text files."
          startFrame={0}
          position="bottom"
        />
      )}
    </AbsoluteFill>
  )
}
