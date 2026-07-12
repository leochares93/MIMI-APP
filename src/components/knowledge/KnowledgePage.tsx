import { useNavigate } from 'react-router-dom'
import { useProfileStore } from '../../store/useProfileStore'
import weeks from '../../data/weeks'
import { categories } from '../../data/categories'

export default function KnowledgePage() {
  const navigate = useNavigate()
  const profile = useProfileStore(s => s.profile)

  const trimester1Weeks = weeks.filter(w => w.trimester === 1)
  const trimester2Weeks = weeks.filter(w => w.trimester === 2)
  const trimester3Weeks = weeks.filter(w => w.trimester === 3)

  const handleWeekClick = (week: number) => {
    navigate(`/knowledge/week/${week}`)
  }

  const handleCategoryClick = (catId: string) => {
    if (catId === 'weeks') return
    navigate('/chat')
  }

  return (
    <div className="p-5 pb-24 space-y-8">
      {/* 孕周选择器 */}
      <div>
        <h2 className="text-base font-medium text-sage-800 tracking-wide mb-5">孕期周历</h2>

        {[
          { label: '第一孕期 · 1-12周', weeks: trimester1Weeks, activeBg: 'bg-sage-500', activeText: 'text-white', border: 'border-sage-200', hoverBg: 'hover:bg-sage-50', dot: 'bg-sage-400' },
          { label: '第二孕期 · 13-27周', weeks: trimester2Weeks, activeBg: 'bg-sage-600', activeText: 'text-white', border: 'border-cream-300/60', hoverBg: 'hover:bg-cream-200/50', dot: 'bg-sage-400' },
          { label: '第三孕期 · 28-40周', weeks: trimester3Weeks, activeBg: 'bg-terra-500', activeText: 'text-white', border: 'border-terra-200', hoverBg: 'hover:bg-terra-50', dot: 'bg-terra-400' },
        ].map((group, gi) => (
          <div key={gi} className="mb-6">
            <p className="text-xs text-sage-400 tracking-widest uppercase mb-3">{group.label}</p>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
              {group.weeks.map(w => {
                const isCurrent = w.week === profile.currentWeek
                return (
                  <button
                    key={w.week}
                    onClick={() => handleWeekClick(w.week)}
                    className={`flex-shrink-0 min-w-[44px] h-11 rounded-xl flex items-center justify-center text-sm transition-all duration-200 ${
                      isCurrent
                        ? `${group.activeBg} ${group.activeText} shadow-sm font-medium`
                        : `bg-white text-sage-600 border ${group.border} ${group.hoverBg}`
                    }`}
                  >
                    {w.week}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 分类卡片 */}
      <div>
        <h2 className="text-base font-medium text-sage-800 tracking-wide mb-5">知识分类</h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-cream-300/60 hover:shadow-md hover:border-sage-200 transition-all text-left space-y-3"
            >
              <span className="text-3xl block">{cat.icon}</span>
              <div>
                <h4 className="font-medium text-sage-800 text-sm mb-1">{cat.name}</h4>
                <p className="text-xs text-sage-400 leading-relaxed">{cat.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 快捷入口 */}
      <div>
        <h2 className="text-base font-medium text-sage-800 tracking-wide mb-5">快速访问</h2>
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/knowledge/week/${profile.currentWeek}`)}
            className="w-full bg-white rounded-2xl p-5 shadow-sm border border-cream-300/60 hover:shadow-md hover:border-sage-200 transition-all flex items-center gap-4"
          >
            <span className="text-2xl">📋</span>
            <div className="text-left flex-1">
              <p className="font-medium text-sage-800 text-sm">本周指南</p>
              <p className="text-xs text-sage-400 mt-0.5">查看第{profile.currentWeek}周的详细指导</p>
            </div>
            <span className="text-sage-300 text-lg">›</span>
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="w-full bg-white rounded-2xl p-5 shadow-sm border border-cream-300/60 hover:shadow-md hover:border-sage-200 transition-all flex items-center gap-4"
          >
            <span className="text-2xl">💬</span>
            <div className="text-left flex-1">
              <p className="font-medium text-sage-800 text-sm">智能问答</p>
              <p className="text-xs text-sage-400 mt-0.5">向孕期助手提问，获取即时解答</p>
            </div>
            <span className="text-sage-300 text-lg">›</span>
          </button>
        </div>
      </div>
    </div>
  )
}
