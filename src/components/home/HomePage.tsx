import { useNavigate } from 'react-router-dom'
import { useProfileStore } from '../../store/useProfileStore'
import { getRecommendations } from '../../engine/recommender'
import { calculateBMI, getBMICategory, getRecommendedWeightGain } from '../../utils/bmi'
import { daysUntilDue } from '../../utils/weekCalculator'
import weeks from '../../data/weeks'

export default function HomePage() {
  const navigate = useNavigate()
  const profile = useProfileStore(s => s.profile)
  const bmi = calculateBMI(profile.prePregnancyWeight, profile.height)
  const bmiCategory = getBMICategory(bmi)
  const weightGain = getRecommendedWeightGain(bmi, profile.isMultiplePregnancy)
  const weekData = weeks.find(w => w.week === profile.currentWeek)
  const recommendations = getRecommendations(profile)
  const remainingDays = profile.dueDate ? daysUntilDue(profile.dueDate) : 280 - profile.currentWeek * 7

  return (
    <div className="p-5 space-y-6 pb-24">
      {/* 孕期进度卡片 */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-cream-300/60">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sage-500 text-xs tracking-widest uppercase mb-1">当前孕周</p>
            <p className="text-4xl font-light text-sage-800 tracking-tight">
              {profile.currentWeek}
              <span className="text-lg font-normal text-sage-500 ml-1">周</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sage-500 text-xs tracking-widest uppercase mb-1">预产期</p>
            <p className="text-base font-medium text-sage-700">
              {profile.dueDate ? profile.dueDate : '待设置'}
            </p>
          </div>
        </div>

        {/* 进度条 */}
        <div className="relative mb-2">
          <div className="bg-cream-300/50 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-sage-400 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min((profile.currentWeek / 40) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-sage-400">
            <span>1周</span>
            <span>20周</span>
            <span>40周</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-cream-200/60">
          <span className="text-sm text-sage-500">距预产期约 <strong className="text-sage-700">{remainingDays}</strong> 天</span>
          <span className="text-sm text-sage-400">{Math.round((profile.currentWeek / 40) * 100)}%</span>
        </div>
      </div>

      {/* 宝宝发育卡片 */}
      {weekData && (
        <div
          className="bg-white rounded-3xl p-6 shadow-sm border border-cream-300/60 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(`/knowledge/week/${profile.currentWeek}`)}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cream-200/80 flex items-center justify-center text-3xl">
              👶
            </div>
            <div className="flex-1">
              <p className="text-xs text-sage-500 tracking-widest uppercase mb-1">宝宝发育</p>
              <h3 className="font-medium text-sage-800 text-lg leading-tight">{weekData.title}</h3>
              <p className="text-sage-500 text-sm mt-0.5">
                约 <span className="text-sage-700 font-medium">{weekData.fetalSize}</span> · {weekData.fetalLength}
              </p>
            </div>
            <span className="text-sage-300 text-xl">›</span>
          </div>
          {weekData.dailyTip && (
            <div className="mt-4 bg-cream-200/50 rounded-2xl px-4 py-3 text-sm text-sage-700 leading-relaxed">
              {weekData.dailyTip}
            </div>
          )}
        </div>
      )}

      {/* 体重和BMI */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-300/60 text-center">
          <p className="text-xs text-sage-400 tracking-widest uppercase">孕前 BMI</p>
          <p className="text-2xl font-light text-sage-800 mt-2">{bmi}</p>
          <p className="text-xs text-sage-500 mt-1">{bmiCategory}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-300/60 text-center">
          <p className="text-xs text-sage-400 tracking-widest uppercase">当前体重</p>
          <p className="text-2xl font-light text-sage-800 mt-2">{profile.currentWeight}</p>
          <p className="text-xs text-sage-400 mt-1">kg</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-300/60 text-center">
          <p className="text-xs text-sage-400 tracking-widest uppercase">建议增重</p>
          <p className="text-2xl font-light text-sage-800 mt-2">{weightGain.total}</p>
        </div>
      </div>

      {/* 今日推荐食谱 */}
      {recommendations.dailyRecipes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-sage-800 tracking-wide">今日推荐食谱</h3>
            <button
              onClick={() => navigate('/knowledge')}
              className="text-xs text-sage-500 hover:text-sage-600 transition-colors"
            >
              查看更多 ›
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {recommendations.dailyRecipes.slice(0, 5).map(recipe => (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-cream-300/60 min-w-[200px] flex-shrink-0"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">
                    {recipe.category === 'soup' ? '🍲' : recipe.category === 'main' ? '🍽️' : recipe.category === 'breakfast' ? '🥣' : recipe.category === 'snack' ? '🍰' : '🥤'}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    recipe.difficulty === 'easy' ? 'bg-sage-100 text-sage-600' :
                    recipe.difficulty === 'medium' ? 'bg-terra-100 text-terra-600' :
                    'bg-cream-300 text-sage-700'
                  }`}>
                    {recipe.difficulty === 'easy' ? '简单' : recipe.difficulty === 'medium' ? '中等' : '较难'}
                  </span>
                </div>
                <h4 className="font-medium text-sage-800 text-sm mb-2">{recipe.name}</h4>
                <p className="text-xs text-sage-500 mb-3 leading-relaxed">{recipe.benefits.slice(0, 35)}...</p>
                <div className="flex flex-wrap gap-1.5">
                  {recipe.keyNutrients.slice(0, 3).map(n => (
                    <span key={n} className="text-xs bg-cream-200/70 text-sage-600 px-2 py-1 rounded-lg">{n}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 今日推荐运动 */}
      {recommendations.dailyExercises.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-sage-800 tracking-wide">今日推荐运动</h3>
            <button
              onClick={() => navigate('/knowledge')}
              className="text-xs text-sage-500 hover:text-sage-600 transition-colors"
            >
              查看更多 ›
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {recommendations.dailyExercises.slice(0, 3).map(exercise => (
              <div
                key={exercise.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-cream-300/60 min-w-[220px] flex-shrink-0"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">
                    {exercise.category === 'yoga' ? '🧘' : exercise.category === 'walking' ? '🚶' : exercise.category === 'pelvic' ? '🦵' : exercise.category === 'breathing' ? '🌬️' : '🤸'}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-sage-100 text-sage-600">
                    {exercise.duration}分钟
                  </span>
                </div>
                <h4 className="font-medium text-sage-800 text-sm mb-2">{exercise.name}</h4>
                <p className="text-xs text-sage-500">{exercise.frequency}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 贴心提醒 */}
      {recommendations.warningFlags.length > 0 && (
        <div className="bg-terra-50/70 rounded-3xl p-6 border border-terra-200/40">
          <h3 className="text-sm font-medium text-terra-700 mb-3 tracking-wide">贴心提醒</h3>
          <ul className="space-y-2.5">
            {recommendations.warningFlags.map((flag, i) => (
              <li key={i} className="text-sm text-terra-700 flex gap-3 leading-relaxed">
                <span className="text-terra-400 flex-shrink-0 mt-0.5">•</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
