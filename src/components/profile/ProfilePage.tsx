import { useState } from 'react'
import { useProfileStore } from '../../store/useProfileStore'
import { calculateBMI, getBMICategory, getRecommendedWeightGain } from '../../utils/bmi'
import { calculateDueDate, formatDueDate } from '../../utils/weekCalculator'
import type { Allergen, HealthCondition, ActivityLevel } from '../../types'

const ALLERGENS: { value: Allergen; label: string }[] = [
  { value: 'none', label: '无' }, { value: 'milk', label: '牛奶' }, { value: 'eggs', label: '鸡蛋' },
  { value: 'peanuts', label: '花生' }, { value: 'tree_nuts', label: '坚果' }, { value: 'soy', label: '大豆' },
  { value: 'wheat', label: '小麦' }, { value: 'fish', label: '鱼类' }, { value: 'shellfish', label: '虾蟹贝类' }, { value: 'sesame', label: '芝麻' },
]

const CONDITIONS: { value: HealthCondition; label: string }[] = [
  { value: 'none', label: '无' }, { value: 'gestational_diabetes', label: '妊娠糖尿病' },
  { value: 'gestational_hypertension', label: '妊娠高血压' }, { value: 'anemia', label: '贫血' }, { value: 'thyroid_disorder', label: '甲状腺异常' },
]

const LEVELS: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: 'sedentary', label: '久坐少动', desc: '很少运动' },
  { value: 'moderate', label: '适度运动', desc: '每周 2-3 次' },
  { value: 'active', label: '经常运动', desc: '每周 4 次以上' },
]

export default function ProfilePage() {
  const { profile, updateProfile, updateAllergies, updateHealthConditions, updateActivityLevel, resetProfile } = useProfileStore()
  const [form, setForm] = useState({ ...profile })
  const bmi = calculateBMI(profile.prePregnancyWeight, profile.height)
  const weightGain = getRecommendedWeightGain(bmi, profile.isMultiplePregnancy)

  const handleSave = () => {
    if (form.lastPeriodDate && !form.dueDate) form.dueDate = calculateDueDate(form.lastPeriodDate)
    updateProfile(form)
    alert('已保存')
  }

  const toggleAllergy = (a: Allergen) => {
    if (a === 'none') return updateAllergies(['none'])
    const cur = profile.allergies.filter(x => x !== 'none')
    const next = cur.includes(a) ? cur.filter(x => x !== a) : [...cur, a]
    updateAllergies(next.length === 0 ? ['none'] : next)
  }

  const toggleCondition = (c: HealthCondition) => {
    if (c === 'none') return updateHealthConditions(['none'])
    const cur = profile.healthConditions.filter(x => x !== 'none')
    const next = cur.includes(c) ? cur.filter(x => x !== c) : [...cur, c]
    updateHealthConditions(next.length === 0 ? ['none'] : next)
  }

  return (
    <div className="pb-24">
      {/* ── 健康概览 ── */}
      <section className="px-6 pt-10 pb-8">
        <p className="text-xs tracking-[0.2em] uppercase text-black/30 mb-8">健康概览</p>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-4xl font-light tracking-tight text-black/80">{bmi}</p>
            <p className="text-xs text-black/30 mt-2 tracking-wide">孕前 BMI</p>
            <p className="text-xs text-black/40 mt-1">{getBMICategory(bmi)}</p>
          </div>
          <div>
            <p className="text-4xl font-light tracking-tight text-black/80">{profile.currentWeek}</p>
            <p className="text-xs text-black/30 mt-2 tracking-wide">孕周</p>
          </div>
          <div>
            <p className="text-4xl font-light tracking-tight text-black/80">{weightGain.total}</p>
            <p className="text-xs text-black/30 mt-2 tracking-wide">建议增重</p>
          </div>
        </div>
        {profile.dueDate && (
          <p className="text-sm text-black/40 mt-6 pt-6 border-t border-black/5">预产期 {formatDueDate(profile.dueDate)}</p>
        )}
      </section>

      <div className="h-px bg-black/5 mx-6" />

      {/* ── 基本信息 ── */}
      <Section title="基本信息">
        <Field label="姓名"><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-input" placeholder="你的名字" /></Field>
        <Field label="年龄"><input type="number" value={form.age} onChange={e => setForm({ ...form, age: +e.target.value || 0 })} min={18} max={55} className="form-input" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="身高 (cm)"><input type="number" value={form.height} onChange={e => setForm({ ...form, height: +e.target.value || 0 })} min={140} max={200} step={0.1} className="form-input" /></Field>
          <Field label="孕前体重 (kg)"><input type="number" value={form.prePregnancyWeight} onChange={e => setForm({ ...form, prePregnancyWeight: +e.target.value || 0 })} min={35} max={150} step={0.1} className="form-input" /></Field>
        </div>
        <Field label="当前体重 (kg)"><input type="number" value={form.currentWeight} onChange={e => setForm({ ...form, currentWeight: +e.target.value || 0 })} min={35} max={150} step={0.1} className="form-input" /></Field>
      </Section>

      <div className="h-px bg-black/5 mx-6" />

      {/* ── 孕期信息 ── */}
      <Section title="孕期信息">
        <Field label="末次月经">
          <input type="date" value={form.lastPeriodDate} onChange={e => { const lmp = e.target.value; setForm({ ...form, lastPeriodDate: lmp, dueDate: calculateDueDate(lmp) }) }} className="form-input" />
        </Field>
        <Field label={`当前孕周 · ${form.currentWeek} 周`}>
          <input type="range" value={form.currentWeek} onChange={e => setForm({ ...form, currentWeek: +e.target.value })} min={1} max={40} className="w-full accent-black/60 h-1" />
          <div className="flex justify-between text-[11px] text-black/25 mt-2"><span>1</span><span>20</span><span>40</span></div>
        </Field>
        <label className="flex items-center gap-3 mt-4 text-sm text-black/55">
          <input type="checkbox" checked={form.isMultiplePregnancy} onChange={e => setForm({ ...form, isMultiplePregnancy: e.target.checked })} className="w-4 h-4 accent-black/60 rounded" />
          多胎妊娠（双胞胎等）
        </label>
      </Section>

      <div className="h-px bg-black/5 mx-6" />

      {/* ── 过敏源 ── */}
      <Section title="过敏源">
        <Chips options={ALLERGENS} selected={profile.allergies} onToggle={toggleAllergy} />
      </Section>

      <div className="h-px bg-black/5 mx-6" />

      {/* ── 健康状况 ── */}
      <Section title="健康状况">
        <Chips options={CONDITIONS} selected={profile.healthConditions} onToggle={toggleCondition} />
      </Section>

      <div className="h-px bg-black/5 mx-6" />

      {/* ── 活动水平 ── */}
      <Section title="孕前活动水平">
        <div className="space-y-2">
          {LEVELS.map(l => (
            <button
              key={l.value}
              onClick={() => updateActivityLevel(l.value)}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-sm transition-colors ${
                profile.activityLevel === l.value ? 'bg-black/[0.04] text-black/70 font-medium' : 'text-black/40 hover:bg-black/[0.02]'
              }`}
            >
              {l.label} <span className="text-black/25 ml-2">{l.desc}</span>
            </button>
          ))}
        </div>
      </Section>

      <div className="h-px bg-black/5 mx-6" />

      {/* ── 饮食偏好 ── */}
      <Section title="饮食偏好">
        <label className="flex items-center gap-3 text-sm text-black/55">
          <input type="checkbox" checked={form.isVegetarian} onChange={e => setForm({ ...form, isVegetarian: e.target.checked })} className="w-4 h-4 accent-black/60 rounded" />
          素食者
        </label>
      </Section>

      {/* ── 操作 ── */}
      <div className="px-6 py-8 flex gap-3">
        <button onClick={handleSave} className="flex-1 py-3.5 bg-black/80 text-white rounded-2xl font-medium text-sm hover:bg-black transition-colors">保存档案</button>
        <button onClick={() => { if (confirm('重置所有信息？')) { resetProfile(); setForm({ ...profile }) } }} className="px-5 py-3.5 bg-black/[0.03] text-black/40 rounded-2xl text-sm hover:bg-black/[0.06] transition-colors">重置</button>
      </div>

      <p className="px-6 pb-8 text-xs text-black/25 text-center leading-relaxed">
        本应用仅供知识参考，不能替代医生诊断
      </p>
    </div>
  )
}

/* ── 子组件 ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-6 py-8">
      <h2 className="text-sm font-semibold text-black/65 tracking-wide mb-6">{title}</h2>
      {children}
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-[11px] tracking-[0.1em] uppercase text-black/30 mb-2">{label}</label>
      {children}
    </div>
  )
}

function Chips({ options, selected, onToggle }: { options: { value: string; label: string }[]; selected: string[]; onToggle: (v: any) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const isSel = selected.includes(o.value)
        return (
          <button
            key={o.value}
            onClick={() => onToggle(o.value)}
            className={`text-xs px-3.5 py-2 rounded-xl transition-colors ${
              isSel ? 'bg-black/[0.06] text-black/65 font-medium' : 'bg-black/[0.02] text-black/35 hover:bg-black/[0.04]'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
