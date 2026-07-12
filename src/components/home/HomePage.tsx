import { useNavigate } from 'react-router-dom'
import { useProfileStore } from '../../store/useProfileStore'
import { getRecommendations } from '../../engine/recommender'
import { calculateBMI, getBMICategory } from '../../utils/bmi'
import { daysUntilDue } from '../../utils/weekCalculator'
import weeks from '../../data/weeks'

export default function HomePage() {
  const navigate = useNavigate()
  const profile = useProfileStore(s => s.profile)
  const bmi = calculateBMI(profile.prePregnancyWeight, profile.height)
  const weekData = weeks.find(w => w.week === profile.currentWeek)
  const recommendations = getRecommendations(profile)
  const remainingDays = profile.dueDate ? daysUntilDue(profile.dueDate) : 280 - profile.currentWeek * 7
  const progressPct = Math.round((profile.currentWeek / 40) * 100)

  return (
    <div className="pb-24">
      {/* ════ Hero 渐变区 ════ */}
      <div className="bg-gradient-to-b from-peach-100 via-blush-50 to-warm-100 px-6 pt-12 pb-16">
        <p className="text-peach-500/70 text-xs tracking-[0.2em] uppercase font-medium mb-4">
          第 {profile.currentWeek} 周 · {weekData?.fetalSize}
        </p>
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-8xl font-light tracking-[-0.04em] text-warm-900/85">{profile.currentWeek}</span>
          <span className="text-3xl font-light text-warm-900/25">/ 40</span>
        </div>
        <p className="text-warm-900/40 mb-8 text-sm leading-relaxed">
          {profile.dueDate ? `预产期 ${profile.dueDate} · 约 ${remainingDays} 天` : '设置末次月经以计算预产期'}
        </p>

        {/* 进度条 */}
        <div className="bg-white/50 rounded-full h-2.5 overflow-hidden shadow-inner mb-2">
          <div
            className="bg-gradient-to-r from-peach-400 to-blush-400 h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-warm-900/30 text-xs">{progressPct}% 完成</p>
      </div>

      {/* ════ 宝宝状态 ════ */}
      {weekData && (
        <div className="px-6 -mt-8 mb-6">
          <div
            onClick={() => navigate(`/knowledge/week/${profile.currentWeek}`)}
            className="bg-white rounded-3xl p-6 shadow-lg shadow-warm-900/5 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-peach-100 to-blush-100 flex items-center justify-center text-3xl flex-shrink-0 shadow-sm">
                👶
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-peach-400 uppercase tracking-wide font-medium mb-1">宝宝本周</p>
                <h3 className="text-lg font-bold text-warm-900/80">{weekData.title}</h3>
                <p className="text-sm text-warm-900/40 mt-0.5">约 {weekData.fetalSize} · 身长 {weekData.fetalLength}</p>
              </div>
              <span className="text-warm-900/20 text-xl">→</span>
            </div>
            <div className="mt-4 bg-peach-50/60 rounded-2xl px-5 py-4 border border-peach-100/30">
              <p className="text-sm text-warm-900/55 leading-relaxed">{weekData.dailyTip}</p>
            </div>
          </div>
        </div>
      )}

      {/* ════ 三指标 ════ */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center border border-warm-200/40">
            <p className="text-2xl font-bold text-peach-500">{bmi}</p>
            <p className="text-[11px] text-warm-900/35 mt-1.5 tracking-wide">孕前 BMI</p>
            <p className="text-[11px] text-peach-400 mt-0.5 font-medium">{getBMICategory(bmi)}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center border border-warm-200/40">
            <p className="text-2xl font-bold text-warm-900/70">{profile.currentWeight}<span className="text-sm text-warm-900/30 ml-0.5">kg</span></p>
            <p className="text-[11px] text-warm-900/35 mt-1.5 tracking-wide">当前体重</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center border border-warm-200/40">
            <p className="text-2xl font-bold text-sage-500">{remainingDays}</p>
            <p className="text-[11px] text-warm-900/35 mt-1.5 tracking-wide">距预产期</p>
            <p className="text-[11px] text-sage-400 mt-0.5 font-medium">天</p>
          </div>
        </div>
      </div>

      {/* ════ 推荐食谱 ════ */}
      {recommendations.dailyRecipes.length > 0 && (
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-warm-900/80">🍳 今日推荐食谱</h3>
            <button onClick={() => navigate('/knowledge')} className="text-sm text-peach-500 font-medium hover:text-peach-600">全部 →</button>
          </div>
          <div className="space-y-3">
            {recommendations.dailyRecipes.slice(0, 5).map(recipe => (
              <div key={recipe.id} className="bg-white rounded-2xl p-5 shadow-sm border border-warm-200/40 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <span className="text-2xl flex-shrink-0">
                    {recipe.category === 'soup' ? '🍲' : recipe.category === 'main' ? '🍽️' : recipe.category === 'breakfast' ? '🥣' : recipe.category === 'snack' ? '🍰' : '🥤'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-warm-900/75 text-sm">{recipe.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        recipe.difficulty === 'easy' ? 'bg-sage-100 text-sage-600' : 'bg-peach-100 text-peach-500'
                      }`}>
                        {recipe.difficulty === 'easy' ? '简单' : '中等'}
                      </span>
                    </div>
                    <p className="text-xs text-warm-900/40 leading-relaxed line-clamp-1">{recipe.benefits}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-3 ml-12">
                  {recipe.keyNutrients.slice(0, 4).map(n => (
                    <span key={n} className="text-[10px] bg-warm-100 text-warm-900/45 px-2 py-1 rounded-lg font-medium">{n}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════ 推荐运动 ════ */}
      {recommendations.dailyExercises.length > 0 && (
        <div className="px-6 mb-6">
          <h3 className="text-lg font-bold text-warm-900/80 mb-4">🧘 今日推荐运动</h3>
          <div className="space-y-3">
            {recommendations.dailyExercises.slice(0, 3).map(exercise => (
              <div key={exercise.id} className="bg-white rounded-2xl p-5 shadow-sm border border-warm-200/40">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center text-xl flex-shrink-0">
                    {exercise.category === 'yoga' ? '🧘' : exercise.category === 'walking' ? '🚶' : exercise.category === 'pelvic' ? '🦵' : exercise.category === 'breathing' ? '🌬️' : '🤸'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-warm-900/75 text-sm">{exercise.name}</h4>
                    <p className="text-xs text-warm-900/40 mt-0.5">{exercise.frequency}</p>
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-sage-100 text-sage-600 font-semibold">{exercise.duration}分钟</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════ 贴心提醒 ════ */}
      {recommendations.warningFlags.length > 0 && (
        <div className="px-6">
          <div className="bg-gradient-to-br from-blush-50 to-peach-50 rounded-3xl p-6 border border-blush-100/40">
            <h3 className="text-sm font-bold text-peach-600 mb-4">💝 贴心提醒</h3>
            <div className="space-y-3">
              {recommendations.warningFlags.map((flag, i) => (
                <p key={i} className="text-sm text-warm-900/55 leading-relaxed flex gap-3">
                  <span className="text-peach-400 flex-shrink-0">•</span>
                  {flag}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
