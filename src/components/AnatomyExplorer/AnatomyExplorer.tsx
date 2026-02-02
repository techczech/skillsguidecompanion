import { useState } from 'react'
import { FileTree } from './FileTree'
import { AnnotatedFileViewer } from './AnnotatedFileViewer'
import { pptxSkill } from '@/data/skills/pptx'
import { FolderTree, FileText } from 'lucide-react'

interface FileNode {
  type: 'file' | 'folder'
  content?: string
  children?: Record<string, FileNode>
  annotations?: Array<{ line: number; text: string }>
}

export function AnatomyExplorer() {
  const [selectedPath, setSelectedPath] = useState<string | null>('SKILL.md')
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(
    pptxSkill.structure['SKILL.md']
  )

  const handleSelect = (path: string, node: FileNode) => {
    setSelectedPath(path)
    setSelectedNode(node)
  }

  return (
    <div className="h-full flex">
      {/* Left sidebar - File tree */}
      <div className="w-64 border-r border-gray-800 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
          <FolderTree className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">{pptxSkill.name}/</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <FileTree
            structure={pptxSkill.structure}
            selectedPath={selectedPath}
            onSelect={handleSelect}
          />
        </div>

        {/* Skill info */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/30">
          <div className="text-xs text-gray-500 mb-2">About this skill</div>
          <p className="text-sm text-gray-300">
            The pptx skill creates and edits PowerPoint presentations from HTML or direct
            content.
          </p>
        </div>
      </div>

      {/* Right - File viewer */}
      <div className="flex-1 flex flex-col">
        {selectedNode && selectedNode.type === 'file' ? (
          <AnnotatedFileViewer
            path={selectedPath || ''}
            content={selectedNode.content || ''}
            annotations={selectedNode.annotations}
            className="h-full"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Select a file to view its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
