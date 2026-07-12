import { useNavigate } from 'react-router-dom'
import { useProfileStore } from '../../store/useProfileStore'
import weeks from '../../data/weeks'
import { categories } from '../../data/categories'

export default function KnowledgePage() {
  const navigate = useNavigate()
  const profile = useProfileStore(s => s.profile)

  // 按孕期筛选相关周
  const trimester1Weeks = weeks.filter(w => w.trimester === 1)
  const trimester2Weeks = weeks.filter(w => w.trimester === 2)
  const trimester3Weeks = weeks.filter(w => w.trimester === 3)

  const handleWeekClick = (week: number) => {
    navigate(`/knowledge/week/${week}`)
  }

  const handleCategoryClick = (catId: string) => {
    // 对于不同分类采用不同的处理
    switch (catId) {
      case 'weeks':
        break // 已经在孕周视图中
      case 'diet':
        navigate('/chat')
        break
      default:
        navigate('/chat')
    }
  }

  return (
    <div className="p-4 pb-20">
      {/* 孕周选择器 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">📅 孕期周历</h2>

        {/* 第一孕期 */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-primary-600 mb-2">第一孕期 (1-12周)</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {trimester1Weeks.map(w => (
              <button
                key={w.week}
                onClick={() => handleWeekClick(w.week)}
                className={`flex-shrink-0 min-w-[44px] h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  w.week === profile.currentWeek
                    ? 'bg-primary-500 text-white shadow-md scale-110'
                    : 'bg-white text-gray-600 border border-primary-200 hover:border-primary-400 hover:bg-primary-50'
                }`}
              >
                {w.week}
              </button>
            ))}
          </div>
        </div>

        {/* 第二孕期 */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-calm-600 mb-2">第二孕期 (13-27周)</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {trimester2Weeks.map(w => (
              <button
                key={w.week}
                onClick={() => handleWeekClick(w.week)}
                className={`flex-shrink-0 min-w-[44px] h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  w.week === profile.currentWeek
                    ? 'bg-calm-500 text-white shadow-md scale-110'
                    : 'bg-white text-gray-600 border border-calm-200 hover:border-calm-400 hover:bg-calm-50'
                }`}
              >
                {w.week}
              </button>
            ))}
          </div>
        </div>

        {/* 第三孕期 */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-warm-600 mb-2">第三孕期 (28-40周)</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {trimester3Weeks.map(w => (
              <button
                key={w.week}
                onClick={() => handleWeekClick(w.week)}
                className={`flex-shrink-0 min-w-[44px] h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  w.week === profile.currentWeek
                    ? 'bg-warm-500 text-white shadow-md scale-110'
                    : 'bg-white text-gray-600 border border-warm-200 hover:border-warm-400 hover:bg-warm-50'
                }`}
              >
                {w.week}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 分类卡片 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">📖 知识分类</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-primary-100 hover:shadow-md hover:border-primary-300 transition-all text-left"
            >
              <span className="text-3xl mb-2 block">{cat.icon}</span>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">{cat.name}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{cat.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">🔗 快速访问</h2>
        <div className="space-y-2">
          <button
            onClick={() => navigate(`/knowledge/week/${profile.currentWeek}`)}
            className="w-full bg-white rounded-xl p-4 shadow-sm border border-primary-100 hover:shadow-md transition-all flex items-center gap-3"
          >
            <span className="text-2xl">📋</span>
            <div className="text-left">
              <p className="font-medium text-gray-800">本周指南</p>
              <p className="text-xs text-gray-400">查看第{profile.currentWeek}周的详细指导</p>
            </div>
            <span className="ml-auto text-gray-300">›</span>
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="w-full bg-white rounded-xl p-4 shadow-sm border border-primary-100 hover:shadow-md transition-all flex items-center gap-3"
          >
            <span className="text-2xl">🤖</span>
            <div className="text-left">
              <p className="font-medium text-gray-800">智能问答</p>
              <p className="text-xs text-gray-400">向孕期助手提问，获取即时解答</p>
            </div>
            <span className="ml-auto text-gray-300">›</span>
          </button>
        </div>
      </div>
    </div>
  )
}
