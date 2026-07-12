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
        <p className="text-black/30 text-lg">暂无第{weekNum}周数据</p>
        <button onClick={() => navigate('/knowledge')} className="mt-6 text-sm text-black/50 underline underline-offset-4">返回知识页</button>
      </div>
    )
  }

  const prevWeek = weekNum > 1 ? weekNum - 1 : null
  const nextWeek = weekNum < 40 ? weekNum + 1 : null

  return (
    <div className="pb-24">
      {/* ── 顶部导航 ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
        <button onClick={() => navigate('/knowledge')} className="text-sm text-black/40 hover:text-black/70 transition-colors">← 返回</button>
        <div className="flex gap-3">
          {prevWeek && (
            <button onClick={() => navigate(`/knowledge/week/${prevWeek}`)} className="text-xs text-black/35 hover:text-black/60 transition-colors py-1 px-3">← {prevWeek}周</button>
          )}
          {nextWeek && (
            <button onClick={() => navigate(`/knowledge/week/${nextWeek}`)} className="text-xs bg-black/80 text-white hover:bg-black transition-colors py-1.5 px-4 rounded-full font-medium">{nextWeek}周 →</button>
          )}
        </div>
      </div>

      {/* ── Hero 标题 ── */}
      <section className="px-6 pt-10 pb-8">
        <p className="text-xs tracking-[0.2em] uppercase text-black/30 mb-4">
          {weekData.trimester === 1 ? '第一孕期' : weekData.trimester === 2 ? '第二孕期' : '第三孕期'}
        </p>
        <h1 className="text-3xl font-light tracking-[-0.02em] text-black/85 mb-4">{weekData.title}</h1>
        <div className="flex gap-6 text-sm text-black/35">
          <span>👶 {weekData.fetalSize}</span>
          <span>📏 {weekData.fetalLength}</span>
          <span>⚖️ {weekData.fetalWeight}</span>
        </div>
      </section>

      <div className="h-px bg-black/5 mx-6" />

      {/* ── 胎儿发育 ── */}
      <Section title="胎儿发育">
        <List items={weekData.fetalDevelopment} />
      </Section>

      <div className="h-px bg-black/5 mx-6" />

      {/* ── 妈妈的变化 ── */}
      <Section title="妈妈的变化">
        <List items={weekData.maternalChanges} />
        {weekData.commonSymptoms.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] tracking-[0.15em] uppercase text-black/25 mb-3">常见症状</p>
            <div className="flex flex-wrap gap-2">
              {weekData.commonSymptoms.map(s => (
                <span key={s} className="text-xs px-3 py-1.5 bg-black/[0.03] text-black/45 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}
      </Section>

      <div className="h-px bg-black/5 mx-6" />

      {/* ── 营养 ── */}
      <Section title="营养与饮食">
        <div className="flex flex-wrap gap-2 mb-6">
          {weekData.nutritionFocus.map(n => (
            <span key={n} className="text-xs px-3 py-1.5 bg-black/[0.04] text-black/60 rounded-full font-medium">{n}</span>
          ))}
        </div>
        <List items={weekData.nutritionTips} />
      </Section>

      {weekData.exerciseRecommendations.length > 0 && (
        <>
          <div className="h-px bg-black/5 mx-6" />
          <Section title="运动建议">
            <List items={weekData.exerciseRecommendations} />
          </Section>
        </>
      )}

      <div className="h-px bg-black/5 mx-6" />
      <Section title="注意事项">
        <List items={weekData.precautions} />
      </Section>

      {weekData.checkupItems.length > 0 && (
        <>
          <div className="h-px bg-black/5 mx-6" />
          <Section title="产检项目">
            <List items={weekData.checkupItems} />
          </Section>
        </>
      )}

      {weekData.toDoList.length > 0 && (
        <>
          <div className="h-px bg-black/5 mx-6" />
          <Section title="本周待办">
            <div className="space-y-3">
              {weekData.toDoList.map((t, i) => (
                <p key={i} className="text-sm text-black/50 leading-relaxed flex gap-3">
                  <span className="text-black/20 text-base flex-shrink-0">○</span>
                  {t}
                </p>
              ))}
            </div>
          </Section>
        </>
      )}

      <div className="h-px bg-black/5 mx-6" />
      <Section title="准爸爸贴士">
        <p className="text-sm text-black/50 leading-relaxed">{weekData.dadTips}</p>
      </Section>

      {/* ── 每日贴士 ── */}
      <section className="mx-6 my-10 px-6 py-8 bg-black/[0.02] rounded-3xl">
        <p className="text-[11px] tracking-[0.15em] uppercase text-black/30 mb-3">每日贴士</p>
        <p className="text-[15px] text-black/55 leading-relaxed">{weekData.dailyTip}</p>
      </section>

      {/* ── 底部导航 ── */}
      <div className="flex justify-between px-6 pb-8">
        {prevWeek ? (
          <button onClick={() => navigate(`/knowledge/week/${prevWeek}`)} className="text-sm text-black/35 hover:text-black/60 transition-colors">← 第{prevWeek}周</button>
        ) : <div />}
        {nextWeek ? (
          <button onClick={() => navigate(`/knowledge/week/${nextWeek}`)} className="text-sm bg-black/80 text-white hover:bg-black transition-colors px-5 py-2 rounded-full font-medium">第{nextWeek}周 →</button>
        ) : <div />}
      </div>
    </div>
  )
}

/* ── 可复用子组件 ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-6 py-8">
      <h2 className="text-sm font-semibold text-black/70 tracking-wide mb-5">{title}</h2>
      {children}
    </section>
  )
}

function List({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <p key={i} className="text-sm text-black/50 leading-relaxed flex gap-3">
          <span className="text-black/20 mt-0.5 flex-shrink-0">—</span>
          {item}
        </p>
      ))}
    </div>
  )
}
