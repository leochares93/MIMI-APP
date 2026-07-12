import { useParams, useNavigate } from 'react-router-dom'
import weeks from '../../data/weeks'

export default function WeekDetail() {
  const { week } = useParams<{ week: string }>()
  const navigate = useNavigate()
  const weekNum = parseInt(week || '1', 10)
  const weekData = weeks.find(w => w.week === weekNum)

  if (!weekData) {
    return (
      <div className="px-6 py-20 text-center">
        <p className="text-sage-400 text-lg">暂无第{weekNum}周数据</p>
        <button onClick={() => navigate('/knowledge')} className="mt-4 text-sage-500 underline">返回知识页</button>
      </div>
    )
  }

  const prevWeek = weekNum > 1 ? weekNum - 1 : null
  const nextWeek = weekNum < 40 ? weekNum + 1 : null
  const triColors: Record<number, { from: string; to: string; badge: string }> = {
    1: { from: 'from-sage-400', to: 'to-sage-500', badge: 'bg-sage-100 text-sage-600' },
    2: { from: 'from-sage-500', to: 'to-sage-600', badge: 'bg-sage-100 text-sage-700' },
    3: { from: 'from-terra-400', to: 'to-terra-500', badge: 'bg-terra-100 text-terra-600' },
  }
  const tri = triColors[weekData.trimester]

  return (
    <div className="pb-24">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => navigate('/knowledge')} className="text-sm text-sage-500 hover:text-sage-700 font-medium">← 返回</button>
        <div className="flex gap-2">
          {prevWeek && (
            <button onClick={() => navigate(`/knowledge/week/${prevWeek}`)} className="px-3 py-1.5 bg-white border border-sage-200 rounded-full text-xs text-sage-600 hover:bg-sage-50">
              ← {prevWeek}周
            </button>
          )}
          {nextWeek && (
            <button onClick={() => navigate(`/knowledge/week/${nextWeek}`)} className="px-3 py-1.5 bg-sage-500 text-white rounded-full text-xs font-medium hover:bg-sage-600">
              {nextWeek}周 →
            </button>
          )}
        </div>
      </div>

      {/* Hero 渐变卡片 */}
      <div className={`mx-4 bg-gradient-to-br ${tri.from} ${tri.to} rounded-[2rem] p-8 text-white shadow-lg`}>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${tri.badge} mb-4`}>
          {weekData.trimester === 1 ? '第一孕期' : weekData.trimester === 2 ? '第二孕期' : '第三孕期'}
        </span>
        <h1 className="text-3xl font-bold tracking-tight mb-3">{weekData.title}</h1>
        <div className="flex gap-4 text-sm text-white/60">
          <span>👶 {weekData.fetalSize}</span>
          <span>📏 {weekData.fetalLength}</span>
          <span>⚖️ {weekData.fetalWeight}</span>
        </div>
      </div>

      {/* 胎儿发育 */}
      <SectionCard icon="🔬" title="胎儿发育" className="mx-4 mt-4">
        <BulletList items={weekData.fetalDevelopment} />
      </SectionCard>

      {/* 妈妈的变化 */}
      <SectionCard icon="👩" title="妈妈的变化" className="mx-4 mt-3">
        <BulletList items={weekData.maternalChanges} />
        {weekData.commonSymptoms.length > 0 && (
          <div className="mt-4 pt-4 border-t border-sage-100">
            <p className="text-xs text-sage-400 mb-2 tracking-wide">常见症状</p>
            <div className="flex flex-wrap gap-1.5">
              {weekData.commonSymptoms.map(s => (
                <span key={s} className="text-xs px-2.5 py-1 bg-terra-50 text-terra-600 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      {/* 营养 */}
      <SectionCard icon="🥗" title="营养与饮食" className="mx-4 mt-3">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {weekData.nutritionFocus.map(n => (
            <span key={n} className="text-xs px-2.5 py-1 bg-sage-100 text-sage-700 rounded-full font-medium">{n}</span>
          ))}
        </div>
        <BulletList items={weekData.nutritionTips} />
      </SectionCard>

      {/* 运动 */}
      {weekData.exerciseRecommendations.length > 0 && (
        <SectionCard icon="🧘" title="运动建议" className="mx-4 mt-3">
          <BulletList items={weekData.exerciseRecommendations} />
        </SectionCard>
      )}

      {/* 注意事项 */}
      <SectionCard icon="⚠️" title="注意事项" className="mx-4 mt-3">
        <BulletList items={weekData.precautions} color="terra" />
      </SectionCard>

      {/* 产检 */}
      {weekData.checkupItems.length > 0 && (
        <SectionCard icon="🏥" title="产检项目" className="mx-4 mt-3">
          <BulletList items={weekData.checkupItems} />
        </SectionCard>
      )}

      {/* 待办 */}
      {weekData.toDoList.length > 0 && (
        <SectionCard icon="✅" title="本周待办" className="mx-4 mt-3">
          <div className="space-y-2">
            {weekData.toDoList.map((t, i) => (
              <p key={i} className="text-sm text-sage-700 leading-relaxed flex gap-3">
                <span className="text-sage-300 text-base">○</span> {t}
              </p>
            ))}
          </div>
        </SectionCard>
      )}

      {/* 准爸爸 */}
      <SectionCard icon="👨" title="准爸爸贴士" className="mx-4 mt-3">
        <p className="text-sm text-sage-700 leading-relaxed">{weekData.dadTips}</p>
      </SectionCard>

      {/* 每日贴士 */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-cream-100 to-sage-50 rounded-[1.5rem] p-5 border border-sage-100/60">
        <p className="text-xs text-sage-400 tracking-wide mb-2 uppercase">每日贴士</p>
        <p className="text-sm text-sage-700 leading-relaxed">{weekData.dailyTip}</p>
      </div>

      {/* 底部导航 */}
      <div className="flex justify-between mx-4 mt-6 pb-4">
        {prevWeek ? (
          <button onClick={() => navigate(`/knowledge/week/${prevWeek}`)} className="px-4 py-2 bg-white border border-sage-200 rounded-full text-sm text-sage-600 hover:bg-sage-50">← 第{prevWeek}周</button>
        ) : <div />}
        {nextWeek ? (
          <button onClick={() => navigate(`/knowledge/week/${nextWeek}`)} className="px-5 py-2 bg-sage-500 text-white rounded-full text-sm font-medium hover:bg-sage-600">第{nextWeek}周 →</button>
        ) : <div />}
      </div>
    </div>
  )
}

/* ── 子组件 ── */

function SectionCard({ icon, title, children, className = '' }: { icon: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-[1.25rem] p-5 shadow-sm border border-sage-100/60 ${className}`}>
      <h3 className="text-sm font-semibold text-sage-800 mb-4">{icon} {title}</h3>
      {children}
    </div>
  )
}

function BulletList({ items, color = 'sage' }: { items: string[]; color?: string }) {
  const dotColor = color === 'terra' ? 'text-terra-400' : 'text-sage-400'
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <p key={i} className="text-sm text-sage-700 leading-relaxed flex gap-3">
          <span className={`${dotColor} mt-0.5 flex-shrink-0`}>•</span>
          {item}
        </p>
      ))}
    </div>
  )
}
