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
    alert('档案已保存')
  }

  const handleAllergyToggle = (allergen: Allergen) => {
    if (allergen === 'none') { updateAllergies(['none']); return }
    const current = profile.allergies.filter(a => a !== 'none')
    const newAllergies = current.includes(allergen)
      ? current.filter(a => a !== allergen)
      : [...current, allergen]
    updateAllergies(newAllergies.length === 0 ? ['none'] : newAllergies)
  }

  const handleHealthToggle = (condition: HealthCondition) => {
    if (condition === 'none') { updateHealthConditions(['none']); return }
    const current = profile.healthConditions.filter(c => c !== 'none')
    const newConditions = current.includes(condition)
      ? current.filter(c => c !== condition)
      : [...current, condition]
    updateHealthConditions(newConditions.length === 0 ? ['none'] : newConditions)
  }

  return (
    <div className="p-5 pb-24 space-y-6">
      {/* 健康概览 */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-cream-300/60">
        <h2 className="text-base font-medium text-sage-800 tracking-wide mb-5">健康概览</h2>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-light text-sage-800">{bmi}</p>
            <p className="text-xs text-sage-400 mt-1 tracking-wide">孕前 BMI</p>
            <p className="text-xs text-sage-500 mt-1">{bmiCategory}</p>
          </div>
          <div>
            <p className="text-3xl font-light text-sage-800">{profile.currentWeek}</p>
            <p className="text-xs text-sage-400 mt-1 tracking-wide">当前孕周</p>
          </div>
          <div>
            <p className="text-3xl font-light text-sage-800">{weightGain.total}</p>
            <p className="text-xs text-sage-400 mt-1 tracking-wide">建议增重</p>
          </div>
        </div>
        {profile.dueDate && (
          <div className="mt-5 pt-5 border-t border-cream-200/60 text-center">
            <p className="text-sm text-sage-500">
              预产期 <span className="font-medium text-sage-700">{formatDueDate(profile.dueDate)}</span>
            </p>
          </div>
        )}
      </div>

      {/* 基本信息 */}
      <Section title="基本信息">
        <FormField label="姓名">
          <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="请输入姓名" className="form-input" />
        </FormField>
        <FormField label="年龄">
          <input type="number" value={form.age} onChange={e => setForm({ ...form, age: parseInt(e.target.value) || 0 })} min={18} max={55} className="form-input" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="身高 (cm)">
            <input type="number" value={form.height} onChange={e => setForm({ ...form, height: parseFloat(e.target.value) || 0 })} min={140} max={200} step={0.1} className="form-input" />
          </FormField>
          <FormField label="孕前体重 (kg)">
            <input type="number" value={form.prePregnancyWeight} onChange={e => setForm({ ...form, prePregnancyWeight: parseFloat(e.target.value) || 0 })} min={35} max={150} step={0.1} className="form-input" />
          </FormField>
        </div>
        <FormField label="当前体重 (kg)">
          <input type="number" value={form.currentWeight} onChange={e => setForm({ ...form, currentWeight: parseFloat(e.target.value) || 0 })} min={35} max={150} step={0.1} className="form-input" />
        </FormField>
      </Section>

      {/* 孕期信息 */}
      <Section title="孕期信息">
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
          <div className="space-y-2">
            <input
              type="range"
              value={form.currentWeek}
              onChange={e => setForm({ ...form, currentWeek: parseInt(e.target.value) })}
              min={1} max={40}
              className="w-full accent-sage-500 h-1.5"
            />
            <div className="flex justify-between text-xs text-sage-400">
              <span>1周</span>
              <span className="text-sage-700 font-medium text-base">{form.currentWeek}周</span>
              <span>40周</span>
            </div>
          </div>
        </FormField>
        <div className="flex items-center gap-3 mt-4">
          <input type="checkbox" checked={form.isMultiplePregnancy} onChange={e => setForm({ ...form, isMultiplePregnancy: e.target.checked })} id="multiple" className="w-4 h-4 accent-sage-500 rounded" />
          <label htmlFor="multiple" className="text-sm text-sage-700">多胎妊娠（双胞胎等）</label>
        </div>
      </Section>

      {/* 过敏源 */}
      <Section title="过敏源">
        <div className="flex flex-wrap gap-2">
          {ALLERGEN_OPTIONS.map(a => (
            <button
              key={a.value}
              onClick={() => handleAllergyToggle(a.value)}
              className={`px-3.5 py-2 rounded-xl text-xs transition-all duration-200 ${
                profile.allergies.includes(a.value)
                  ? 'bg-red-50 text-red-600 border border-red-200 font-medium'
                  : 'bg-cream-200/50 text-sage-500 border border-cream-300/40 hover:border-sage-200'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </Section>

      {/* 健康状况 */}
      <Section title="健康状况">
        <div className="flex flex-wrap gap-2">
          {HEALTH_CONDITIONS.map(c => (
            <button
              key={c.value}
              onClick={() => handleHealthToggle(c.value)}
              className={`px-3.5 py-2 rounded-xl text-xs transition-all duration-200 ${
                profile.healthConditions.includes(c.value)
                  ? 'bg-terra-50 text-terra-700 border border-terra-200 font-medium'
                  : 'bg-cream-200/50 text-sage-500 border border-cream-300/40 hover:border-sage-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </Section>

      {/* 活动水平 */}
      <Section title="孕前活动水平">
        <div className="space-y-2.5">
          {ACTIVITY_LEVELS.map(l => (
            <button
              key={l.value}
              onClick={() => updateActivityLevel(l.value)}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-sm transition-all duration-200 ${
                profile.activityLevel === l.value
                  ? 'bg-sage-50 border-2 border-sage-400 text-sage-700 font-medium'
                  : 'bg-cream-200/50 border-2 border-transparent text-sage-500 hover:bg-cream-200'
              }`}
            >
              <span className="font-medium">{l.label}</span>
              <span className="text-sage-400 ml-2">{l.desc}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* 饮食偏好 */}
      <Section title="饮食偏好">
        <div className="flex items-center gap-3">
          <input type="checkbox" checked={form.isVegetarian} onChange={e => setForm({ ...form, isVegetarian: e.target.checked })} id="vegetarian" className="w-4 h-4 accent-sage-500 rounded" />
          <label htmlFor="vegetarian" className="text-sm text-sage-700">素食者</label>
        </div>
      </Section>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 py-3.5 bg-sage-500 text-white rounded-2xl font-medium text-sm hover:bg-sage-600 transition-colors shadow-sm tracking-wide"
        >
          保存档案
        </button>
        <button
          onClick={() => { if (confirm('确定要重置所有信息吗？')) { resetProfile(); setForm({ ...profile }) } }}
          className="px-5 py-3.5 bg-cream-200/50 text-sage-500 rounded-2xl hover:bg-cream-200 transition-colors text-sm"
        >
          重置
        </button>
      </div>

      <p className="text-xs text-sage-400 text-center pb-4 leading-relaxed">
        本应用仅供知识参考，不能替代医生诊断<br />如有任何健康问题，请及时就医
      </p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-cream-300/60">
      <h3 className="text-sm font-medium text-sage-800 mb-5 tracking-wide">{title}</h3>
      {children}
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs text-sage-400 mb-2 tracking-wide">{label}</label>
      {children}
    </div>
  )
}
