import { useNavigate } from 'react-router-dom'
import { useProfileStore } from '../../store/useProfileStore'
import weeks from '../../data/weeks'
import { categories } from '../../data/categories'

export default function KnowledgePage() {
  const navigate = useNavigate()
  const profile = useProfileStore(s => s.profile)

  const trimesterGroups = [
    { label: '第一孕期 · 1–12 周', weeks: weeks.filter(w => w.trimester === 1), active: 'bg-sage-500 text-white' },
    { label: '第二孕期 · 13–27 周', weeks: weeks.filter(w => w.trimester === 2), active: 'bg-sage-600 text-white' },
    { label: '第三孕期 · 28–40 周', weeks: weeks.filter(w => w.trimester === 3), active: 'bg-terra-500 text-white' },
  ]

  return (
    <div className="pb-24">
      {/* ════ 孕期周历 ════ */}
      <div className="mx-4 mt-4">
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-sage-100/60">
          <h2 className="text-lg font-bold text-sage-800 mb-6">📅 孕期周历</h2>
          {trimesterGroups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-5' : ''}>
              <p className="text-xs text-sage-400 tracking-wide mb-3 font-medium">{group.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.weeks.map(w => {
                  const isCurrent = w.week === profile.currentWeek
                  return (
                    <button
                      key={w.week}
                      onClick={() => navigate(`/knowledge/week/${w.week}`)}
                      className={`w-10 h-10 rounded-xl text-xs font-medium transition-all ${
                        isCurrent
                          ? `${group.active} shadow-md`
                          : 'text-sage-500 hover:bg-sage-50 hover:text-sage-700'
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
      </div>

      {/* ════ 知识分类 ════ */}
      <div className="mx-4 mt-4">
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-sage-100/60">
          <h2 className="text-lg font-bold text-sage-800 mb-5">📖 知识分类</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate(cat.id === 'weeks' ? `/knowledge/week/${profile.currentWeek}` : '/chat')}
                className="text-left p-4 rounded-2xl bg-gradient-to-br from-cream-50 to-sage-50/50 hover:from-cream-100 hover:to-sage-100/50 border border-sage-100/40 transition-all hover:shadow-sm"
              >
                <span className="text-2xl mb-2 block">{cat.icon}</span>
                <h4 className="text-sm font-semibold text-sage-700 mb-0.5">{cat.name}</h4>
                <p className="text-[11px] text-sage-400 leading-relaxed">{cat.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ════ 快速访问 ════ */}
      <div className="mx-4 mt-4">
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-sage-100/60">
          <h2 className="text-lg font-bold text-sage-800 mb-4">🔗 快速访问</h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate(`/knowledge/week/${profile.currentWeek}`)}
              className="w-full text-left p-4 rounded-2xl bg-cream-100/50 hover:bg-cream-200/50 transition-colors flex items-center gap-3"
            >
              <span className="text-xl">📋</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-sage-700">本周指南</p>
                <p className="text-xs text-sage-400 mt-0.5">查看第{profile.currentWeek}周详细指导</p>
              </div>
              <span className="text-sage-300">→</span>
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="w-full text-left p-4 rounded-2xl bg-cream-100/50 hover:bg-cream-200/50 transition-colors flex items-center gap-3"
            >
              <span className="text-xl">💬</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-sage-700">智能问答</p>
                <p className="text-xs text-sage-400 mt-0.5">向孕期助手提问</p>
              </div>
              <span className="text-sage-300">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
