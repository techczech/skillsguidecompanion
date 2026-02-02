import { AbsoluteFill, Sequence } from 'remotion'
import { SCENES } from '../../utils/timing'
import { TheProblem } from './sequences/TheProblem'
import { TheLimit } from './sequences/TheLimit'
import { TheIdea } from './sequences/TheIdea'
import { TheDemo } from './sequences/TheDemo'
import { TheMagic } from './sequences/TheMagic'
import { TheScripts } from './sequences/TheScripts'
import { TheReveal } from './sequences/TheReveal'
import { CallToAction } from './sequences/CallToAction'

export function SkillsExplainer() {
  return (
    <AbsoluteFill style={{ backgroundColor: '#f3f4f6' }}>
      {/* Scene 1: The Problem (0:00-0:15) */}
      <Sequence from={SCENES.theProblem.start} durationInFrames={SCENES.theProblem.duration}>
        <TheProblem />
      </Sequence>

      {/* Scene 2: The Limit (0:15-0:30) */}
      <Sequence from={SCENES.theLimit.start} durationInFrames={SCENES.theLimit.duration}>
        <TheLimit />
      </Sequence>

      {/* Scene 3: The Idea (0:30-0:50) */}
      <Sequence from={SCENES.theIdea.start} durationInFrames={SCENES.theIdea.duration}>
        <TheIdea />
      </Sequence>

      {/* Scene 4: The Demo (0:50-1:20) */}
      <Sequence from={SCENES.theDemo.start} durationInFrames={SCENES.theDemo.duration}>
        <TheDemo />
      </Sequence>

      {/* Scene 5: The Magic (1:20-1:50) */}
      <Sequence from={SCENES.theMagic.start} durationInFrames={SCENES.theMagic.duration}>
        <TheMagic />
      </Sequence>

      {/* Scene 6: The Scripts (1:50-2:10) */}
      <Sequence from={SCENES.theScripts.start} durationInFrames={SCENES.theScripts.duration}>
        <TheScripts />
      </Sequence>

      {/* Scene 7: The Reveal (2:10-2:30) */}
      <Sequence from={SCENES.theReveal.start} durationInFrames={SCENES.theReveal.duration}>
        <TheReveal />
      </Sequence>

      {/* Scene 8: Call to Action (2:30-2:45) */}
      <Sequence from={SCENES.callToAction.start} durationInFrames={SCENES.callToAction.duration}>
        <CallToAction />
      </Sequence>
    </AbsoluteFill>
  )
}
