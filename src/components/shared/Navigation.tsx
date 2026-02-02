import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Play, Map, FolderTree, Wrench, MessageCircle, Home } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/simulator', label: 'Simulator', icon: Play },
  { to: '/concepts', label: 'Concept Map', icon: Map },
  { to: '/anatomy', label: 'Skill Anatomy', icon: FolderTree },
  { to: '/builder', label: 'Build Your Own', icon: Wrench },
]

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <NavLink to="/" className="font-semibold text-lg">
            Skills Guide
          </NavLink>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </div>

          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
