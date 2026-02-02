import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface ConceptLinkProps {
  conceptId: string
  children: React.ReactNode
  className?: string
}

export function ConceptLink({ conceptId, children, className }: ConceptLinkProps) {
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate(`/concepts?node=${conceptId}`)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 -mx-1 rounded',
        'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
        'hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors',
        'border-b border-dashed border-purple-400 dark:border-purple-600',
        'cursor-pointer font-medium',
        className
      )}
      title={`Learn more about this concept`}
    >
      {children}
    </button>
  )
}
