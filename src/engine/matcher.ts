import type { UserProfile, SearchResult } from '../types'
import { search } from './search'
import { extractWeekNumber, detectIntent } from './tokenizer'
import { getCurrentWeekData } from './recommender'

/**
 * 聊天问答匹配结果
 */
export interface ChatResponse {
  text: string
  results?: SearchResult[]
  suggestedQuestions?: string[]
  responseType: 'faq' | 'recipe' | 'exercise' | 'week_info' | 'problem' | 'multi' | 'fallback'
}

/**
 * 主匹配函数：接收用户问题，返回回答
 */
export function matchQuery(query: string, profile?: UserProfile): ChatResponse {
  const results = search(query, profile, 6)

  if (results.length === 0 || results[0].score < 0.1) {
    return buildFallback(profile)
  }

  const topResult = results[0]
  const intent = detectIntent(query)
  const weekNum = extractWeekNumber(query)

  // 精确孕周匹配
  if (weekNum && weekNum >= 1 && weekNum <= 40) {
    const weekData = getCurrentWeekData(weekNum)
    if (weekData) {
      return buildWeekResponse(weekNum, results)
    }
  }

  // 高置信度 FAQ 匹配
  if (topResult.type === 'faq' && topResult.score > 0.3) {
    return buildFAQResponse(results, profile)
  }

  // 食谱推荐
  if (intent === 'diet' || topResult.type === 'recipe') {
    return buildRecipeResponse(results, profile)
  }

  // 运动推荐
  if (intent === 'exercise' || topResult.type === 'exercise') {
    return buildExerciseResponse(results, profile)
  }

  // 症状/问题
  if (intent === 'symptoms' || topResult.type === 'problem') {
    return buildProblemResponse(results, profile)
  }

  // 多结果展示
  if (results.length >= 2) {
    return buildMultiResponse(results, query, profile)
  }

  return buildFallback(profile)
}

function buildFAQResponse(results: SearchResult[], profile?: UserProfile): ChatResponse {
  const top = results[0].item as any
  const text = top.answer || top.description || ''
  return {
    text,
    results: results.slice(0, 3),
    suggestedQuestions: generateSuggestions(profile, 'faq'),
    responseType: 'faq',
  }
}

function buildRecipeResponse(results: SearchResult[], profile?: UserProfile): ChatResponse {
  const recipes = results
    .filter(r => r.type === 'recipe')
    .slice(0, 3)

  if (recipes.length === 0) {
    return buildFallback(profile)
  }

  const names = recipes.map(r => `• ${(r.item as any).name}`).join('\n')
  return {
    text: `根据你的情况，为你推荐以下食谱：\n\n${names}\n\n点击查看详细做法和食材清单。`,
    results: recipes,
    suggestedQuestions: generateSuggestions(profile, 'diet'),
    responseType: 'recipe',
  }
}

function buildExerciseResponse(results: SearchResult[], profile?: UserProfile): ChatResponse {
  const exercises = results
    .filter(r => r.type === 'exercise')
    .slice(0, 3)

  if (exercises.length === 0) {
    return buildFallback(profile)
  }

  const names = exercises.map(r => `• ${(r.item as any).name}`).join('\n')
  return {
    text: `根据你的孕期阶段，推荐以下运动：\n\n${names}\n\n请注意控制强度，以舒适为度。`,
    results: exercises,
    suggestedQuestions: generateSuggestions(profile, 'exercise'),
    responseType: 'exercise',
  }
}

function buildProblemResponse(results: SearchResult[], profile?: UserProfile): ChatResponse {
  const top = results[0].item as any
  const solutions = top.solutions || []
  const text = solutions.length > 0
    ? `关于「${top.name || top.question}」，以下是一些建议：\n\n${solutions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}`
    : top.answer || top.description || ''

  return {
    text,
    results: results.slice(0, 3),
    suggestedQuestions: generateSuggestions(profile, 'symptoms'),
    responseType: 'problem',
  }
}

function buildWeekResponse(weekNum: number, results: SearchResult[]): ChatResponse {
  const weekData = getCurrentWeekData(weekNum)
  if (!weekData) return buildFallback()

  const text = `📅 **第${weekNum}周**\n\n` +
    `👶 宝宝大小：${weekData.fetalSize}\n` +
    `📏 身长：${weekData.fetalLength}\n` +
    `⚖️ 体重：${weekData.fetalWeight}\n\n` +
    `🔬 胎儿发育：\n${weekData.fetalDevelopment.map(d => `• ${d}`).join('\n')}\n\n` +
    `👩 妈妈变化：\n${weekData.maternalChanges.map(d => `• ${d}`).join('\n')}\n\n` +
    `⚠️ 注意事项：\n${weekData.precautions.map(d => `• ${d}`).join('\n')}\n\n` +
    `💡 每日贴士：${weekData.dailyTip}`

  return {
    text,
    results,
    suggestedQuestions: [
      `第${weekNum}周吃什么好？`,
      `第${weekNum}周适合做什么运动？`,
      weekNum > 1 ? `第${weekNum - 1}周需要注意什么？` : `第${weekNum + 1}周需要注意什么？`,
    ],
    responseType: 'week_info',
  }
}

function buildMultiResponse(results: SearchResult[], query: string, profile?: UserProfile): ChatResponse {
  const items = results.slice(0, 4).map(r => {
    const item = r.item as any
    const icon = r.type === 'recipe' ? '🍳' : r.type === 'exercise' ? '🧘' : r.type === 'faq' ? '💡' : r.type === 'problem' ? '💊' : '📅'
    const title = item.title || item.name || item.question || '相关内容'
    return `${icon} ${title}`
  })

  return {
    text: `关于「${query}」，找到以下相关内容：\n\n${items.join('\n')}\n\n你想了解哪一个？`,
    results: results.slice(0, 4),
    suggestedQuestions: generateSuggestions(profile, 'general'),
    responseType: 'multi',
  }
}

function buildFallback(profile?: UserProfile): ChatResponse {
  return {
    text: '抱歉，我没有找到完全匹配的信息。\n\n你可以尝试：\n• 换一种方式提问\n• 在「知识」页面浏览孕周指南\n• 查看「常见问题」分类\n\n或者试试以下热门问题：',
    results: [],
    suggestedQuestions: generateSuggestions(profile, 'general'),
    responseType: 'fallback',
  }
}

/**
 * 生成建议问题
 */
function generateSuggestions(profile?: UserProfile, context?: string): string[] {
  const week = profile?.currentWeek || 8
  const questions: string[] = []

  switch (context) {
    case 'diet':
      questions.push(`第${week}周吃什么好？`)
      questions.push('孕期不能吃哪些食物？')
      questions.push('孕期贫血吃什么补？')
      break
    case 'exercise':
      questions.push(`第${week}周适合做什么运动？`)
      questions.push('孕期可以做瑜伽吗？')
      questions.push('孕期运动要注意什么？')
      break
    case 'symptoms':
      questions.push('孕吐怎么缓解？')
      questions.push('孕期失眠怎么办？')
      questions.push('孕期水肿怎么缓解？')
      break
    case 'faq':
      questions.push('孕期可以喝咖啡吗？')
      questions.push('孕期需要做哪些检查？')
      break
    default:
      questions.push(`第${week}周需要注意什么？`)
      questions.push('孕期可以吃什么？')
      questions.push('孕期常见不适怎么办？')
  }

  // 确保至少 3 个
  while (questions.length < 3) {
    questions.push(`第${week}周有什么变化？`)
  }

  return questions.slice(0, 4)
}
