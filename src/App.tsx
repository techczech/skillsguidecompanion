import { Routes, Route } from 'react-router-dom'
import { Navigation } from '@/components/shared/Navigation'
import { LandingPage } from '@/pages/LandingPage'
import { SimulatorPage } from '@/pages/SimulatorPage'
import { ConceptsPage } from '@/pages/ConceptsPage'
import { AnatomyPage } from '@/pages/AnatomyPage'
import { BuilderPage } from '@/pages/BuilderPage'
import { AskPage } from '@/pages/AskPage'
import { AboutPage } from '@/pages/AboutPage'
import { ReaderPage } from '@/pages/ReaderPage'
import { VideoPage } from '@/pages/VideoPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navigation />
      <main className="pt-14">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/concepts" element={<ConceptsPage />} />
          <Route path="/anatomy" element={<AnatomyPage />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path="/ask" element={<AskPage />} />
          <Route path="/reader" element={<ReaderPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
  )
}
