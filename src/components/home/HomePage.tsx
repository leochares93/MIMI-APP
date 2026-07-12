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
      {/* ── Hero: 孕周进度 ── */}
      <section className="px-6 pt-10 pb-12">
        <p className="text-xs tracking-[0.2em] uppercase text-black/30 mb-4">当前孕周</p>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-7xl font-light tracking-[-0.03em] text-black/85">{profile.currentWeek}</span>
          <span className="text-2xl font-light text-black/30">/ 40 周</span>
        </div>
        <p className="text-sm text-black/40 mb-8">
          {profile.dueDate ? `预产期 ${profile.dueDate} · 约 ${remainingDays} 天` : '设置预产期以查看倒计时'}
        </p>

        {/* 进度条 */}
        <div className="h-[2px] bg-black/8 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-black/40 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-black/25">{progressPct}% 完成</p>
      </section>

      {/* ── 分隔 ── */}
      <div className="h-px bg-black/5 mx-6" />

      {/* ── 宝宝状态 ── */}
      {weekData && (
        <section
          className="px-6 py-10 cursor-pointer hover:bg-black/[0.02] transition-colors"
          onClick={() => navigate(`/knowledge/week/${profile.currentWeek}`)}
        >
          <p className="text-xs tracking-[0.2em] uppercase text-black/30 mb-6">宝宝发育</p>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-black/[0.03] flex items-center justify-center text-3xl flex-shrink-0">
              👶
            </div>
            <div>
              <h2 className="text-xl font-medium text-black/80 mb-1.5 tracking-tight">{weekData.title}</h2>
              <p className="text-sm text-black/40 leading-relaxed mb-1">约 {weekData.fetalSize} · 身长 {weekData.fetalLength}</p>
              <p className="text-sm text-black/40 leading-relaxed">{weekData.dailyTip}</p>
            </div>
          </div>
        </section>
      )}

      <div className="h-px bg-black/5 mx-6" />

      {/* ── BMI 三指标 ── */}
      <section className="px-6 py-10">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-xs text-black/30 mb-2 tracking-wide">孕前 BMI</p>
            <p className="text-3xl font-light text-black/70 tracking-tight">{bmi}</p>
            <p className="text-xs text-black/30 mt-1">{bmiCategory}</p>
          </div>
          <div>
            <p className="text-xs text-black/30 mb-2 tracking-wide">当前体重</p>
            <p className="text-3xl font-light text-black/70 tracking-tight">{profile.currentWeight}<span className="text-base text-black/30 ml-0.5">kg</span></p>
          </div>
          <div>
            <p className="text-xs text-black/30 mb-2 tracking-wide">距预产期</p>
            <p className="text-3xl font-light text-black/70 tracking-tight">{remainingDays}<span className="text-base text-black/30 ml-0.5">天</span></p>
          </div>
        </div>
      </section>

      <div className="h-px bg-black/5 mx-6" />

      {/* ── 推荐食谱 ── */}
      {recommendations.dailyRecipes.length > 0 && (
        <>
          <section className="px-6 py-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-black/30 mb-2">推荐食谱</p>
                <p className="text-sm text-black/40">基于你的孕期阶段精选</p>
              </div>
              <button onClick={() => navigate('/knowledge')} className="text-sm text-black/40 hover:text-black/70 transition-colors">
                查看全部 →
              </button>
            </div>

            <div className="space-y-6">
              {recommendations.dailyRecipes.slice(0, 5).map((recipe, i) => (
                <div key={recipe.id} className="group">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-xl flex-shrink-0">
                      {recipe.category === 'soup' ? '🍲' : recipe.category === 'main' ? '🍽️' : recipe.category === 'breakfast' ? '🥣' : recipe.category === 'snack' ? '🍰' : '🥤'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[15px] font-medium text-black/75 mb-0.5 group-hover:text-black/90 transition-colors">{recipe.name}</h4>
                      <p className="text-sm text-black/35 leading-relaxed truncate">{recipe.benefits}</p>
                    </div>
                    <span className={`text-[11px] px-2.5 py-1 rounded-full flex-shrink-0 font-medium ${
                      recipe.difficulty === 'easy' ? 'bg-black/[0.04] text-black/45' : 'bg-black/[0.06] text-black/50'
                    }`}>
                      {recipe.difficulty === 'easy' ? '简单' : recipe.difficulty === 'medium' ? '中等' : '较难'}
                    </span>
                  </div>
                  <div className="flex gap-1.5 ml-12">
                    {recipe.keyNutrients.slice(0, 4).map(n => (
                      <span key={n} className="text-[11px] text-black/30">{n}</span>
                    ))}
                    {recipe.keyNutrients.length > 4 && <span className="text-[11px] text-black/20">+</span>}
                  </div>
                  {i < recommendations.dailyRecipes.slice(0, 5).length - 1 && (
                    <div className="h-px bg-black/[0.03] mt-5" />
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-black/5 mx-6" />
        </>
      )}

      {/* ── 推荐运动 ── */}
      {recommendations.dailyExercises.length > 0 && (
        <>
          <section className="px-6 py-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-black/30 mb-2">推荐运动</p>
                <p className="text-sm text-black/40">安全有效的孕期运动</p>
              </div>
            </div>

            <div className="space-y-6">
              {recommendations.dailyExercises.slice(0, 3).map((exercise, i) => (
                <div key={exercise.id}>
                  <div className="flex items-center gap-4">
                    <span className="text-xl flex-shrink-0">
                      {exercise.category === 'yoga' ? '🧘' : exercise.category === 'walking' ? '🚶' : exercise.category === 'pelvic' ? '🦵' : exercise.category === 'breathing' ? '🌬️' : '🤸'}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-[15px] font-medium text-black/75 mb-0.5">{exercise.name}</h4>
                      <p className="text-sm text-black/35">{exercise.frequency}</p>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-black/[0.04] text-black/45 flex-shrink-0 font-medium">
                      {exercise.duration} 分钟
                    </span>
                  </div>
                  {i < recommendations.dailyExercises.slice(0, 3).length - 1 && (
                    <div className="h-px bg-black/[0.03] mt-5" />
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-black/5 mx-6" />
        </>
      )}

      {/* ── 贴心提醒 ── */}
      {recommendations.warningFlags.length > 0 && (
        <section className="px-6 py-10">
          <p className="text-xs tracking-[0.2em] uppercase text-black/30 mb-6">贴心提醒</p>
          <div className="space-y-3">
            {recommendations.warningFlags.map((flag, i) => (
              <p key={i} className="text-sm text-black/50 leading-relaxed flex gap-3">
                <span className="text-black/20 flex-shrink-0">—</span>
                {flag}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
