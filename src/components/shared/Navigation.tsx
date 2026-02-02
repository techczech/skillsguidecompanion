import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Play, Map, FolderTree, Wrench, Info, Home, MessageCircle, Sun, Moon, BookOpen, Film } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/video', label: 'Video', icon: Film },
  { to: '/reader', label: 'Read Article', icon: BookOpen },
  { to: '/simulator', label: 'Simulator', icon: Play },
  { to: '/concepts', label: 'Concept Map', icon: Map },
  { to: '/anatomy', label: 'Skill Anatomy', icon: FolderTree },
  { to: '/builder', label: 'Build Your Own', icon: Wrench },
  { to: '/ask', label: 'Ask', icon: MessageCircle },
  { to: '/about', label: 'About', icon: Info },
]

export function Navigation() {
  const { isDark, toggleTheme } = useThemeStore()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <NavLink to="/" className="font-semibold text-lg text-gray-900 dark:text-gray-100">
            Skills Companion
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
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  )
}
