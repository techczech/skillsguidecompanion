import { useEffect } from 'react'
import { SimulatorController } from '@/components/Simulator/SimulatorController'
import { useProgressStore } from '@/store/progressStore'

export function SimulatorPage() {
  const setCurrentComponent = useProgressStore((s) => s.setCurrentComponent)

  useEffect(() => {
    setCurrentComponent('simulator')
  }, [setCurrentComponent])

  return (
    <div className="h-[calc(100vh-56px)]">
      <SimulatorController />
    </div>
  )
}
