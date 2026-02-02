import { useEffect } from 'react'
import { ConceptMap } from '@/components/ConceptMap/ConceptMap'
import { useProgressStore } from '@/store/progressStore'

export function ConceptsPage() {
  const setCurrentComponent = useProgressStore((s) => s.setCurrentComponent)

  useEffect(() => {
    setCurrentComponent('concepts')
  }, [setCurrentComponent])

  return (
    <div className="h-[calc(100vh-56px)]">
      <ConceptMap />
    </div>
  )
}
