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
  const bmiCategory = getBMICategory(bmi)
  const weekData = weeks.find(w => w.week === profile.currentWeek)
  const recommendations = getRecommendations(profile)
  const remainingDays = profile.dueDate ? daysUntilDue(profile.dueDate) : 280 - profile.currentWeek * 7
  const progressPct = Math.round((profile.currentWeek / 40) * 100)

  return (
    <div className="pb-24">
      {/* ════ Hero 渐变大卡片 ════ */}
      <div className="mx-4 mt-4 bg-gradient-to-br from-sage-400 via-sage-500 to-sage-600 rounded-[2rem] p-8 text-white shadow-lg shadow-sage-400/20">
        <p className="text-white/60 text-xs tracking-[0.2em] uppercase mb-6">当前孕周</p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-7xl font-light tracking-[-0.03em]">{profile.currentWeek}</span>
          <span className="text-2xl font-light text-white/40">/ 40</span>
        </div>
        <p className="text-white/60 text-sm mb-8">
          {profile.dueDate ? `预产期 ${profile.dueDate} · 约 ${remainingDays} 天` : '设置末次月经以计算预产期'}
        </p>

        {/* 进度条 */}
        <div className="bg-white/15 rounded-full h-2 overflow-hidden mb-3">
          <div
            className="bg-white/80 h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-white/50 text-xs">{progressPct}% · 距预产期约 {remainingDays} 天</p>
      </div>

      {/* ════ 宝宝发育 ════ */}
      {weekData && (
        <div
          onClick={() => navigate(`/knowledge/week/${profile.currentWeek}`)}
          className="mx-4 mt-4 bg-white rounded-[1.5rem] p-5 shadow-sm border border-sage-100/60 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-terra-100 to-terra-200 flex items-center justify-center text-2xl flex-shrink-0">
              👶
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-sage-400 tracking-wide uppercase mb-1">宝宝本周发育</p>
              <h3 className="font-semibold text-sage-800">{weekData.title}</h3>
              <p className="text-sm text-sage-500 mt-0.5 truncate">约 {weekData.fetalSize} · 身长 {weekData.fetalLength}</p>
            </div>
            <span className="text-sage-300 text-lg">›</span>
          </div>
          {weekData.dailyTip && (
            <div className="mt-4 bg-cream-100 rounded-xl px-4 py-3">
              <p className="text-sm text-sage-700 leading-relaxed">{weekData.dailyTip}</p>
            </div>
          )}
        </div>
      )}

      {/* ════ 三指标卡片 ════ */}
      <div className="grid grid-cols-3 gap-3 mx-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-100/60 text-center">
          <p className="text-2xl font-semibold text-sage-700">{bmi}</p>
          <p className="text-[11px] text-sage-400 mt-1 tracking-wide">孕前 BMI</p>
          <p className="text-[11px] text-sage-500 mt-0.5">{bmiCategory}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-100/60 text-center">
          <p className="text-2xl font-semibold text-sage-700">{profile.currentWeight}</p>
          <p className="text-[11px] text-sage-400 mt-1 tracking-wide">当前体重</p>
          <p className="text-[11px] text-sage-300 mt-0.5">kg</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-100/60 text-center">
          <p className="text-2xl font-semibold text-terra-600">{remainingDays}</p>
          <p className="text-[11px] text-sage-400 mt-1 tracking-wide">距预产期</p>
          <p className="text-[11px] text-sage-300 mt-0.5">天</p>
        </div>
      </div>

      {/* ════ 推荐食谱 ════ */}
      {recommendations.dailyRecipes.length > 0 && (
        <div className="mx-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-sage-800">今日推荐食谱</h3>
              <p className="text-xs text-sage-400 mt-0.5">基于你的孕期精选</p>
            </div>
            <button onClick={() => navigate('/knowledge')} className="text-sm text-sage-500 hover:text-sage-700 font-medium transition-colors">
              全部 ›
            </button>
          </div>
          <div className="space-y-3">
            {recommendations.dailyRecipes.slice(0, 5).map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-2xl p-4 shadow-sm border border-sage-100/60 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <span className="text-2xl flex-shrink-0">
                    {recipe.category === 'soup' ? '🍲' : recipe.category === 'main' ? '🍽️' : recipe.category === 'breakfast' ? '🥣' : recipe.category === 'snack' ? '🍰' : '🥤'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-semibold text-sage-800 text-sm">{recipe.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        recipe.difficulty === 'easy' ? 'bg-sage-100 text-sage-600' : 'bg-terra-100 text-terra-600'
                      }`}>
                        {recipe.difficulty === 'easy' ? '简单' : '中等'}
                      </span>
                    </div>
                    <p className="text-xs text-sage-500 leading-relaxed line-clamp-2">{recipe.benefits}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-3 ml-11">
                  {recipe.keyNutrients.slice(0, 4).map(n => (
                    <span key={n} className="text-[10px] bg-cream-100 text-sage-600 px-2 py-1 rounded-lg font-medium">{n}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════ 推荐运动 ════ */}
      {recommendations.dailyExercises.length > 0 && (
        <div className="mx-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-sage-800">今日推荐运动</h3>
              <p className="text-xs text-sage-400 mt-0.5">安全有效的孕期运动</p>
            </div>
          </div>
          <div className="space-y-3">
            {recommendations.dailyExercises.slice(0, 3).map(exercise => (
              <div key={exercise.id} className="bg-white rounded-2xl p-4 shadow-sm border border-sage-100/60 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center text-lg flex-shrink-0">
                    {exercise.category === 'yoga' ? '🧘' : exercise.category === 'walking' ? '🚶' : exercise.category === 'pelvic' ? '🦵' : exercise.category === 'breathing' ? '🌬️' : '🤸'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sage-800 text-sm">{exercise.name}</h4>
                    <p className="text-xs text-sage-500 mt-0.5">{exercise.frequency} · {exercise.duration}分钟</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-sage-100 text-sage-600 font-medium flex-shrink-0">
                    {exercise.duration}min
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════ 贴心提醒 ════ */}
      {recommendations.warningFlags.length > 0 && (
        <div className="mx-4 mt-6 bg-gradient-to-br from-terra-50 to-cream-100 rounded-[1.5rem] p-5 border border-terra-200/30">
          <h3 className="text-sm font-semibold text-terra-700 mb-3">贴心提醒</h3>
          <div className="space-y-2.5">
            {recommendations.warningFlags.map((flag, i) => (
              <p key={i} className="text-sm text-terra-700/80 leading-relaxed flex gap-2">
                <span className="text-terra-400 flex-shrink-0">•</span>
                {flag}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
