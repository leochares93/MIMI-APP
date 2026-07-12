import { useParams, useNavigate } from 'react-router-dom'
import weeks from '../../data/weeks'

const triColors: Record<number, { from: string; to: string; via: string; badge: string }> = {
  1: { from: 'from-peach-300', to: 'to-blush-300', via: 'via-peach-200', badge: 'bg-peach-100 text-peach-600' },
  2: { from: 'from-sage-300', to: 'to-sage-400', via: 'via-sage-200', badge: 'bg-sage-100 text-sage-600' },
  3: { from: 'from-blush-300', to: 'to-peach-400', via: 'via-blush-200', badge: 'bg-blush-100 text-blush-500' },
}

export default function WeekDetail() {
  const { week } = useParams<{ week: string }>()
  const navigate = useNavigate()
  const weekNum = parseInt(week || '1', 10)
  const weekData = weeks.find(w => w.week === weekNum)

  if (!weekData) {
    return (
      <div className="px-6 py-20 text-center">
        <p className="text-warm-900/30 text-lg">暂无第{weekNum}周数据</p>
        <button onClick={() => navigate('/knowledge')} className="mt-4 text-peach-500 font-medium">← 返回知识页</button>
      </div>
    )
  }

  const prevWeek = weekNum > 1 ? weekNum - 1 : null
  const nextWeek = weekNum < 40 ? weekNum + 1 : null
  const tri = triColors[weekData.trimester]

  return (
    <div className="pb-24">
      {/* 导航 */}
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={() => navigate('/knowledge')} className="text-sm text-warm-900/40 hover:text-warm-900/70 font-medium">← 返回</button>
        <div className="flex gap-2">
          {prevWeek && <button onClick={() => navigate(`/knowledge/week/${prevWeek}`)} className="px-3 py-1.5 text-xs text-warm-900/40 hover:text-warm-900/70 bg-white rounded-full border border-warm-200/40">← {prevWeek}周</button>}
          {nextWeek && <button onClick={() => navigate(`/knowledge/week/${nextWeek}`)} className="px-3 py-1.5 text-xs bg-peach-500 text-white rounded-full font-medium hover:bg-peach-600">{nextWeek}周 →</button>}
        </div>
      </div>

      {/* Hero */}
      <div className={`mx-6 bg-gradient-to-br ${tri.from} ${tri.via} ${tri.to} rounded-[2.5rem] p-8 text-white shadow-xl mb-6`}>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${tri.badge} mb-4`}>
          {weekData.trimester === 1 ? '第一孕期' : weekData.trimester === 2 ? '第二孕期' : '第三孕期'}
        </span>
        <h1 className="text-3xl font-bold tracking-tight mb-3">{weekData.title}</h1>
        <div className="flex gap-4 text-sm text-white/60">
          <span>👶 {weekData.fetalSize}</span>
          <span>📏 {weekData.fetalLength}</span>
          <span>⚖️ {weekData.fetalWeight}</span>
        </div>
      </div>

      {/* 内容卡片 */}
      <div className="px-6 space-y-4">
        <Card icon="🔬" title="胎儿发育">
          <Bullets items={weekData.fetalDevelopment} />
        </Card>

        <Card icon="👩" title="妈妈的变化">
          <Bullets items={weekData.maternalChanges} />
          {weekData.commonSymptoms.length > 0 && (
            <div className="mt-4 pt-4 border-t border-warm-100">
              <p className="text-xs text-warm-900/30 mb-2 tracking-wide font-medium">常见症状</p>
              <div className="flex flex-wrap gap-1.5">
                {weekData.commonSymptoms.map(s => (
                  <span key={s} className="text-xs px-2.5 py-1 bg-peach-50 text-peach-600 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card icon="🥗" title="营养与饮食">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {weekData.nutritionFocus.map(n => (
              <span key={n} className="text-xs px-2.5 py-1 bg-sage-100 text-sage-600 rounded-full font-medium">{n}</span>
            ))}
          </div>
          <Bullets items={weekData.nutritionTips} />
        </Card>

        {weekData.exerciseRecommendations.length > 0 && (
          <Card icon="🧘" title="运动建议">
            <Bullets items={weekData.exerciseRecommendations} />
          </Card>
        )}

        <Card icon="⚠️" title="注意事项">
          <Bullets items={weekData.precautions} color="peach" />
        </Card>

        {weekData.checkupItems.length > 0 && (
          <Card icon="🏥" title="产检项目">
            <Bullets items={weekData.checkupItems} />
          </Card>
        )}

        {weekData.toDoList.length > 0 && (
          <Card icon="✅" title="本周待办">
            {weekData.toDoList.map((t, i) => (
              <p key={i} className="text-sm text-warm-900/55 leading-relaxed flex gap-3 mb-2">
                <span className="text-warm-900/20">○</span> {t}
              </p>
            ))}
          </Card>
        )}

        <Card icon="👨" title="准爸爸贴士">
          <p className="text-sm text-warm-900/55 leading-relaxed">{weekData.dadTips}</p>
        </Card>
      </div>

      {/* 每日贴士 */}
      <div className="mx-6 mt-4 bg-gradient-to-r from-blush-50 to-peach-50 rounded-3xl p-6 border border-blush-100/30">
        <p className="text-xs text-peach-400 tracking-wide font-medium mb-2 uppercase">每日贴士</p>
        <p className="text-sm text-warm-900/55 leading-relaxed">{weekData.dailyTip}</p>
      </div>

      {/* 底部导航 */}
      <div className="flex justify-between mx-6 mt-6 pb-6">
        {prevWeek ? <button onClick={() => navigate(`/knowledge/week/${prevWeek}`)} className="px-4 py-2 bg-white rounded-full text-sm text-warm-900/40 hover:text-warm-900/70 border border-warm-200/40">← 第{prevWeek}周</button> : <div />}
        {nextWeek ? <button onClick={() => navigate(`/knowledge/week/${nextWeek}`)} className="px-5 py-2 bg-peach-500 text-white rounded-full text-sm font-medium hover:bg-peach-600">第{nextWeek}周 →</button> : <div />}
      </div>
    </div>
  )
}

function Card({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-warm-200/40">
      <h3 className="text-sm font-bold text-warm-900/75 mb-4">{icon} {title}</h3>
      {children}
    </div>
  )
}

function Bullets({ items, color = 'sage' }: { items: string[]; color?: string }) {
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <p key={i} className="text-sm text-warm-900/55 leading-relaxed flex gap-3">
          <span className={color === 'peach' ? 'text-peach-400 mt-0.5 flex-shrink-0' : 'text-sage-400 mt-0.5 flex-shrink-0'}>•</span>
          {item}
        </p>
      ))}
    </div>
  )
}
