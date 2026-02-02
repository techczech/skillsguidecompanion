import { useEffect } from 'react'
import { AnatomyExplorer } from '@/components/AnatomyExplorer/AnatomyExplorer'
import { useProgressStore } from '@/store/progressStore'

export function AnatomyPage() {
  const setCurrentComponent = useProgressStore((s) => s.setCurrentComponent)

  useEffect(() => {
    setCurrentComponent('anatomy')
  }, [setCurrentComponent])

  return (
    <div className="h-[calc(100vh-56px)]">
      <AnatomyExplorer />
    </div>
  )
}
