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
    <nav className="sticky bottom-0 z-50 bg-white border-t border-primary-100 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map(tab => {
          const active = isActive(tab.path)
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
                active
                  ? 'text-primary-500'
                  : 'text-gray-400 hover:text-primary-300'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className={`text-xs ${active ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
