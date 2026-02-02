import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { useReaderStore } from '@/store/readerStore'
import { articleSections, conceptKeywords, getAdjacentSections } from '@/data/articleContent'
import { ConceptLink } from './ConceptLink'
import { SelectionToolbar } from './SelectionToolbar'
import { HighlightsPanel } from './HighlightsPanel'
import { ReadabilityControls } from './ReadabilityControls'
import { cn } from '@/utils/cn'
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Highlighter,
  Settings,
  CheckCircle,
  Circle,
  Bookmark,
  BookmarkCheck,
  List,
} from 'lucide-react'

// Process text to add concept links
function processTextWithConcepts(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  // Sort keywords by length (longest first) to match longer phrases first
  const sortedKeywords = Object.entries(conceptKeywords).sort(
    ([a], [b]) => b.length - a.length
  )

  while (remaining.length > 0) {
    let matchFound = false

    for (const [keyword, conceptId] of sortedKeywords) {
      const regex = new RegExp(`\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'i')
      const match = remaining.match(regex)

      if (match && match.index !== undefined) {
        // Add text before the match
        if (match.index > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, match.index)}</span>)
        }

        // Add the concept link
        parts.push(
          <ConceptLink key={key++} conceptId={conceptId}>
            {match[1]}
          </ConceptLink>
        )

        remaining = remaining.slice(match.index + match[0].length)
        matchFound = true
        break
      }
    }

    if (!matchFound) {
      // No more matches, add remaining text
      parts.push(<span key={key++}>{remaining}</span>)
      break
    }
  }

  return parts
}

// Custom component for rendering text with concept links
function ConceptAwareText({ children }: { children: string }) {
  const processed = useMemo(() => processTextWithConcepts(children), [children])
  return <>{processed}</>
}

export function Reader() {
  const {
    activeSectionId,
    setActiveSection,
    highlights,
    addHighlight,
    readSections,
    toggleReadSection,
    bookmarks,
    toggleBookmark,
    settings,
  } = useReaderStore()

  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 })
  const [showSidebar, setShowSidebar] = useState(true)
  const [sidebarTab, setSidebarTab] = useState<'contents' | 'highlights' | 'settings'>('contents')
  const contentRef = useRef<HTMLDivElement>(null)

  const activeSection = articleSections.find((s) => s.id === activeSectionId) || articleSections[0]
  const { prev, next } = getAdjacentSections(activeSectionId)
  const isRead = readSections.includes(activeSectionId)
  const isBookmarked = bookmarks.includes(activeSectionId)

  // Handle text selection
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim().length > 0) {
      const text = selection.toString().trim()
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      setSelectedText(text)
      setSelectionPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom,
      })
    }
  }, [])

  const handleHighlight = useCallback(() => {
    if (selectedText) {
      addHighlight({
        sectionId: activeSectionId,
        text: selectedText,
      })
      setSelectedText(null)
      window.getSelection()?.removeAllRanges()
    }
  }, [selectedText, activeSectionId, addHighlight])

  const clearSelection = useCallback(() => {
    setSelectedText(null)
    window.getSelection()?.removeAllRanges()
  }, [])

  // Clear selection on section change
  useEffect(() => {
    clearSelection()
  }, [activeSectionId, clearSelection])

  // Font size class
  const fontSizeClass = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }[settings.fontSize]

  // Line height class
  const lineHeightClass = {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
  }[settings.lineHeight]

  // Content width class
  const contentWidthClass = {
    sm: 'max-w-prose',
    md: 'max-w-3xl',
    lg: 'max-w-5xl',
    full: 'max-w-full',
  }[settings.contentWidth]

  // Progress
  const progress = Math.round((readSections.length / articleSections.length) * 100)

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <aside
        className={cn(
          'w-72 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0 overflow-hidden transition-all',
          showSidebar ? 'translate-x-0' : '-translate-x-full absolute'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSidebarTab('contents')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm transition-colors',
                sidebarTab === 'contents'
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              )}
            >
              <List className="w-4 h-4" />
              Contents
            </button>
            <button
              onClick={() => setSidebarTab('highlights')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm transition-colors',
                sidebarTab === 'highlights'
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              )}
            >
              <Highlighter className="w-4 h-4" />
              <span className="hidden sm:inline">Highlights</span>
              {highlights.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full">
                  {highlights.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setSidebarTab('settings')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm transition-colors',
                sidebarTab === 'settings'
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              )}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto p-4">
            {sidebarTab === 'contents' && (
              <nav className="space-y-1">
                {articleSections.map((section) => {
                  const isCurrent = section.id === activeSectionId
                  const sectionIsRead = readSections.includes(section.id)
                  const sectionIsBookmarked = bookmarks.includes(section.id)

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors',
                        isCurrent
                          ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      {sectionIsRead ? (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                      )}
                      <span className="flex-1 truncate">{section.title}</span>
                      {sectionIsBookmarked && (
                        <BookmarkCheck className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      )}
                    </button>
                  )
                })}
              </nav>
            )}

            {sidebarTab === 'highlights' && <HighlightsPanel showAll />}

            {sidebarTab === 'settings' && <ReadabilityControls />}
          </div>
        </div>
      </aside>

      {/* Toggle sidebar button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        style={{ left: showSidebar ? '288px' : '0' }}
      >
        {showSidebar ? (
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
        <div className={cn('mx-auto px-6 py-8', contentWidthClass)}>
          {/* Section header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2 py-1 rounded">
                Section {activeSection.order} of {articleSections.length}
              </span>
              <button
                onClick={() => toggleBookmark(activeSectionId)}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  isBookmarked
                    ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {activeSection.title}
            </h1>
          </header>

          {/* Article content */}
          <article
            ref={contentRef}
            onMouseUp={handleMouseUp}
            className={cn(
              'prose dark:prose-invert max-w-none',
              fontSizeClass,
              lineHeightClass,
              'prose-headings:text-gray-900 dark:prose-headings:text-gray-100',
              'prose-p:text-gray-700 dark:prose-p:text-gray-300',
              'prose-strong:text-gray-900 dark:prose-strong:text-gray-100',
              'prose-code:text-purple-600 dark:prose-code:text-purple-400',
              'prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800',
              'prose-blockquote:border-purple-500 prose-blockquote:bg-purple-50 dark:prose-blockquote:bg-purple-900/20 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg'
            )}
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => {
                  // Process text nodes within paragraphs
                  const processedChildren = Array.isArray(children)
                    ? children.map((child, i) =>
                        typeof child === 'string' ? (
                          <ConceptAwareText key={i}>{child}</ConceptAwareText>
                        ) : (
                          child
                        )
                      )
                    : typeof children === 'string'
                      ? processTextWithConcepts(children)
                      : children
                  return <p>{processedChildren}</p>
                },
                li: ({ children }) => {
                  const processedChildren = Array.isArray(children)
                    ? children.map((child, i) =>
                        typeof child === 'string' ? (
                          <ConceptAwareText key={i}>{child}</ConceptAwareText>
                        ) : (
                          child
                        )
                      )
                    : typeof children === 'string'
                      ? processTextWithConcepts(children)
                      : children
                  return <li>{processedChildren}</li>
                },
              }}
            >
              {activeSection.content}
            </ReactMarkdown>
          </article>

          {/* Navigation footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => toggleReadSection(activeSectionId)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                  isRead
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                {isRead ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Marked as read
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5" />
                    Mark as read
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              {prev ? (
                <button
                  onClick={() => setActiveSection(prev.id)}
                  className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Previous</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {prev.title}
                    </div>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {next ? (
                <button
                  onClick={() => setActiveSection(next.id)}
                  className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Next</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {next.title}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </footer>
        </div>
      </main>

      {/* Selection toolbar */}
      <AnimatePresence>
        {selectedText && (
          <SelectionToolbar
            selectedText={selectedText}
            position={selectionPosition}
            onHighlight={handleHighlight}
            onClose={clearSelection}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
