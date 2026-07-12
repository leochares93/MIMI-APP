import { useState } from 'react'
import { useProfileStore } from '../../store/useProfileStore'
import { calculateBMI, getBMICategory, getRecommendedWeightGain } from '../../utils/bmi'
import { calculateDueDate, formatDueDate } from '../../utils/weekCalculator'
import type { Allergen, HealthCondition, ActivityLevel } from '../../types'

const ALLERGEN_OPTIONS: { value: Allergen; label: string }[] = [
  { value: 'none', label: '无过敏' },
  { value: 'milk', label: '牛奶' },
  { value: 'eggs', label: '鸡蛋' },
  { value: 'peanuts', label: '花生' },
  { value: 'tree_nuts', label: '坚果' },
  { value: 'soy', label: '大豆' },
  { value: 'wheat', label: '小麦' },
  { value: 'fish', label: '鱼类' },
  { value: 'shellfish', label: '虾蟹贝类' },
  { value: 'sesame', label: '芝麻' },
]

const HEALTH_CONDITIONS: { value: HealthCondition; label: string }[] = [
  { value: 'none', label: '无特殊状况' },
  { value: 'gestational_diabetes', label: '妊娠糖尿病' },
  { value: 'gestational_hypertension', label: '妊娠高血压' },
  { value: 'anemia', label: '贫血' },
  { value: 'thyroid_disorder', label: '甲状腺异常' },
]

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: 'sedentary', label: '久坐少动', desc: '很少运动' },
  { value: 'moderate', label: '适度运动', desc: '每周运动2-3次' },
  { value: 'active', label: '经常运动', desc: '每周运动4次以上' },
]

export default function ProfilePage() {
  const { profile, updateProfile, updateAllergies, updateHealthConditions, updateActivityLevel, resetProfile } = useProfileStore()

  const [form, setForm] = useState({ ...profile })

  const bmi = calculateBMI(profile.prePregnancyWeight, profile.height)
  const bmiCategory = getBMICategory(bmi)
  const weightGain = getRecommendedWeightGain(bmi, profile.isMultiplePregnancy)

  const handleSave = () => {
    if (form.lastPeriodDate && !form.dueDate) {
      form.dueDate = calculateDueDate(form.lastPeriodDate)
    }
    updateProfile(form)
    alert('✅ 档案已保存！')
  }

  const handleAllergyToggle = (allergen: Allergen) => {
    if (allergen === 'none') {
      updateAllergies(['none'])
      return
    }
    const current = profile.allergies.filter(a => a !== 'none')
    const newAllergies = current.includes(allergen)
      ? current.filter(a => a !== allergen)
      : [...current, allergen]
    updateAllergies(newAllergies.length === 0 ? ['none'] : newAllergies)
  }

  const handleHealthToggle = (condition: HealthCondition) => {
    if (condition === 'none') {
      updateHealthConditions(['none'])
      return
    }
    const current = profile.healthConditions.filter(c => c !== 'none')
    const newConditions = current.includes(condition)
      ? current.filter(c => c !== condition)
      : [...current, condition]
    updateHealthConditions(newConditions.length === 0 ? ['none'] : newConditions)
  }

  return (
    <div className="p-4 pb-20 space-y-4">
      {/* BMI 信息卡片 */}
      <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl p-5 text-white shadow-lg">
        <h2 className="text-lg font-semibold mb-3">📊 健康概览</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{bmi}</p>
            <p className="text-xs text-primary-100">孕前BMI</p>
            <p className="text-xs text-primary-200">{bmiCategory}</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{profile.currentWeek}</p>
            <p className="text-xs text-primary-100">当前孕周</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{weightGain.total}</p>
            <p className="text-xs text-primary-100">建议增重</p>
          </div>
        </div>
        {profile.dueDate && (
          <div className="mt-3 pt-3 border-t border-primary-300/50 text-center text-sm text-primary-100">
            预产期：{formatDueDate(profile.dueDate)}
          </div>
        )}
      </div>

      {/* 基本信息 */}
      <Section title="👤 基本信息">
        <FormField label="姓名">
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="请输入姓名"
            className="form-input"
          />
        </FormField>
        <FormField label="年龄">
          <input
            type="number"
            value={form.age}
            onChange={e => setForm({ ...form, age: parseInt(e.target.value) || 0 })}
            min={18} max={55}
            className="form-input"
          />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="身高 (cm)">
            <input
              type="number"
              value={form.height}
              onChange={e => setForm({ ...form, height: parseFloat(e.target.value) || 0 })}
              min={140} max={200} step={0.1}
              className="form-input"
            />
          </FormField>
          <FormField label="孕前体重 (kg)">
            <input
              type="number"
              value={form.prePregnancyWeight}
              onChange={e => setForm({ ...form, prePregnancyWeight: parseFloat(e.target.value) || 0 })}
              min={35} max={150} step={0.1}
              className="form-input"
            />
          </FormField>
        </div>
        <FormField label="当前体重 (kg)">
          <input
            type="number"
            value={form.currentWeight}
            onChange={e => setForm({ ...form, currentWeight: parseFloat(e.target.value) || 0 })}
            min={35} max={150} step={0.1}
            className="form-input"
          />
        </FormField>
      </Section>

      {/* 孕期信息 */}
      <Section title="📅 孕期信息">
        <FormField label="末次月经日期">
          <input
            type="date"
            value={form.lastPeriodDate}
            onChange={e => {
              const lmp = e.target.value
              const due = calculateDueDate(lmp)
              setForm({ ...form, lastPeriodDate: lmp, dueDate: due })
            }}
            className="form-input"
          />
        </FormField>
        <FormField label="当前孕周">
          <input
            type="range"
            value={form.currentWeek}
            onChange={e => setForm({ ...form, currentWeek: parseInt(e.target.value) })}
            min={1} max={40}
            className="w-full accent-primary-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>第1周</span>
            <span className="text-primary-500 font-semibold text-lg">{form.currentWeek}周</span>
            <span>第40周</span>
          </div>
        </FormField>
        <div className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            checked={form.isMultiplePregnancy}
            onChange={e => setForm({ ...form, isMultiplePregnancy: e.target.checked })}
            id="multiple"
            className="w-4 h-4 accent-primary-500"
          />
          <label htmlFor="multiple" className="text-sm text-gray-700">多胎妊娠（双胞胎等）</label>
        </div>
      </Section>

      {/* 过敏源 */}
      <Section title="🚫 过敏源">
        <div className="flex flex-wrap gap-2">
          {ALLERGEN_OPTIONS.map(a => (
            <button
              key={a.value}
              onClick={() => handleAllergyToggle(a.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                profile.allergies.includes(a.value)
                  ? 'bg-red-100 text-red-600 border border-red-300'
                  : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </Section>

      {/* 健康状况 */}
      <Section title="🏥 健康状况">
        <div className="flex flex-wrap gap-2">
          {HEALTH_CONDITIONS.map(c => (
            <button
              key={c.value}
              onClick={() => handleHealthToggle(c.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                profile.healthConditions.includes(c.value)
                  ? 'bg-warm-100 text-warm-600 border border-warm-300'
                  : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </Section>

      {/* 活动水平 */}
      <Section title="🏃 孕前活动水平">
        <div className="space-y-2">
          {ACTIVITY_LEVELS.map(l => (
            <button
              key={l.value}
              onClick={() => updateActivityLevel(l.value)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                profile.activityLevel === l.value
                  ? 'bg-primary-50 border-2 border-primary-400 text-primary-700'
                  : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="font-medium">{l.label}</span>
              <span className="text-gray-400 ml-2">{l.desc}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* 素食 */}
      <Section title="🥬 饮食偏好">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isVegetarian}
            onChange={e => setForm({ ...form, isVegetarian: e.target.checked })}
            id="vegetarian"
            className="w-4 h-4 accent-primary-500"
          />
          <label htmlFor="vegetarian" className="text-sm text-gray-700">素食者</label>
        </div>
      </Section>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-md"
        >
          💾 保存档案
        </button>
        <button
          onClick={() => {
            if (confirm('确定要重置所有信息吗？此操作不可恢复！')) {
              resetProfile()
              setForm({ ...profile })
            }
          }}
          className="px-4 py-3 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors text-sm"
        >
          重置
        </button>
      </div>

      {/* 免责声明 */}
      <p className="text-xs text-gray-400 text-center pb-4">
        ⚠️ 本应用仅供知识参考，不能替代医生诊断。<br />
        如有任何健康问题，请及时就医。
      </p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      {children}
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  )
}
