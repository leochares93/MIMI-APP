import type { WeekData, SearchResult, SearchResultType, UserProfile } from '../types'
import weeks from '../data/weeks'
import recipes from '../data/recipes'
import exercises from '../data/exercises'
import faqs from '../data/faq'
import problems from '../data/problems'
import { extractKeywords, extractWeekNumber, detectIntent, type IntentType } from './tokenizer'

// 预计算的 IDF 值（简化版：每个数据集的词频倒数）
let tfIdfReady = false
const idfScores: Map<string, number> = new Map()
const allDocuments: { type: SearchResultType; item: any; text: string }[] = []

/**
 * 初始化搜索引擎（构建索引）
 */
function ensureIndex(): void {
  if (tfIdfReady) return

  // 收集所有"文档"
  for (const w of weeks) {
    const text = [w.title, ...w.fetalDevelopment, ...w.maternalChanges, ...w.nutritionTips, ...w.precautions, ...w.keywords].join(' ')
    allDocuments.push({ type: 'week', item: w, text })
  }
  for (const r of recipes) {
    const text = [r.name, r.benefits, ...r.ingredients, ...r.keyNutrients, ...r.tags, ...r.keywords].join(' ')
    allDocuments.push({ type: 'recipe', item: r, text })
  }
  for (const e of exercises) {
    const text = [e.name, e.description, ...e.benefits, ...e.tags, ...e.keywords].join(' ')
    allDocuments.push({ type: 'exercise', item: e, text })
  }
  for (const f of faqs) {
    const text = [f.question, f.answer, ...f.tags, ...f.keywords].join(' ')
    allDocuments.push({ type: 'faq', item: f, text })
  }
  for (const p of problems) {
    const text = [p.name, p.description, ...p.symptoms, ...p.solutions, ...p.tags, ...p.keywords].join(' ')
    allDocuments.push({ type: 'problem', item: p, text })
  }

  // 计算 IDF
  const totalDocs = allDocuments.length
  const termDocFreq = new Map<string, number>()

  for (const doc of allDocuments) {
    const terms = new Set(extractKeywords(doc.text))
    for (const t of terms) {
      termDocFreq.set(t, (termDocFreq.get(t) || 0) + 1)
    }
  }

  for (const [term, freq] of termDocFreq) {
    idfScores.set(term, Math.log(totalDocs / (freq + 1)) + 1)
  }

  tfIdfReady = true
}

/**
 * 主搜索函数
 */
export function search(query: string, profile?: UserProfile, topN: number = 8): SearchResult[] {
  ensureIndex()

  const keywords = extractKeywords(query)
  const weekNum = extractWeekNumber(query)
  const intent = detectIntent(query)
  const userWeek = profile?.currentWeek || 1

  const results: SearchResult[] = []

  for (const doc of allDocuments) {
    const score = calculateScore(doc, keywords, intent, weekNum, userWeek)
    if (score > 0) {
      results.push({
        type: doc.type,
        item: doc.item,
        score,
        matchedOn: keywords.filter(k => doc.text.includes(k)),
      })
    }
  }

  // 排序：相关性 > 意图加成 > 孕周接近度
  results.sort((a, b) => b.score - a.score)

  return results.slice(0, topN)
}

/**
 * 计算单文档评分
 */
function calculateScore(
  doc: { type: SearchResultType; item: any; text: string },
  keywords: string[],
  intent: IntentType,
  weekNum: number | null,
  userWeek: number,
): number {
  let score = 0

  // TF-IDF 评分
  let tfIdfSum = 0
  for (const kw of keywords) {
    const tf = (doc.text.match(new RegExp(kw, 'g')) || []).length
    const idf = idfScores.get(kw) || 1
    tfIdfSum += tf * idf
  }
  score += Math.min(tfIdfSum / 10, 1) * 0.40

  // 分类匹配加成
  const typeIntentMap: Record<string, SearchResultType[]> = {
    diet: ['recipe', 'faq'],
    exercise: ['exercise', 'faq'],
    symptoms: ['problem', 'faq'],
    checkup: ['faq', 'week'],
    week_info: ['week'],
    baby: ['week'],
    general: ['faq', 'week', 'problem', 'recipe', 'exercise'],
  }

  if (typeIntentMap[intent]?.includes(doc.type)) {
    score += 0.25
  }

  // 标题/名称匹配加成
  const titleField = (doc.item as any).title || (doc.item as any).name || (doc.item as any).question || ''
  const titleMatch = keywords.some(k => titleField.includes(k))
  if (titleMatch) score += 0.20

  // 孕周接近度
  let itemWeek = 0
  if (doc.type === 'week') {
    itemWeek = (doc.item as WeekData).week
  } else {
    const relatedWeeks = (doc.item as any).relatedWeeks || (doc.item as any).suitableWeeks
    if (relatedWeeks && relatedWeeks.length >= 2) {
      itemWeek = (relatedWeeks[0] + relatedWeeks[1]) / 2
    }
  }
  if (itemWeek > 0) {
    const dist = Math.abs(userWeek - itemWeek)
    score += Math.exp(-dist / 8) * 0.15
  }

  // 如果有明确孕周数字，精确匹配加成
  if (weekNum && doc.type === 'week' && (doc.item as WeekData).week === weekNum) {
    score += 0.30
  }

  return Math.round(score * 100) / 100
}

/**
 * 简单搜索（不依赖用户档案）
 */
export function simpleSearch(query: string, topN: number = 5): SearchResult[] {
  return search(query, undefined, topN)
}
