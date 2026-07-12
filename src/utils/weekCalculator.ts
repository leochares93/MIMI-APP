export function calculateDueDate(lastPeriodDate: string): string {
  if (!lastPeriodDate) return ''
  const lmp = new Date(lastPeriodDate)
  // 预产期 = 末次月经 + 280天 (40周)
  const due = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000)
  return due.toISOString().split('T')[0]
}

export function calculateCurrentWeek(lastPeriodDate: string): number {
  if (!lastPeriodDate) return 1
  const lmp = new Date(lastPeriodDate)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - lmp.getTime()) / (24 * 60 * 60 * 1000))
  const week = Math.floor(diffDays / 7) + 1
  return Math.max(1, Math.min(40, week))
}

export function calculateCurrentDay(lastPeriodDate: string): number {
  if (!lastPeriodDate) return 0
  const lmp = new Date(lastPeriodDate)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - lmp.getTime()) / (24 * 60 * 60 * 1000))
  return diffDays % 7
}

export function formatDueDate(dateStr: string): string {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${y}年${m}月${d}日`
}

export function daysUntilDue(dueDate: string): number {
  if (!dueDate) return 0
  const due = new Date(dueDate)
  const now = new Date()
  return Math.ceil((due.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
}
