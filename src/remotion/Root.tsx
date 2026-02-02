import { Composition } from 'remotion'
import { SkillsExplainer } from './compositions/SkillsExplainer'
import { TitleScene } from './compositions/SkillsExplainer/sequences/TitleScene'
import { TheProblem } from './compositions/SkillsExplainer/sequences/TheProblem'
import { TheLimit } from './compositions/SkillsExplainer/sequences/TheLimit'
import { TheIdea } from './compositions/SkillsExplainer/sequences/TheIdea'
import { TheDemo } from './compositions/SkillsExplainer/sequences/TheDemo'
import { TheMagic } from './compositions/SkillsExplainer/sequences/TheMagic'
import { TheScripts } from './compositions/SkillsExplainer/sequences/TheScripts'
import { TheReveal } from './compositions/SkillsExplainer/sequences/TheReveal'
import { CallToAction } from './compositions/SkillsExplainer/sequences/CallToAction'
import { FPS, SCENES, TOTAL_DURATION_SECONDS } from './utils/timing'

export function RemotionRoot() {
  const totalFrames = TOTAL_DURATION_SECONDS * FPS

  return (
    <>
      {/* Main composition - full video */}
      <Composition
        id="SkillsExplainer"
        component={SkillsExplainer}
        durationInFrames={totalFrames}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Individual scene compositions for preview/testing */}
      <Composition
        id="TitleScene"
        component={TitleScene}
        durationInFrames={SCENES.title.duration}
        fps={FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="TheProblem"
        component={TheProblem}
        durationInFrames={SCENES.theProblem.duration}
        fps={FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="TheLimit"
        component={TheLimit}
        durationInFrames={SCENES.theLimit.duration}
        fps={FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="TheIdea"
        component={TheIdea}
        durationInFrames={SCENES.theIdea.duration}
        fps={FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="TheDemo"
        component={TheDemo}
        durationInFrames={SCENES.theDemo.duration}
        fps={FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="TheMagic"
        component={TheMagic}
        durationInFrames={SCENES.theMagic.duration}
        fps={FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="TheScripts"
        component={TheScripts}
        durationInFrames={SCENES.theScripts.duration}
        fps={FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="TheReveal"
        component={TheReveal}
        durationInFrames={SCENES.theReveal.duration}
        fps={FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="CallToAction"
        component={CallToAction}
        durationInFrames={SCENES.callToAction.duration}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  )
}
