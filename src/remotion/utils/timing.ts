export const FPS = 30
export const TOTAL_DURATION_SECONDS = 170 // 2:50 (added 5s title)

// Scene timings in seconds
export const SCENE_TIMES = {
  title: { start: 0, end: 5 },
  theProblem: { start: 5, end: 20 },
  theLimit: { start: 20, end: 35 },
  theIdea: { start: 35, end: 55 },
  theDemo: { start: 55, end: 85 },
  theMagic: { start: 85, end: 115 },
  theScripts: { start: 115, end: 135 },
  theReveal: { start: 135, end: 155 },
  callToAction: { start: 155, end: 170 },
} as const

// Scene timings in frames
export const SCENES = {
  title: { start: 0, end: 5 * FPS, duration: 5 * FPS },
  theProblem: { start: 5 * FPS, end: 20 * FPS, duration: 15 * FPS },
  theLimit: { start: 20 * FPS, end: 35 * FPS, duration: 15 * FPS },
  theIdea: { start: 35 * FPS, end: 55 * FPS, duration: 20 * FPS },
  theDemo: { start: 55 * FPS, end: 85 * FPS, duration: 30 * FPS },
  theMagic: { start: 85 * FPS, end: 115 * FPS, duration: 30 * FPS },
  theScripts: { start: 115 * FPS, end: 135 * FPS, duration: 20 * FPS },
  theReveal: { start: 135 * FPS, end: 155 * FPS, duration: 20 * FPS },
  callToAction: { start: 155 * FPS, end: 170 * FPS, duration: 15 * FPS },
} as const

export function secondsToFrames(seconds: number): number {
  return Math.round(seconds * FPS)
}

export function framesToSeconds(frames: number): number {
  return frames / FPS
}

// Easing functions for animations
export const easing = {
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutBack: (t: number) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },
}
