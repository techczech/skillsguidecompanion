export const FPS = 30
export const TOTAL_DURATION_SECONDS = 165 // 2:45

// Scene timings in seconds
export const SCENE_TIMES = {
  theProblem: { start: 0, end: 15 },
  theLimit: { start: 15, end: 30 },
  theIdea: { start: 30, end: 50 },
  theDemo: { start: 50, end: 80 },
  theMagic: { start: 80, end: 110 },
  theScripts: { start: 110, end: 130 },
  theReveal: { start: 130, end: 150 },
  callToAction: { start: 150, end: 165 },
} as const

// Scene timings in frames
export const SCENES = {
  theProblem: { start: 0, end: 15 * FPS, duration: 15 * FPS },
  theLimit: { start: 15 * FPS, end: 30 * FPS, duration: 15 * FPS },
  theIdea: { start: 30 * FPS, end: 50 * FPS, duration: 20 * FPS },
  theDemo: { start: 50 * FPS, end: 80 * FPS, duration: 30 * FPS },
  theMagic: { start: 80 * FPS, end: 110 * FPS, duration: 30 * FPS },
  theScripts: { start: 110 * FPS, end: 130 * FPS, duration: 20 * FPS },
  theReveal: { start: 130 * FPS, end: 150 * FPS, duration: 20 * FPS },
  callToAction: { start: 150 * FPS, end: 165 * FPS, duration: 15 * FPS },
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
