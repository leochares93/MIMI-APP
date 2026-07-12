import type { UserProfile, Recipe, Exercise, WeekData, RecommendationResult } from '../types'
import recipes from '../data/recipes'
import exercises from '../data/exercises'
import weeks from '../data/weeks'
import { calculateBMI } from '../utils/bmi'

/**
 * 获取当前孕周数据
 */
export function getCurrentWeekData(week: number): WeekData | undefined {
  return weeks.find(w => w.week === week)
}

/**
 * 主推荐函数
 */
export function getRecommendations(profile: UserProfile): RecommendationResult {
  const bmi = calculateBMI(profile.prePregnancyWeight, profile.height)
  const week = profile.currentWeek
  const weekData = getCurrentWeekData(week)

  // 过滤 + 评分 + 排序
  const filteredRecipes = filterRecipes(recipes, profile, week)
  const scoredRecipes = scoreRecipes(filteredRecipes, profile, week, bmi).sort((a, b) => b._score - a._score)

  const filteredExercises = filterExercises(exercises, profile, week)
  const scoredExercises = scoreExercises(filteredExercises, profile, week, bmi).sort((a, b) => b._score - a._score)

  // 生成提示
  const weeklyTips = generateWeeklyTips(profile, weekData, bmi)
  const warningFlags = generateWarningFlags(profile, bmi, week)

  return {
    dailyRecipes: scoredRecipes.slice(0, 5) as Recipe[],
    dailyExercises: scoredExercises.slice(0, 3) as Exercise[],
    weeklyTips,
    warningFlags,
  }
}

/**
 * 过滤食谱
 */
function filterRecipes(list: Recipe[], profile: UserProfile, week: number): (Recipe & { _score: number })[] {
  return list
    .filter(r => {
      // 孕周范围
      if (week < r.suitableWeeks[0] || week > r.suitableWeeks[1]) return false
      // 过敏排除
      const userAllergens = profile.allergies.filter(a => a !== 'none')
      const recipeAllergens = r.commonAllergens.filter(a => a !== 'none')
      if (userAllergens.some(a => recipeAllergens.includes(a))) return false
      // 健康条件排除
      const userConditions = profile.healthConditions.filter(c => c !== 'none')
      if (userConditions.some(c => r.unsuitableConditions.includes(c))) return false
      // 素食者过滤肉类
      if (profile.isVegetarian && (r.category === 'main' || r.category === 'soup')) {
        const meatKeywords = ['鸡', '猪', '牛', '羊', '鱼', '虾', '蟹', '鸭', '鹅', '肉', '排骨', '肝']
        if (r.ingredients.some(ing => meatKeywords.some(m => ing.includes(m)))) return false
      }
      return true
    })
    .map(r => ({ ...r, _score: 0 }))
}

/**
 * 食谱评分
 */
function scoreRecipes(list: (Recipe & { _score: number })[], _profile: UserProfile, week: number, bmi: number): (Recipe & { _score: number })[] {
  for (const item of list) {
    let score = 0

    // 孕周匹配度 (0-1)
    const weekMid = (item.suitableWeeks[0] + item.suitableWeeks[1]) / 2
    const weekDist = Math.abs(week - weekMid)
    const weekScore = Math.exp(-weekDist * weekDist / (2 * 16)) // σ=4 weeks
    score += weekScore * 0.30

    // 营养匹配度 (0-1)
    const weekData = getCurrentWeekData(week)
    if (weekData) {
      const neededNutrients = weekData.nutritionFocus
      const matched = neededNutrients.filter(n => item.keyNutrients.some(k => k.includes(n) || n.includes(k)))
      const nutrientScore = neededNutrients.length > 0 ? matched.length / neededNutrients.length : 0.5
      score += nutrientScore * 0.25
    }

    // BMI调整
    if (bmi < 18.5) {
      // 偏瘦：高分给高热量
      score += (item.calories > 300 ? 0.20 : 0.10)
    } else if (bmi >= 25) {
      // 偏重：高分给低热量
      score += (item.calories < 250 ? 0.20 : 0.10)
    } else {
      score += 0.15
    }

    // 孕期优先级
    const trimester = week <= 12 ? 1 : week <= 27 ? 2 : 3
    if (trimester === 1) {
      if (item.keyNutrients.some(n => n.includes('叶酸'))) score += 0.15
    } else if (trimester === 2) {
      if (item.keyNutrients.some(n => n.includes('钙'))) score += 0.15
    } else {
      if (item.keyNutrients.some(n => n.includes('DHA') || n.includes('铁'))) score += 0.15
    }

    item._score = Math.round(score * 100) / 100
  }

  return list
}

/**
 * 过滤运动
 */
function filterExercises(list: Exercise[], profile: UserProfile, week: number): (Exercise & { _score: number })[] {
  return list
    .filter(e => {
      if (week < e.suitableWeeks[0] || week > e.suitableWeeks[1]) return false
      const userConditions = profile.healthConditions.filter(c => c !== 'none')
      if (userConditions.some(c => e.unsuitableConditions.includes(c))) return false
      if (!e.previousActivityLevel.includes(profile.activityLevel)) return false
      return true
    })
    .map(e => ({ ...e, _score: 0 }))
}

/**
 * 运动评分
 */
function scoreExercises(list: (Exercise & { _score: number })[], _profile: UserProfile, week: number, bmi: number): (Exercise & { _score: number })[] {
  for (const item of list) {
    let score = 0

    const weekMid = (item.suitableWeeks[0] + item.suitableWeeks[1]) / 2
    const weekDist = Math.abs(week - weekMid)
    score += Math.exp(-weekDist * weekDist / (2 * 25)) * 0.40

    if (bmi >= 25 || bmi < 18.5) {
      if (item.category === 'walking' || item.category === 'pelvic') score += 0.30
    } else {
      score += 0.20
    }

    if (week > 28 && item.category === 'pelvic') score += 0.20
    if (week > 36 && (item.category === 'breathing' || item.category === 'pelvic')) score += 0.10

    item._score = Math.round(score * 100) / 100
  }
  return list
}

/**
 * 生成每周提示
 */
function generateWeeklyTips(_profile: UserProfile, weekData: WeekData | undefined, _bmi: number): string[] {
  const tips: string[] = []
  if (weekData) {
    tips.push(weekData.dailyTip)
    if (weekData.nutritionTips.length > 0) tips.push(weekData.nutritionTips[0])
    if (weekData.dadTips) tips.push('👨 准爸爸：' + weekData.dadTips)
  }
  return tips
}

/**
 * 生成警告标记
 */
function generateWarningFlags(profile: UserProfile, bmi: number, week: number): string[] {
  const flags: string[] = []

  if (bmi >= 28) flags.push('BMI偏高，请关注体重管理，控制饮食热量')
  if (profile.age >= 35) flags.push('高龄孕妇，请按时产检，关注医生建议')
  if (profile.healthConditions.includes('gestational_diabetes') && week >= 24) {
    flags.push('妊娠糖尿病：请严格控制血糖，选择低GI食物，定时监测血糖')
  }
  if (profile.healthConditions.includes('gestational_hypertension')) {
    flags.push('妊娠高血压：请低盐饮食，定期监测血压，如有不适立即就医')
  }
  if (profile.isMultiplePregnancy) {
    flags.push('多胎妊娠：营养需求更高，建议在医生指导下补充营养')
  }
  if (week >= 36) flags.push('已进入孕晚期最后阶段，请准备好待产包！')
  if (week <= 12) {
    flags.push('孕早期注意补充叶酸，避免剧烈运动，远离有害物质')
  }

  return flags
}
