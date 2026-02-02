import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Play, Map, FolderTree, Wrench, Info, Home } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/simulator', label: 'Simulator', icon: Play },
  { to: '/concepts', label: 'Concept Map', icon: Map },
  { to: '/anatomy', label: 'Skill Anatomy', icon: FolderTree },
  { to: '/builder', label: 'Build Your Own', icon: Wrench },
  { to: '/about', label: 'About', icon: Info },
]

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <NavLink to="/" className="font-semibold text-lg text-gray-900">
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
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="w-4" />
        </div>
      </div>
    </nav>
  )
}
