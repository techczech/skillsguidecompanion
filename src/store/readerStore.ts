import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Highlight {
  id: string
  sectionId: string
  text: string
  date: string
  note?: string
}

interface ReaderSettings {
  fontSize: 'sm' | 'base' | 'lg' | 'xl' | '2xl'
  lineHeight: 'tight' | 'normal' | 'relaxed' | 'loose'
  contentWidth: 'sm' | 'md' | 'lg' | 'full'
}

interface ReaderState {
  highlights: Highlight[]
  readSections: string[]
  bookmarks: string[]
  settings: ReaderSettings
  activeSectionId: string

  addHighlight: (highlight: Omit<Highlight, 'id' | 'date'>) => void
  removeHighlight: (id: string) => void
  toggleReadSection: (sectionId: string) => void
  toggleBookmark: (sectionId: string) => void
  updateSettings: (settings: Partial<ReaderSettings>) => void
  setActiveSection: (sectionId: string) => void
  exportHighlights: () => string
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      highlights: [],
      readSections: [],
      bookmarks: [],
      settings: {
        fontSize: 'xl',
        lineHeight: 'relaxed',
        contentWidth: 'md',
      },
      activeSectionId: 'intro',

      addHighlight: (highlight) =>
        set((state) => ({
          highlights: [
            ...state.highlights,
            {
              ...highlight,
              id: Date.now().toString(),
              date: new Date().toISOString(),
            },
          ],
        })),

      removeHighlight: (id) =>
        set((state) => ({
          highlights: state.highlights.filter((h) => h.id !== id),
        })),

      toggleReadSection: (sectionId) =>
        set((state) => ({
          readSections: state.readSections.includes(sectionId)
            ? state.readSections.filter((s) => s !== sectionId)
            : [...state.readSections, sectionId],
        })),

      toggleBookmark: (sectionId) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(sectionId)
            ? state.bookmarks.filter((s) => s !== sectionId)
            : [...state.bookmarks, sectionId],
        })),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      setActiveSection: (sectionId) =>
        set({ activeSectionId: sectionId }),

      exportHighlights: () => {
        const { highlights } = get()
        const grouped = highlights.reduce(
          (acc, h) => {
            if (!acc[h.sectionId]) acc[h.sectionId] = []
            acc[h.sectionId].push(h)
            return acc
          },
          {} as Record<string, Highlight[]>
        )

        let md = '# Highlights from Skills Learning Companion\n\n'
        for (const [sectionId, sectionHighlights] of Object.entries(grouped)) {
          md += `## ${sectionId}\n\n`
          for (const h of sectionHighlights) {
            md += `- "${h.text}"\n`
            if (h.note) md += `  - Note: ${h.note}\n`
          }
          md += '\n'
        }
        return md
      },
    }),
    {
      name: 'skills-reader-state',
    }
  )
)
