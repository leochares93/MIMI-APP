export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return '偏瘦'
  if (bmi < 24) return '正常'
  if (bmi < 28) return '偏重'
  return '肥胖'
}

export function getRecommendedWeightGain(bmi: number, isMultiple: boolean): { min: number; max: number; total: string } {
  if (isMultiple) {
    return { min: 16, max: 20.5, total: '16-20.5公斤' }
  }
  if (bmi < 18.5) return { min: 12.5, max: 18, total: '12.5-18公斤' }
  if (bmi < 24) return { min: 11.5, max: 16, total: '11.5-16公斤' }
  if (bmi < 28) return { min: 7, max: 11.5, total: '7-11.5公斤' }
  return { min: 5, max: 9, total: '5-9公斤' }
}
