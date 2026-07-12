import { useProfileStore } from '../../store/useProfileStore'
import weeks from '../../data/weeks'

export default function TopBar() {
  const profile = useProfileStore(s => s.profile)
  const week = profile.currentWeek
  const weekData = weeks.find(w => w.week === week)

  return (
    <header className="sticky top-0 z-50 bg-cream-200/95 backdrop-blur-sm border-b border-cream-300/60">
      <div className="flex items-center justify-between px-5 h-14">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤰</span>
          <div>
            <h1 className="text-base font-medium text-sage-800 leading-tight tracking-wide">孕期助手</h1>
            <p className="text-xs text-sage-500 leading-tight">
              第{week}周 · {weekData?.fetalSize || '...'}
            </p>
          </div>
        </div>
        <div className="text-xs text-sage-500 text-right">
          {profile.name ? (
            <span>{profile.name}</span>
          ) : (
            <span className="text-sage-400">设置档案 ›</span>
          )}
        </div>
      </div>
    </header>
  )
}
