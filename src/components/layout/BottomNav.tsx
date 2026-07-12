import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/knowledge', label: '知识', icon: '📚' },
  { path: '/chat', label: '问答', icon: '💬' },
  { path: '/profile', label: '我的', icon: '👤' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="sticky bottom-0 z-50 bg-cream-100/95 backdrop-blur-sm border-t border-cream-300/40">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map(tab => {
          const active = isActive(tab.path)
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                active
                  ? 'text-sage-600'
                  : 'text-sage-300 hover:text-sage-400'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className={`text-xs tracking-wide ${active ? 'font-medium' : ''}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
