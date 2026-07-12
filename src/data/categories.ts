import type { Category } from '../types'

export const categories: Category[] = [
  {
    id: 'weeks',
    name: '孕期周历',
    icon: '📅',
    description: '从第1周到第40周，每周的胎儿发育和母体变化',
    route: '/knowledge',
  },
  {
    id: 'diet',
    name: '营养饮食',
    icon: '🥗',
    description: '孕期营养指南、食谱推荐和饮食禁忌',
    route: '/knowledge',
  },
  {
    id: 'exercise',
    name: '孕期运动',
    icon: '🧘',
    description: '安全有效的孕期运动方式和注意事项',
    route: '/knowledge',
  },
  {
    id: 'checkup',
    name: '产检指南',
    icon: '🏥',
    description: '各阶段产检项目和时间安排',
    route: '/knowledge',
  },
  {
    id: 'problems',
    name: '常见不适',
    icon: '💊',
    description: '孕期常见不适症状及缓解方法',
    route: '/knowledge',
  },
  {
    id: 'labor',
    name: '分娩准备',
    icon: '👶',
    description: '分娩知识、待产包清单和产后护理',
    route: '/knowledge',
  },
]
