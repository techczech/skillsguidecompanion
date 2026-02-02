import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { FileViewerRemotion } from '../../../components/FileViewer.remotion'
import { NarrationOverlay } from '../../../components/NarrationOverlay'
import { skillMdContent } from '../../../../data/simulatorSteps'

export function TheMagic() {
  const frame = useCurrentFrame()

  // Scene: Zoom into SKILL.md to understand the "magic"
  // Duration: 30 seconds (900 frames)

  // Animation phases
  const zoomProgress = interpolate(frame, [0, 150], [1, 1.3], {
    extrapolateRight: 'clamp',
  })

  // Callout annotations that appear over time
  const annotations = [
    {
      text: 'Machine-readable name',
      targetLine: 'name:',
      startFrame: 150,
      position: { top: '20%', right: '10%' },
    },
    {
      text: 'Goes in the system prompt!',
      targetLine: 'description:',
      startFrame: 250,
      position: { top: '28%', right: '10%' },
    },
    {
      text: 'Tells Claude WHEN to use this',
      targetLine: 'When to use',
      startFrame: 400,
      position: { top: '45%', right: '10%' },
    },
    {
      text: 'Pre-written = reliable',
      targetLine: 'scripts',
      startFrame: 550,
      position: { top: '70%', right: '10%' },
    },
  ]

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '36px',
          fontWeight: 700,
          color: '#111827',
          fontFamily: 'Inter, system-ui, sans-serif',
          opacity: interpolate(frame, [0, 30], [0, 1]),
        }}
      >
        The "Magic"? It's just a text file.
      </div>

      {/* File viewer with zoom effect */}
      <div
        style={{
          transform: `scale(${zoomProgress})`,
          transformOrigin: 'center top',
          width: '700px',
          marginTop: '40px',
        }}
      >
        <FileViewerRemotion
          path="skills/pptx/SKILL.md"
          content={skillMdContent}
          highlightSections={['html2pptx.js', 'presentations', 'Create a new']}
          revealSpeed={6}
        />
      </div>

      {/* Annotation callouts */}
      {annotations.map((annotation, i) => {
        const annotationOpacity = interpolate(
          frame - annotation.startFrame,
          [0, 20],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
        const annotationX = interpolate(
          frame - annotation.startFrame,
          [0, 20],
          [30, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )

        if (frame < annotation.startFrame) return null

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...annotation.position,
              backgroundColor: '#fef3c7',
              border: '2px solid #f59e0b',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '16px',
              fontWeight: 500,
              color: '#92400e',
              fontFamily: 'Inter, system-ui, sans-serif',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              opacity: annotationOpacity,
              transform: `translateX(${annotationX}px)`,
              maxWidth: '200px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '-10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderRight: '10px solid #f59e0b',
              }}
            />
            {annotation.text}
          </div>
        )
      })}

      {/* Narration */}
      <NarrationOverlay
        text="It's just text files. Instructions the model reads when it needs them."
        startFrame={30}
        position="bottom"
      />
    </AbsoluteFill>
  )
}
