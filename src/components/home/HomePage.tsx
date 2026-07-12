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
    <div className="p-4 space-y-4 pb-20">
      {/* 孕期进度卡片 */}
      <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-primary-100 text-sm">当前孕周</p>
            <p className="text-3xl font-bold">{profile.currentWeek} <span className="text-lg font-normal">周</span></p>
          </div>
          <div className="text-right">
            <p className="text-primary-100 text-sm">预产期</p>
            <p className="text-lg font-semibold">
              {profile.dueDate ? profile.dueDate : '请先设置'}
            </p>
          </div>
        </div>
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min((profile.currentWeek / 40) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-primary-100">
          <span>第1周</span>
          <span>第20周</span>
          <span>第40周</span>
        </div>
        <div className="mt-3 flex justify-between text-sm">
          <span>距预产期约 {remainingDays} 天</span>
          <span>{Math.round((profile.currentWeek / 40) * 100)}%</span>
        </div>
      </div>

      {/* 宝宝发育卡片 */}
      {weekData && (
        <div
          className="bg-white rounded-2xl p-4 shadow-sm border border-primary-100 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(`/knowledge/week/${profile.currentWeek}`)}
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">👶</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg">{weekData.title}</h3>
              <p className="text-gray-500 text-sm">
                宝宝现在 <span className="text-primary-500 font-semibold">{weekData.fetalSize}</span>，身长约 {weekData.fetalLength}
              </p>
            </div>
            <span className="text-gray-300">›</span>
          </div>
          {weekData.dailyTip && (
            <div className="mt-3 bg-warm-50 rounded-xl p-3 text-sm text-gray-700">
              💡 {weekData.dailyTip}
            </div>
          )}
        </div>
      )}

      {/* 体重和BMI信息 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-primary-100 text-center">
          <p className="text-xs text-gray-400">孕前BMI</p>
          <p className="text-xl font-bold text-gray-800">{bmi}</p>
          <p className="text-xs text-primary-500">{bmiCategory}</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-primary-100 text-center">
          <p className="text-xs text-gray-400">当前体重</p>
          <p className="text-xl font-bold text-gray-800">{profile.currentWeight}</p>
          <p className="text-xs text-gray-400">kg</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-primary-100 text-center">
          <p className="text-xs text-gray-400">建议增重</p>
          <p className="text-xl font-bold text-gray-800">{weightGain.total}</p>
        </div>
      </div>

      {/* 今日推荐食谱 */}
      {recommendations.dailyRecipes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">🍳 今日推荐食谱</h3>
            <button
              onClick={() => navigate('/knowledge')}
              className="text-xs text-primary-500"
            >
              查看更多 ›
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {recommendations.dailyRecipes.slice(0, 5).map(recipe => (
              <div
                key={recipe.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-primary-100 min-w-[180px] flex-shrink-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {recipe.category === 'soup' ? '🍲' : recipe.category === 'main' ? '🍽️' : recipe.category === 'breakfast' ? '🥣' : recipe.category === 'snack' ? '🍰' : '🥤'}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-600 rounded-full">
                    {recipe.difficulty === 'easy' ? '简单' : recipe.difficulty === 'medium' ? '中等' : '较难'}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">{recipe.name}</h4>
                <p className="text-xs text-gray-400 mb-2">{recipe.benefits.slice(0, 30)}...</p>
                <div className="flex flex-wrap gap-1">
                  {recipe.keyNutrients.slice(0, 3).map(n => (
                    <span key={n} className="text-xs bg-calm-50 text-calm-600 px-1.5 py-0.5 rounded-md">{n}</span>
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">🧘 今日推荐运动</h3>
            <button
              onClick={() => navigate('/knowledge')}
              className="text-xs text-primary-500"
            >
              查看更多 ›
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {recommendations.dailyExercises.slice(0, 3).map(exercise => (
              <div
                key={exercise.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-primary-100 min-w-[200px] flex-shrink-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {exercise.category === 'yoga' ? '🧘' : exercise.category === 'walking' ? '🚶' : exercise.category === 'pelvic' ? '🦵' : exercise.category === 'breathing' ? '🌬️' : '🤸'}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-calm-100 text-calm-600 rounded-full">
                    {exercise.duration}分钟
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">{exercise.name}</h4>
                <p className="text-xs text-gray-400">{exercise.frequency}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 注意事项 */}
      {recommendations.warningFlags.length > 0 && (
        <div className="bg-warm-50 border border-warm-200 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">⚠️ 贴心提醒</h3>
          <ul className="space-y-1.5">
            {recommendations.warningFlags.map((flag, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-warm-500">⚠️</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
