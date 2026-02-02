import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { conceptNodes, nodeConnections } from '@/data/conceptNodes'
import { NodeDetail } from './NodeDetail'
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { useProgressStore } from '@/store/progressStore'

export function ConceptMap() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const completedNodes = useProgressStore((s) => s.completedNodes)
  const markNodeComplete = useProgressStore((s) => s.markNodeComplete)

  const selected = conceptNodes.find((n) => n.id === selectedNode)

  // Handle URL query param for direct navigation
  useEffect(() => {
    const nodeId = searchParams.get('node')
    if (nodeId && conceptNodes.some((n) => n.id === nodeId)) {
      setSelectedNode(nodeId)
      // Clear the param after using it
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5))
  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  return (
    <div className="h-full flex">
      {/* Map area */}
      <div className="flex-1 relative overflow-hidden bg-gray-100 dark:bg-gray-900">
        {/* Zoom controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg p-3 text-xs shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-gray-500 dark:text-gray-400 mb-2">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="text-gray-700 dark:text-gray-300">Not explored</span>
            </div>
          </div>
        </div>

        {/* SVG for connections */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'center',
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
            </marker>
          </defs>

          {nodeConnections.map((conn, i) => {
            const from = conceptNodes.find((n) => n.id === conn.from)
            const to = conceptNodes.find((n) => n.id === conn.to)
            if (!from || !to) return null

            const fromX = from.position.x + 75
            const fromY = from.position.y + 40
            const toX = to.position.x + 75
            const toY = to.position.y + 40

            const midX = (fromX + toX) / 2
            const midY = (fromY + toY) / 2
            const dx = toX - fromX
            const dy = toY - fromY
            const perpX = -dy * 0.2
            const perpY = dx * 0.2

            return (
              <g key={i}>
                <path
                  d={`M ${fromX} ${fromY} Q ${midX + perpX} ${midY + perpY} ${toX} ${toY}`}
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            )
          })}
        </svg>

        {/* Nodes */}
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'center',
          }}
        >
          {conceptNodes.map((node) => {
            const isCompleted = completedNodes.includes(node.id)
            const isSelected = selectedNode === node.id
            const isCenter = node.id === 'skills'

            return (
              <motion.button
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={cn(
                  'absolute p-3 rounded-lg border transition-all text-left shadow-sm',
                  'hover:scale-105 hover:shadow-md',
                  isCenter
                    ? 'bg-gradient-to-br from-green-50 to-purple-50 dark:from-green-900/30 dark:to-purple-900/30 border-green-300 dark:border-green-700 w-40'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-36',
                  isSelected && 'ring-2 ring-green-500',
                  isCompleted && !isCenter && 'border-green-300 dark:border-green-700'
                )}
                style={{
                  left: node.position.x,
                  top: node.position.y,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between gap-1">
                  <h3
                    className={cn(
                      'text-xs font-semibold leading-tight',
                      isCenter ? 'text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'
                    )}
                  >
                    {node.title}
                  </h3>
                  {isCompleted && (
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-0.5" />
                  )}
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{node.tagline}</p>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-96 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{selected.title}</h2>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <NodeDetail node={selected} onComplete={() => markNodeComplete(selected.id)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
