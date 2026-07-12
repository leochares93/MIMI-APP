import { useParams, useNavigate } from 'react-router-dom'
import weeks from '../../data/weeks'

export default function WeekDetail() {
  const { week } = useParams<{ week: string }>()
  const navigate = useNavigate()
  const weekNum = parseInt(week || '1', 10)
  const weekData = weeks.find(w => w.week === weekNum)

  if (!weekData) {
    return (
      <div className="p-8 text-center">
        <p className="text-sage-400 text-lg">暂无第{weekNum}周的数据</p>
        <button onClick={() => navigate('/knowledge')} className="mt-4 text-sage-500 underline underline-offset-2">
          返回知识页
        </button>
      </div>
    )
  }

  const prevWeek = weekNum > 1 ? weekNum - 1 : null
  const nextWeek = weekNum < 40 ? weekNum + 1 : null

  const trimesterLabels: Record<number, string> = { 1: '第一孕期', 2: '第二孕期', 3: '第三孕期' }
  const trimesterStyles: Record<number, string> = {
    1: 'bg-sage-100 text-sage-700',
    2: 'bg-cream-300/60 text-sage-800',
    3: 'bg-terra-100 text-terra-700',
  }

  return (
    <div className="p-5 pb-24 space-y-6">
      {/* 导航 */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/knowledge')} className="text-sage-500 text-sm hover:text-sage-700 transition-colors">
          ← 返回知识页
        </button>
        <div className="flex gap-2">
          {prevWeek && (
            <button
              onClick={() => navigate(`/knowledge/week/${prevWeek}`)}
              className="px-4 py-2 bg-white border border-cream-300/60 rounded-xl text-sm text-sage-600 hover:bg-cream-200/50 transition-colors"
            >
              ← {prevWeek}周
            </button>
          )}
          {nextWeek && (
            <button
              onClick={() => navigate(`/knowledge/week/${nextWeek}`)}
              className="px-4 py-2 bg-sage-500 text-white rounded-xl text-sm hover:bg-sage-600 transition-colors"
            >
              {nextWeek}周 →
            </button>
          )}
        </div>
      </div>

      {/* 标题 */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-cream-300/60">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-light text-sage-800 tracking-tight">{weekData.title}</h2>
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${trimesterStyles[weekData.trimester]}`}>
            {trimesterLabels[weekData.trimester]}
          </span>
        </div>
        <div className="flex gap-6 text-sm text-sage-500">
          <span>👶 {weekData.fetalSize}</span>
          <span>📏 {weekData.fetalLength}</span>
          <span>⚖️ {weekData.fetalWeight}</span>
        </div>
      </div>

      {/* 胎儿发育 */}
      <SectionCard title="胎儿发育" icon="🔬">
        <ul className="space-y-3">
          {weekData.fetalDevelopment.map((d, i) => (
            <li key={i} className="flex gap-3 text-sm text-sage-700 leading-relaxed">
              <span className="text-sage-400 mt-0.5 flex-shrink-0">•</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* 母体变化 */}
      <SectionCard title="妈妈的变化" icon="👩">
        <ul className="space-y-3">
          {weekData.maternalChanges.map((d, i) => (
            <li key={i} className="flex gap-3 text-sm text-sage-700 leading-relaxed">
              <span className="text-sage-400 mt-0.5 flex-shrink-0">•</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        {weekData.commonSymptoms.length > 0 && (
          <div className="mt-5 pt-5 border-t border-cream-200/60">
            <p className="text-xs text-sage-400 mb-3 tracking-widest uppercase">常见症状</p>
            <div className="flex flex-wrap gap-2">
              {weekData.commonSymptoms.map(s => (
                <span key={s} className="text-xs px-3 py-1.5 bg-terra-50 text-terra-600 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      {/* 营养与饮食 */}
      <SectionCard title="营养与饮食" icon="🥗">
        <div className="mb-4">
          <p className="text-xs text-sage-400 mb-3 tracking-widest uppercase">重点营养</p>
          <div className="flex flex-wrap gap-2">
            {weekData.nutritionFocus.map(n => (
              <span key={n} className="text-xs px-3 py-1.5 bg-sage-100 text-sage-700 rounded-full font-medium">
                {n}
              </span>
            ))}
          </div>
        </div>
        <ul className="space-y-3">
          {weekData.nutritionTips.map((t, i) => (
            <li key={i} className="flex gap-3 text-sm text-sage-700 leading-relaxed">
              <span className="text-sage-400 mt-0.5 flex-shrink-0">•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* 运动建议 */}
      {weekData.exerciseRecommendations.length > 0 && (
        <SectionCard title="运动建议" icon="🧘">
          <ul className="space-y-3">
            {weekData.exerciseRecommendations.map((e, i) => (
              <li key={i} className="flex gap-3 text-sm text-sage-700 leading-relaxed">
                <span className="text-sage-400 mt-0.5 flex-shrink-0">•</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* 注意事项 */}
      <SectionCard title="注意事项" icon="⚠️">
        <ul className="space-y-3">
          {weekData.precautions.map((p, i) => (
            <li key={i} className="flex gap-3 text-sm text-sage-700 leading-relaxed">
              <span className="text-terra-400 mt-0.5 flex-shrink-0">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* 产检项目 */}
      {weekData.checkupItems.length > 0 && (
        <SectionCard title="产检项目" icon="🏥">
          <ul className="space-y-3">
            {weekData.checkupItems.map((c, i) => (
              <li key={i} className="flex gap-3 text-sm text-sage-700 leading-relaxed">
                <span className="text-sage-400 mt-0.5 flex-shrink-0">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* 待办清单 */}
      {weekData.toDoList.length > 0 && (
        <SectionCard title="本周待办" icon="✅">
          <ul className="space-y-3">
            {weekData.toDoList.map((t, i) => (
              <li key={i} className="flex gap-3 text-sm text-sage-700 leading-relaxed items-start">
                <span className="text-sage-400 text-base flex-shrink-0">○</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* 准爸爸贴士 */}
      <SectionCard title="准爸爸贴士" icon="👨">
        <p className="text-sm text-sage-700 leading-relaxed">{weekData.dadTips}</p>
      </SectionCard>

      {/* 每日贴士 */}
      <div className="bg-cream-200/70 rounded-3xl p-5 border border-cream-300/40">
        <p className="text-sm text-sage-700 leading-relaxed">
          <span className="font-medium text-sage-800">每日贴士 · </span>
          {weekData.dailyTip}
        </p>
      </div>

      {/* 上下周导航 */}
      <div className="flex justify-between pt-2">
        {prevWeek ? (
          <button
            onClick={() => navigate(`/knowledge/week/${prevWeek}`)}
            className="px-5 py-2.5 bg-white border border-cream-300/60 rounded-xl text-sm text-sage-600 hover:bg-cream-200/50 transition-colors"
          >
            ← 第{prevWeek}周
          </button>
        ) : <div />}
        {nextWeek ? (
          <button
            onClick={() => navigate(`/knowledge/week/${nextWeek}`)}
            className="px-5 py-2.5 bg-sage-500 text-white rounded-xl text-sm hover:bg-sage-600 transition-colors"
          >
            第{nextWeek}周 →
          </button>
        ) : <div />}
      </div>
    </div>
  )
}

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-cream-300/60">
      <h3 className="text-base font-medium text-sage-800 mb-4 tracking-wide">
        {icon} {title}
      </h3>
      {children}
    </div>
  )
}
