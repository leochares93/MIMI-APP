import { useNavigate } from 'react-router-dom'
import { useProfileStore } from '../../store/useProfileStore'
import weeks from '../../data/weeks'
import { categories } from '../../data/categories'

export default function KnowledgePage() {
  const navigate = useNavigate()
  const profile = useProfileStore(s => s.profile)

  const trimesterGroups = [
    { label: '第一孕期 · 1–12 周', weeks: weeks.filter(w => w.trimester === 1), activeBg: 'bg-black/80', dot: 'bg-black/30' },
    { label: '第二孕期 · 13–27 周', weeks: weeks.filter(w => w.trimester === 2), activeBg: 'bg-black/80', dot: 'bg-black/30' },
    { label: '第三孕期 · 28–40 周', weeks: weeks.filter(w => w.trimester === 3), activeBg: 'bg-black/80', dot: 'bg-black/30' },
  ]

  return (
    <div className="pb-24">
      {/* ── 孕期周历 ── */}
      <section className="px-6 pt-10 pb-4">
        <h2 className="text-lg font-medium text-black/80 tracking-tight mb-8">孕期周历</h2>
        {trimesterGroups.map((group, gi) => (
          <div key={gi} className="mb-8">
            <p className="text-[11px] tracking-[0.15em] uppercase text-black/25 mb-4">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.weeks.map(w => {
                const isCurrent = w.week === profile.currentWeek
                return (
                  <button
                    key={w.week}
                    onClick={() => navigate(`/knowledge/week/${w.week}`)}
                    className={`w-11 h-11 rounded-xl text-sm transition-all duration-200 ${
                      isCurrent
                        ? `${group.activeBg} text-white font-medium`
                        : 'text-black/45 hover:bg-black/[0.04] hover:text-black/65'
                    }`}
                  >
                    {w.week}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      <div className="h-px bg-black/5 mx-6" />

      {/* ── 知识分类 ── */}
      <section className="px-6 py-10">
        <h2 className="text-lg font-medium text-black/80 tracking-tight mb-8">知识分类</h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate('/chat')}
              className="text-left p-5 rounded-2xl bg-black/[0.02] hover:bg-black/[0.04] transition-colors"
            >
              <span className="text-2xl mb-3 block">{cat.icon}</span>
              <h4 className="text-sm font-medium text-black/70 mb-1">{cat.name}</h4>
              <p className="text-xs text-black/35 leading-relaxed">{cat.description}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="h-px bg-black/5 mx-6" />

      {/* ── 快速访问 ── */}
      <section className="px-6 py-10">
        <h2 className="text-lg font-medium text-black/80 tracking-tight mb-6">快速访问</h2>
        <div className="space-y-2">
          <button
            onClick={() => navigate(`/knowledge/week/${profile.currentWeek}`)}
            className="w-full text-left p-5 rounded-2xl bg-black/[0.02] hover:bg-black/[0.04] transition-colors flex items-center gap-4"
          >
            <span className="text-xl">📋</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-black/70">本周指南</p>
              <p className="text-xs text-black/35 mt-0.5">查看第{profile.currentWeek}周详细指导</p>
            </div>
            <span className="text-black/20">→</span>
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="w-full text-left p-5 rounded-2xl bg-black/[0.02] hover:bg-black/[0.04] transition-colors flex items-center gap-4"
          >
            <span className="text-xl">💬</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-black/70">智能问答</p>
              <p className="text-xs text-black/35 mt-0.5">向孕期助手提问</p>
            </div>
            <span className="text-black/20">→</span>
          </button>
        </div>
      </section>
    </div>
  )
}
