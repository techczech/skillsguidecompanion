import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressState {
  completedNodes: string[]
  simulatorCompleted: boolean
  anatomyExplorerViewed: string[]
  wizardCompleted: boolean
  currentComponent: string

  markNodeComplete: (nodeId: string) => void
  markSimulatorComplete: () => void
  markFileViewed: (filePath: string) => void
  markWizardComplete: () => void
  setCurrentComponent: (component: string) => void
  resetProgress: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedNodes: [],
      simulatorCompleted: false,
      anatomyExplorerViewed: [],
      wizardCompleted: false,
      currentComponent: 'landing',

      markNodeComplete: (nodeId) =>
        set((state) => ({
          completedNodes: state.completedNodes.includes(nodeId)
            ? state.completedNodes
            : [...state.completedNodes, nodeId],
        })),

      markSimulatorComplete: () =>
        set({ simulatorCompleted: true }),

      markFileViewed: (filePath) =>
        set((state) => ({
          anatomyExplorerViewed: state.anatomyExplorerViewed.includes(filePath)
            ? state.anatomyExplorerViewed
            : [...state.anatomyExplorerViewed, filePath],
        })),

      markWizardComplete: () =>
        set({ wizardCompleted: true }),

      setCurrentComponent: (component) =>
        set({ currentComponent: component }),

      resetProgress: () =>
        set({
          completedNodes: [],
          simulatorCompleted: false,
          anatomyExplorerViewed: [],
          wizardCompleted: false,
          currentComponent: 'landing',
        }),
    }),
    {
      name: 'skills-learning-progress',
    }
  )
)
