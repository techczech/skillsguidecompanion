import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { Folder, FileText, Code } from 'lucide-react'

interface FolderItem {
  name: string
  type: 'folder' | 'file' | 'script'
  children?: FolderItem[]
  highlight?: boolean
}

interface FolderStructureProps {
  items?: FolderItem[]
  title?: string
  revealDelay?: number // frames between each item reveal
}

const defaultSkillStructure: FolderItem[] = [
  {
    name: 'pptx',
    type: 'folder',
    highlight: true,
    children: [
      { name: 'SKILL.md', type: 'file', highlight: true },
      {
        name: 'references',
        type: 'folder',
        children: [
          { name: 'layouts.md', type: 'file' },
          { name: 'themes.md', type: 'file' },
        ],
      },
      {
        name: 'scripts',
        type: 'folder',
        children: [
          { name: 'html2pptx.js', type: 'script', highlight: true },
          { name: 'rearrange.py', type: 'script' },
        ],
      },
    ],
  },
]

export function FolderStructure({
  items = defaultSkillStructure,
  title = 'Skill Structure',
  revealDelay = 8,
}: FolderStructureProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Entry animation
  const entrySpring = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 },
  })

  const containerOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' })
  const containerScale = interpolate(entrySpring, [0, 1], [0.95, 1])

  // Flatten items for sequential reveal
  const flattenItems = (
    items: FolderItem[],
    depth = 0
  ): { item: FolderItem; depth: number; index: number }[] => {
    const result: { item: FolderItem; depth: number; index: number }[] = []
    let globalIndex = 0

    const process = (items: FolderItem[], depth: number) => {
      items.forEach((item) => {
        result.push({ item, depth, index: globalIndex++ })
        if (item.children) {
          process(item.children, depth + 1)
        }
      })
    }
    process(items, depth)
    return result
  }

  const flatItems = flattenItems(items)

  const renderItem = (item: FolderItem, depth: number, index: number) => {
    const itemFrame = frame - index * revealDelay
    const itemOpacity = interpolate(itemFrame, [0, 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
    const itemX = interpolate(itemFrame, [0, 10], [-20, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })

    const Icon =
      item.type === 'folder' ? Folder : item.type === 'script' ? Code : FileText
    const iconColor =
      item.type === 'folder'
        ? '#f59e0b'
        : item.type === 'script'
          ? '#8b5cf6'
          : '#22c55e'

    return (
      <div
        key={`${item.name}-${index}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingLeft: `${depth * 32}px`,
          marginBottom: '8px',
          opacity: itemOpacity,
          transform: `translateX(${itemX}px)`,
        }}
      >
        <Icon size={24} color={iconColor} />
        <span
          style={{
            fontSize: '22px',
            fontFamily: 'JetBrains Mono, monospace',
            color: item.highlight ? '#22c55e' : '#374151',
            fontWeight: item.highlight ? 600 : 400,
            backgroundColor: item.highlight ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
            padding: '4px 8px',
            borderRadius: '4px',
          }}
        >
          {item.name}
        </span>
      </div>
    )
  }

  return (
    <div
      style={{
        opacity: containerOpacity,
        transform: `scale(${containerScale})`,
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
      }}
    >
      {title && (
        <div
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '24px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {title}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {flatItems.map(({ item, depth, index }) => renderItem(item, depth, index))}
      </div>
    </div>
  )
}
