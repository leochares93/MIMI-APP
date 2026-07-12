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
    <nav className="sticky bottom-0 z-50 bg-[#faf7f2]/80 backdrop-blur-xl border-t border-black/5">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map(tab => {
          const active = isActive(tab.path)
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center gap-0.5 w-full h-full"
            >
              <span className="text-lg">{tab.icon}</span>
              <span className={`text-[11px] tracking-wide ${active ? 'text-black/70 font-medium' : 'text-black/30'}`}>
                {tab.label}
              </span>
              {active && <span className="w-1 h-1 rounded-full bg-black/40 mt-0.5" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
