import { useNavigate } from 'react-router-dom'
import { useProfileStore } from '../../store/useProfileStore'
import weeks from '../../data/weeks'

export default function TopBar() {
  const navigate = useNavigate()
  const profile = useProfileStore(s => s.profile)
  const week = profile.currentWeek
  const weekData = weeks.find(w => w.week === week)

  return (
    <header className="sticky top-0 z-50 bg-cream-200/90 backdrop-blur-xl border-b border-sage-200/30">
      <div className="flex items-center justify-between px-5 h-14">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤰</span>
          <div>
            <p className="text-sm font-semibold text-sage-800 tracking-tight">孕期助手</p>
            <p className="text-xs text-sage-500">第{week}周 · {weekData?.fetalSize || '...'}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="text-xs text-sage-500 hover:text-sage-700 transition-colors px-3 py-1.5 rounded-full hover:bg-sage-100/50"
        >
          {profile.name ? profile.name : '设置档案 →'}
        </button>
      </div>
    </header>
  )
}
