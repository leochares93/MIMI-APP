import { useProfileStore } from '../../store/useProfileStore'
import weeks from '../../data/weeks'

export default function TopBar() {
  const profile = useProfileStore(s => s.profile)
  const week = profile.currentWeek
  const weekData = weeks.find(w => w.week === week)

  return (
    <header className="sticky top-0 z-50 bg-[#faf7f2]/80 backdrop-blur-xl border-b border-black/5">
      <div className="flex items-center justify-between px-6 h-14 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-xl">🤰</span>
          <div>
            <p className="text-sm font-semibold text-black/80 tracking-tight">孕期助手</p>
            <p className="text-xs text-black/40">第{week}周 · {weekData?.fetalSize || '...'}</p>
          </div>
        </div>
        <div>
          {profile.name ? (
            <span className="text-xs text-black/50">{profile.name}</span>
          ) : (
            <span className="text-xs text-black/30">设置档案 →</span>
          )}
        </div>
      </div>
    </header>
  )
}
