import { Routes, Route } from 'react-router-dom'
import { Navigation } from '@/components/shared/Navigation'
import { LandingPage } from '@/pages/LandingPage'
import { SimulatorPage } from '@/pages/SimulatorPage'
import { ConceptsPage } from '@/pages/ConceptsPage'
import { AnatomyPage } from '@/pages/AnatomyPage'
import { BuilderPage } from '@/pages/BuilderPage'
import { AboutPage } from '@/pages/AboutPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navigation />
      <main className="pt-14">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/concepts" element={<ConceptsPage />} />
          <Route path="/anatomy" element={<AnatomyPage />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
  )
}
