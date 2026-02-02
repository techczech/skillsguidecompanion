import { useEffect } from 'react'
import { SkillBuilder } from '@/components/SkillBuilder/SkillBuilder'
import { useProgressStore } from '@/store/progressStore'

export function BuilderPage() {
  const setCurrentComponent = useProgressStore((s) => s.setCurrentComponent)

  useEffect(() => {
    setCurrentComponent('builder')
  }, [setCurrentComponent])

  return (
    <div className="min-h-[calc(100vh-56px)] py-8">
      <SkillBuilder />
    </div>
  )
}
