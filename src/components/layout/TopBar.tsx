import { useProfileStore } from '../../store/useProfileStore'
import weeks from '../../data/weeks'

export default function TopBar() {
  const profile = useProfileStore(s => s.profile)
  const week = profile.currentWeek
  const weekData = weeks.find(w => w.week === week)

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary-400 to-primary-500 text-white shadow-md">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤰</span>
          <div>
            <h1 className="text-lg font-semibold leading-tight">孕期助手</h1>
            <p className="text-xs text-primary-100 leading-tight">
              第{week}周 · {weekData?.fetalSize || '...'}
            </p>
          </div>
        </div>
        <div className="text-xs text-primary-100 text-right">
          {profile.name ? (
            <span>👩 {profile.name}</span>
          ) : (
            <span>点击「我的」设置档案</span>
          )}
        </div>
      </div>
    </header>
  )
}
