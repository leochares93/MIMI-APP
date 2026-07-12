import { useNavigate } from 'react-router-dom'
import { useProfileStore } from '../../store/useProfileStore'
import weeks from '../../data/weeks'

export default function TopBar() {
  const navigate = useNavigate()
  const profile = useProfileStore(s => s.profile)
  const week = profile.currentWeek
  const weekData = weeks.find(w => w.week === week)

  return (
    <header className="sticky top-0 z-50 bg-[#FEF9F3]/80 backdrop-blur-xl border-b border-warm-200/60">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤰</span>
          <div>
            <p className="text-sm font-semibold text-warm-900/80">孕期助手</p>
            <p className="text-xs text-warm-900/40">第{week}周 · {weekData?.fetalSize || '...'}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="text-xs text-peach-500 hover:text-peach-600 font-medium transition-colors px-3 py-1.5 rounded-full hover:bg-peach-50"
        >
          {profile.name ? profile.name : '设置档案 →'}
        </button>
      </div>
    </header>
  )
}
