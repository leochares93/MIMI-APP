import { useNavigate } from 'react-router-dom'
import { useProfileStore } from '../../store/useProfileStore'
import weeks from '../../data/weeks'
import { categories } from '../../data/categories'

export default function KnowledgePage() {
  const navigate = useNavigate()
  const profile = useProfileStore(s => s.profile)

  const groups = [
    { label: '第一孕期 · 1–12 周', weeks: weeks.filter(w => w.trimester === 1), active: 'bg-peach-500 text-white' },
    { label: '第二孕期 · 13–27 周', weeks: weeks.filter(w => w.trimester === 2), active: 'bg-sage-500 text-white' },
    { label: '第三孕期 · 28–40 周', weeks: weeks.filter(w => w.trimester === 3), active: 'bg-blush-500 text-white' },
  ]

  return (
    <div className="pb-24">
      {/* ════ 孕期周历 ════ */}
      <div className="px-6 pt-8 pb-6">
        <h2 className="text-xl font-bold text-warm-900/80 mb-6">📅 孕期周历</h2>
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-warm-200/40 space-y-6">
          {groups.map((g, gi) => (
            <div key={gi}>
              <p className="text-xs text-warm-900/30 font-medium tracking-wide mb-3">{g.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.weeks.map(w => (
                  <button
                    key={w.week}
                    onClick={() => navigate(`/knowledge/week/${w.week}`)}
                    className={`w-10 h-10 rounded-xl text-xs font-semibold transition-all ${
                      w.week === profile.currentWeek
                        ? `${g.active} shadow-md`
                        : 'text-warm-900/40 hover:bg-warm-100 hover:text-warm-900/60'
                    }`}
                  >
                    {w.week}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════ 知识分类 ════ */}
      <div className="px-6 mb-6">
        <h2 className="text-xl font-bold text-warm-900/80 mb-4">📖 知识分类</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate(cat.id === 'weeks' ? `/knowledge/week/${profile.currentWeek}` : '/chat')}
              className="bg-white rounded-[1.25rem] p-5 shadow-sm border border-warm-200/40 text-left hover:shadow-md transition-shadow"
            >
              <span className="text-2xl mb-3 block">{cat.icon}</span>
              <h4 className="text-sm font-bold text-warm-900/70 mb-1">{cat.name}</h4>
              <p className="text-[11px] text-warm-900/35 leading-relaxed">{cat.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ════ 快速访问 ════ */}
      <div className="px-6">
        <h2 className="text-xl font-bold text-warm-900/80 mb-4">🔗 快速访问</h2>
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/knowledge/week/${profile.currentWeek}`)}
            className="w-full bg-white rounded-[1.25rem] p-5 shadow-sm border border-warm-200/40 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">📋</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-warm-900/70">本周指南</p>
              <p className="text-xs text-warm-900/35 mt-0.5">第{profile.currentWeek}周详细指导</p>
            </div>
            <span className="text-warm-900/20">→</span>
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="w-full bg-white rounded-[1.25rem] p-5 shadow-sm border border-warm-200/40 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">💬</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-warm-900/70">智能问答</p>
              <p className="text-xs text-warm-900/35 mt-0.5">向孕期助手提问</p>
            </div>
            <span className="text-warm-900/20">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
