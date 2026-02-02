import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressData {
  completedNodes: string[]
  simulatorCompleted: boolean
  anatomyExplorerViewed: string[]
  wizardCompleted: boolean
}

interface ProgressState extends ProgressData {
  currentComponent: string

  markNodeComplete: (nodeId: string) => void
  markSimulatorComplete: () => void
  markFileViewed: (filePath: string) => void
  markWizardComplete: () => void
  setCurrentComponent: (component: string) => void
  resetProgress: () => void
  exportProgress: () => string
  importProgress: (data: string) => boolean
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

      exportProgress: () => {
        const state = useProgressStore.getState()
        const data: ProgressData = {
          completedNodes: state.completedNodes,
          simulatorCompleted: state.simulatorCompleted,
          anatomyExplorerViewed: state.anatomyExplorerViewed,
          wizardCompleted: state.wizardCompleted,
        }
        return JSON.stringify(data, null, 2)
      },

      importProgress: (dataString: string) => {
        try {
          const data = JSON.parse(dataString) as Partial<ProgressData>
          set({
            completedNodes: data.completedNodes || [],
            simulatorCompleted: data.simulatorCompleted || false,
            anatomyExplorerViewed: data.anatomyExplorerViewed || [],
            wizardCompleted: data.wizardCompleted || false,
          })
          return true
        } catch {
          return false
        }
      },
    }),
    {
      name: 'skills-learning-progress',
    }
  )
)
