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
        <p className="text-gray-400 text-lg">暂无第{weekNum}周的数据</p>
        <button onClick={() => navigate('/knowledge')} className="mt-4 text-primary-500">
          返回知识页
        </button>
      </div>
    )
  }

  const prevWeek = weekNum > 1 ? weekNum - 1 : null
  const nextWeek = weekNum < 40 ? weekNum + 1 : null

  const trimesterColors = {
    1: 'bg-primary-100 text-primary-700',
    2: 'bg-calm-100 text-calm-700',
    3: 'bg-warm-100 text-warm-700',
  }

  const trimesterNames = { 1: '第一孕期', 2: '第二孕期', 3: '第三孕期' }

  return (
    <div className="p-4 pb-20">
      {/* 导航 */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate('/knowledge')} className="text-primary-500 text-sm flex items-center gap-1">
          ← 返回
        </button>
        <div className="flex gap-2">
          {prevWeek && (
            <button
              onClick={() => navigate(`/knowledge/week/${prevWeek}`)}
              className="px-3 py-1.5 bg-white border border-primary-200 rounded-full text-sm text-gray-600 hover:bg-primary-50"
            >
              ← 第{prevWeek}周
            </button>
          )}
          {nextWeek && (
            <button
              onClick={() => navigate(`/knowledge/week/${nextWeek}`)}
              className="px-3 py-1.5 bg-white border border-primary-200 rounded-full text-sm text-gray-600 hover:bg-primary-50"
            >
              第{nextWeek}周 →
            </button>
          )}
        </div>
      </div>

      {/* 标题 */}
      <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl p-5 text-white mb-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">{weekData.title}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${trimesterColors[weekData.trimester]}`}>
            {trimesterNames[weekData.trimester]}
          </span>
        </div>
        <div className="flex gap-4 text-sm text-primary-100">
          <span>👶 {weekData.fetalSize}</span>
          <span>📏 {weekData.fetalLength}</span>
          <span>⚖️ {weekData.fetalWeight}</span>
        </div>
      </div>

      {/* 胎儿发育 */}
      <SectionCard title="🔬 胎儿发育" color="primary">
        <ul className="space-y-2">
          {weekData.fetalDevelopment.map((d, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700">
              <span className="text-primary-400 mt-1">•</span>
              {d}
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* 母体变化 */}
      <SectionCard title="👩 妈妈的变化" color="calm">
        <ul className="space-y-2">
          {weekData.maternalChanges.map((d, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700">
              <span className="text-calm-400 mt-1">•</span>
              {d}
            </li>
          ))}
        </ul>
        {weekData.commonSymptoms.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">常见症状：</p>
            <div className="flex flex-wrap gap-1.5">
              {weekData.commonSymptoms.map(s => (
                <span key={s} className="text-xs px-2 py-1 bg-warm-50 text-warm-600 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      {/* 营养与饮食 */}
      <SectionCard title="🥗 营养与饮食" color="warm">
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-2">重点营养：</p>
          <div className="flex flex-wrap gap-1.5">
            {weekData.nutritionFocus.map(n => (
              <span key={n} className="text-xs px-2 py-1 bg-warm-100 text-warm-700 rounded-full font-medium">
                {n}
              </span>
            ))}
          </div>
        </div>
        <ul className="space-y-2">
          {weekData.nutritionTips.map((t, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700">
              <span className="text-warm-400 mt-1">•</span>
              {t}
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* 运动建议 */}
      {weekData.exerciseRecommendations.length > 0 && (
        <SectionCard title="🧘 运动建议" color="calm">
          <ul className="space-y-2">
            {weekData.exerciseRecommendations.map((e, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-calm-400 mt-1">•</span>
                {e}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* 注意事项 */}
      <SectionCard title="⚠️ 注意事项" color="primary">
        <ul className="space-y-2">
          {weekData.precautions.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700">
              <span className="text-primary-400 mt-1">•</span>
              {p}
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* 产检项目 */}
      {weekData.checkupItems.length > 0 && (
        <SectionCard title="🏥 产检项目" color="warm">
          <ul className="space-y-2">
            {weekData.checkupItems.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-warm-400 mt-1">•</span>
                {c}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* 待办清单 */}
      {weekData.toDoList.length > 0 && (
        <SectionCard title="✅ 本周待办" color="calm">
          <ul className="space-y-2">
            {weekData.toDoList.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700 items-start">
                <span className="text-calm-400">☐</span>
                {t}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* 准爸爸贴士 */}
      <SectionCard title="👨 准爸爸贴士" color="primary">
        <p className="text-sm text-gray-700">{weekData.dadTips}</p>
      </SectionCard>

      {/* 每日贴士 */}
      <div className="bg-gradient-to-r from-warm-100 to-primary-100 rounded-2xl p-4 mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">💡 每日贴士：</span>
          {weekData.dailyTip}
        </p>
      </div>

      {/* 上下周导航 */}
      <div className="flex justify-between">
        {prevWeek ? (
          <button
            onClick={() => navigate(`/knowledge/week/${prevWeek}`)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
          >
            ← 第{prevWeek}周
          </button>
        ) : <div />}
        {nextWeek ? (
          <button
            onClick={() => navigate(`/knowledge/week/${nextWeek}`)}
            className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm hover:bg-primary-600"
          >
            第{nextWeek}周 →
          </button>
        ) : <div />}
      </div>
    </div>
  )
}

function SectionCard({ title, children, color }: { title: string; children: React.ReactNode; color: 'primary' | 'calm' | 'warm' }) {
  const borderColors = {
    primary: 'border-l-primary-400',
    calm: 'border-l-calm-400',
    warm: 'border-l-warm-400',
  }

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 border-l-4 ${borderColors[color]} mb-3`}>
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      {children}
    </div>
  )
}
