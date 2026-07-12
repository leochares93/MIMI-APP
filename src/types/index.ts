// ============ 孕期数据类型 ============

export type Trimester = 1 | 2 | 3

export interface WeekData {
  week: number
  trimester: Trimester
  title: string

  // 胎儿发育
  fetalSize: string
  fetalWeight: string
  fetalLength: string
  fetalDevelopment: string[]

  // 母体变化
  maternalChanges: string[]
  commonSymptoms: string[]

  // 营养与饮食
  nutritionFocus: string[]
  nutritionTips: string[]

  // 运动
  exerciseRecommendations: string[]

  // 注意事项
  precautions: string[]
  checkupItems: string[]
  toDoList: string[]

  // 贴士
  dadTips: string
  dailyTip: string

  // 搜索关键词
  keywords: string[]
}

// ============ 食谱类型 ============

export type RecipeCategory = 'soup' | 'main' | 'side' | 'snack' | 'drink' | 'breakfast'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type HealthCondition =
  | 'gestational_diabetes'
  | 'gestational_hypertension'
  | 'anemia'
  | 'thyroid_disorder'
  | 'none'
export type Allergen =
  | 'milk'
  | 'eggs'
  | 'peanuts'
  | 'tree_nuts'
  | 'soy'
  | 'wheat'
  | 'fish'
  | 'shellfish'
  | 'sesame'
  | 'none'

export interface Recipe {
  id: string
  name: string
  category: RecipeCategory
  suitableWeeks: [number, number]
  unsuitableConditions: HealthCondition[]
  commonAllergens: Allergen[]
  ingredients: string[]
  instructions: string[]
  prepTime: number
  cookingTime: number
  difficulty: Difficulty
  calories: number
  keyNutrients: string[]
  benefits: string
  tags: string[]
  keywords: string[]
}

// ============ 运动类型 ============

export type ExerciseCategory = 'stretching' | 'yoga' | 'walking' | 'pelvic' | 'breathing' | 'strength'
export type ActivityLevel = 'sedentary' | 'moderate' | 'active'

export interface Exercise {
  id: string
  name: string
  category: ExerciseCategory
  suitableWeeks: [number, number]
  unsuitableConditions: HealthCondition[]
  previousActivityLevel: ActivityLevel[]
  description: string
  steps: string[]
  duration: number
  frequency: string
  precautions: string[]
  benefits: string[]
  tags: string[]
  keywords: string[]
}

// ============ FAQ 类型 ============

export type FAQCategory = 'diet' | 'exercise' | 'symptoms' | 'checkup' | 'lifestyle' | 'labor' | 'general'

export interface FAQ {
  id: string
  question: string
  answer: string
  category: FAQCategory
  relatedWeeks: number[]
  tags: string[]
  keywords: string[]
}

// ============ 常见问题类型 ============

export interface Problem {
  id: string
  name: string
  description: string
  symptoms: string[]
  causes: string[]
  solutions: string[]
  whenToSeeDoctor: string
  relatedWeeks: [number, number]
  tags: string[]
  keywords: string[]
}

// ============ 用户档案类型 ============

export interface UserProfile {
  name: string
  age: number
  height: number           // cm
  prePregnancyWeight: number // kg
  currentWeight: number    // kg
  currentWeek: number      // 1-40
  dueDate: string          // YYYY-MM-DD
  allergies: Allergen[]
  healthConditions: HealthCondition[]
  activityLevel: ActivityLevel
  isVegetarian: boolean
  isMultiplePregnancy: boolean
  lastPeriodDate: string   // YYYY-MM-DD
}

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  age: 28,
  height: 160,
  prePregnancyWeight: 55,
  currentWeight: 58,
  currentWeek: 8,
  dueDate: '',
  allergies: ['none'],
  healthConditions: ['none'],
  activityLevel: 'moderate',
  isVegetarian: false,
  isMultiplePregnancy: false,
  lastPeriodDate: '',
}

// ============ 聊天类型 ============

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  results?: SearchResult[]
}

// ============ 搜索类型 ============

export type SearchResultType = 'week' | 'recipe' | 'exercise' | 'faq' | 'problem'

export interface SearchResult {
  type: SearchResultType
  item: WeekData | Recipe | Exercise | FAQ | Problem
  score: number
  matchedOn: string[]
}

// ============ 分类类型 ============

export interface Category {
  id: string
  name: string
  icon: string
  description: string
  route: string
}

// ============ 推荐结果类型 ============

export interface RecommendationResult {
  dailyRecipes: Recipe[]
  dailyExercises: Exercise[]
  weeklyTips: string[]
  warningFlags: string[]
}
