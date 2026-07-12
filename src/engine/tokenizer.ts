// ============ 中文分词器 ============
// 基于词典的正向最大匹配（FMM）算法

// 孕期相关词典（按词长降序排列，FMM需要优先匹配长词）
const DICTIONARY: string[] = [
  // 4字词
  '妊娠糖尿病', '妊娠高血压', '无创DNA', '大排畸B超', '妊娠剧吐',
  '少食多餐', '左侧卧位', '羊水过多', '羊水过少', '孕期抑郁',
  '骨盆疼痛', '坐骨神经', '待产包', '拉玛泽', '孕妇枕',
  // 3字词
  '预产期', '补叶酸', '凯格尔', '猫牛式', '糖尿病',
  '高血压', '孕中期', '孕晚期', '孕早期', '第一孕',
  '第二孕', '第三孕', '末次月经', '基础体温',
  // 2字词
  '怀孕', '孕期', '孕妇', '产检', '分娩',
  '孕吐', '恶心', '呕吐', '水肿', '便秘',
  '失眠', '抽筋', '背痛', '腰痛', '头晕',
  '贫血', '血糖', '血压', '胎动', '胎心',
  '早产', '流产', '顺产', '剖腹', '破水',
  '见红', '宫缩', '阵痛', '待产', '产后',
  '月嫂', '月子', '母乳', '奶粉', '奶瓶',
  '尿布', '婴儿', '宝宝', '胎儿', '胚胎',
  'DHA', '叶酸', '铁质', '钙质', '蛋白质',
  '维生素', '矿物质', '营养', '饮食', '食谱',
  '菜谱', '运动', '瑜伽', '散步', '游泳',
  '游泳', '呼吸', '冥想', '放松', '伸展',
  '体检', '超声', 'B超', '唐筛', 'NT',
  '糖耐', '四维', '三维', '羊水', '胎盘',
  '脐带', '子宫', '卵巢', '宫颈', '骨盆',
  '胸部', '乳房', '乳汁', '初乳', '哺乳',
  '辣椒', '咖啡', '茶叶', '饮酒', '吸烟',
  '二手烟', '化妆', '染发', '美甲', '护肤',
  '感冒', '发烧', '咳嗽', '头痛', '牙痛',
  '过敏', '瘙痒', '皮疹', '湿疹', '妊娠纹',
  '体重', '增重', '减肥', '节食', '肥胖',
  '偏瘦', 'BMI', '热量', '卡路里', '碳水',
  '脂肪', '纤维', '碳水', '主食', '水果',
  '蔬菜', '肉类', '海鲜', '豆类', '奶类',
  '鸡蛋', '坚果', '零食', '甜品', '饮料',
  '汤品', '粥', '羹', '煲汤', '蒸',
  '清淡', '油腻', '辛辣', '生冷', '禁忌',
  '注意事项', '护理', '保养', '保健', '安全',
  '第1周', '第2周', '第3周', '第4周', '第5周',
  '第6周', '第7周', '第8周', '第9周', '第10周',
  '第11周', '第12周', '第13周', '第14周', '第15周',
  '第16周', '第17周', '第18周', '第19周', '第20周',
  '第21周', '第22周', '第23周', '第24周', '第25周',
  '第26周', '第27周', '第28周', '第29周', '第30周',
  '第31周', '第32周', '第33周', '第34周', '第35周',
  '第36周', '第37周', '第38周', '第39周', '第40周',
]

// 同义词映射
const SYNONYMS: Record<string, string[]> = {
  '孕吐': ['晨吐', '恶心', '想吐', '反胃', '干呕'],
  '水肿': ['浮肿', '肿胀', '脚肿', '腿肿', '手肿'],
  '便秘': ['排便困难', '拉不出来', '大便干', '腹胀'],
  '失眠': ['睡不着', '入睡困难', '熬夜', '睡眠不好', '睡眠差'],
  '抽筋': ['腿抽筋', '痉挛', '抽搐', '半夜抽筋'],
  '背痛': ['腰疼', '腰痛', '腰酸', '背疼', '脊柱疼'],
  '产检': ['检查', '体检', '孕检', 'B超', '超声'],
  '分娩': ['生产', '生孩子', '顺产', '剖腹产', '临产'],
  '胎动': ['宝宝动', '胎儿动', '肚子动', '蠕动'],
  '饮食': ['吃', '食谱', '营养', '吃什么', '补', '食物'],
  '运动': ['锻炼', '瑜伽', '活动', '做操', '散步', '健身'],
  '贫血': ['缺铁', '补血', '血红蛋白低', '头晕'],
  '糖耐': ['血糖', '糖筛', 'OGTT', '喝糖水'],
  'NT': ['颈项透明层', '早期唐筛', '早唐'],
  '待产包': ['入院包', '生产包', '住院物品', '准备什么'],
  '宫缩': ['阵痛', '肚子发紧', '肚子硬', '假性宫缩'],
  '剖腹产': ['剖宫产', '剖腹', '手术', '开刀'],
  '母乳': ['喂奶', '哺乳', '奶水', '下奶', '催乳'],
  '叶酸': ['维生素B9', 'folate', '备孕'],
  'DHA': ['鱼油', 'Omega-3', '脑黄金'],
  '体重': ['增重', '长胖', '发胖', '变重', '超重'],
  '妊娠纹': ['生长纹', '纹路', '肚皮纹', '皮肤纹'],
}

/**
 * 正向最大匹配分词
 */
export function tokenize(text: string): string[] {
  const tokens: string[] = []
  let i = 0

  while (i < text.length) {
    let matched = false
    // 从当前位置开始，尝试匹配最长词（优先匹配4字、3字、2字词）
    for (let len = Math.min(5, text.length - i); len >= 1; len--) {
      const word = text.substring(i, i + len)
      if (DICTIONARY.includes(word)) {
        tokens.push(word)
        i += len
        matched = true
        break
      }
    }
    if (!matched) {
      // 单个字符
      const ch = text[i]
      // 跳过标点符号和空格
      if (/[一-龥]/.test(ch)) {
        tokens.push(ch)
      }
      i++
    }
  }

  return tokens
}

/**
 * 提取关键词（去重 + 同义词扩展）
 */
export function extractKeywords(text: string): string[] {
  const tokens = tokenize(text.toLowerCase())
  const keywords = new Set<string>()

  for (const token of tokens) {
    keywords.add(token)
    // 添加同义词
    const synonyms = findSynonyms(token)
    for (const syn of synonyms) {
      keywords.add(syn)
    }
  }

  // 也检查整段文本中的同义词触发
  for (const [key, syns] of Object.entries(SYNONYMS)) {
    for (const syn of syns) {
      if (text.includes(syn)) {
        keywords.add(key)
        for (const s of syns) keywords.add(s)
      }
    }
  }

  return Array.from(keywords)
}

/**
 * 查找同义词
 */
function findSynonyms(word: string): string[] {
  // 直接匹配
  if (SYNONYMS[word]) return SYNONYMS[word]

  // 在所有同义词列表中查找
  for (const [, syns] of Object.entries(SYNONYMS)) {
    if (syns.includes(word)) {
      const result = [...syns]
      // 找到对应的key并加入
      for (const [key, s] of Object.entries(SYNONYMS)) {
        if (s === syns) {
          result.push(key)
          break
        }
      }
      return result
    }
  }

  return []
}

/**
 * 从文本中提取孕周数字
 */
export function extractWeekNumber(text: string): number | null {
  // 匹配 "第X周", "X周", "第 X 周"
  const patterns = [
    /第\s*(\d+)\s*周/,
    /(\d+)\s*周/,
    /week\s*(\d+)/i,
    /W(\d+)/i,
  ]
  for (const p of patterns) {
    const m = text.match(p)
    if (m) {
      const w = parseInt(m[1], 10)
      if (w >= 1 && w <= 40) return w
    }
  }
  return null
}

/**
 * 判断查询意图类型
 */
export type IntentType = 'diet' | 'exercise' | 'symptoms' | 'checkup' | 'week_info' | 'baby' | 'general'

export function detectIntent(text: string): IntentType {
  const dietWords = ['吃', '食谱', '营养', '饮食', '食物', '喝', '补', '菜', '汤', '粥', '水果', '蔬菜', '肉类', '禁忌']
  const exerciseWords = ['运动', '锻炼', '瑜伽', '散步', '游泳', '做操', '健身', '活动']
  const symptomWords = ['难受', '不舒服', '疼痛', '痛', '吐', '恶心', '肿', '睡不着', '便秘', '抽筋', '晕']
  const checkupWords = ['检查', '产检', 'B超', '唐筛', '糖耐', 'NT', '四维', '大排畸', '建档', '医院']
  const weekWords = ['第', '周', 'week', '多大', '大小', '发育', '变化']
  const babyWords = ['宝宝', '胎儿', '婴儿', '胎动', '心跳', '性别']

  if (dietWords.some(w => text.includes(w))) return 'diet'
  if (exerciseWords.some(w => text.includes(w))) return 'exercise'
  if (symptomWords.some(w => text.includes(w))) return 'symptoms'
  if (checkupWords.some(w => text.includes(w))) return 'checkup'
  if (weekWords.some(w => text.includes(w))) return 'week_info'
  if (babyWords.some(w => text.includes(w))) return 'baby'
  return 'general'
}
