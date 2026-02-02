import { useReaderStore } from '@/store/readerStore'
import { cn } from '@/utils/cn'
import { Type, AlignJustify, Maximize2 } from 'lucide-react'

const fontSizes = [
  { value: 'sm', label: 'S' },
  { value: 'base', label: 'M' },
  { value: 'lg', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
] as const

const lineHeights = [
  { value: 'tight', label: '1' },
  { value: 'normal', label: '1.5' },
  { value: 'relaxed', label: '1.75' },
  { value: 'loose', label: '2' },
] as const

const contentWidths = [
  { value: 'sm', label: 'Narrow' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Wide' },
  { value: 'full', label: 'Full' },
] as const

export function ReadabilityControls() {
  const { settings, updateSettings } = useReaderStore()

  return (
    <div className="space-y-4">
      {/* Font Size */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Type className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Font Size</span>
        </div>
        <div className="flex gap-1">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => updateSettings({ fontSize: size.value })}
              className={cn(
                'flex-1 px-2 py-1.5 text-xs rounded transition-colors',
                settings.fontSize === size.value
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Line Height */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <AlignJustify className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Line Spacing</span>
        </div>
        <div className="flex gap-1">
          {lineHeights.map((height) => (
            <button
              key={height.value}
              onClick={() => updateSettings({ lineHeight: height.value })}
              className={cn(
                'flex-1 px-2 py-1.5 text-xs rounded transition-colors',
                settings.lineHeight === height.value
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {height.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Width */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Maximize2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Content Width</span>
        </div>
        <div className="flex gap-1">
          {contentWidths.map((width) => (
            <button
              key={width.value}
              onClick={() => updateSettings({ contentWidth: width.value })}
              className={cn(
                'flex-1 px-2 py-1.5 text-xs rounded transition-colors',
                settings.contentWidth === width.value
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {width.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
