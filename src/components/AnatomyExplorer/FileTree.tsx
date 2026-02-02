import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Folder, FolderOpen, FileText, ChevronRight } from 'lucide-react'

interface FileNode {
  type: 'file' | 'folder'
  content?: string
  children?: Record<string, FileNode>
  annotations?: Array<{ line: number; text: string }>
}

interface FileTreeProps {
  structure: Record<string, FileNode>
  selectedPath: string | null
  onSelect: (path: string, node: FileNode) => void
  basePath?: string
  level?: number
}

export function FileTree({
  structure,
  selectedPath,
  onSelect,
  basePath = '',
  level = 0,
}: FileTreeProps) {
  return (
    <div className={cn('space-y-0.5', level === 0 && 'text-sm')}>
      {Object.entries(structure).map(([name, node]) => (
        <FileTreeNode
          key={name}
          name={name}
          node={node}
          path={basePath ? `${basePath}/${name}` : name}
          selectedPath={selectedPath}
          onSelect={onSelect}
          level={level}
        />
      ))}
    </div>
  )
}

interface FileTreeNodeProps {
  name: string
  node: FileNode
  path: string
  selectedPath: string | null
  onSelect: (path: string, node: FileNode) => void
  level: number
}

function FileTreeNode({
  name,
  node,
  path,
  selectedPath,
  onSelect,
  level,
}: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2)
  const isSelected = selectedPath === path
  const isFolder = node.type === 'folder'

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded)
    } else {
      onSelect(path, node)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          'w-full flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors text-left',
          isSelected
            ? 'bg-model/20 text-model'
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {isFolder && (
          <ChevronRight
            className={cn(
              'w-3 h-3 transition-transform flex-shrink-0',
              isExpanded && 'rotate-90'
            )}
          />
        )}
        {!isFolder && <span className="w-3" />}

        {isFolder ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          )
        ) : (
          <FileText
            className={cn('w-4 h-4 flex-shrink-0', isSelected ? 'text-model' : 'text-gray-500')}
          />
        )}

        <span className="truncate">{name}</span>
      </button>

      <AnimatePresence>
        {isFolder && isExpanded && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            <FileTree
              structure={node.children}
              selectedPath={selectedPath}
              onSelect={onSelect}
              basePath={path}
              level={level + 1}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
