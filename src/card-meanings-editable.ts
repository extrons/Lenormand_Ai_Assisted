import { type Card } from './card-meanings'

export interface CardMeaning {
  id: number
  name: string
  image: string
  core: string
  meanings: string[]
}

// 凝练后的默认牌意（核心 + 补充）
export const defaultMeanings: CardMeaning[] = [
  {
    id: 1, name: '骑手', image: '/cards/01-rider.JPG',
    core: '快速行动、短途消息',
    meanings: ['行动力爆发但续航短', '突然传来的消息', '年轻人的冲动行为']
  },
  {
    id: 2, name: '三叶草', image: '/cards/02-clover.JPG',
    core: '意外之喜、小幸运',
    meanings: ['概率极低的好运', '最后出现则事情难成', '短暂的幸运窗口']
  },
  {
    id: 3, name: '船', image: '/cards/03-ship.JPG',
    core: '长途远行、稳步推进',
    meanings: ['缓慢但持久的行动力', '异地恋/远距离关系', '海外、跨领域事务']
  },
  {
    id: 4, name: '房子', image: '/cards/04-house.JPG',
    core: '安全感、舒适圈',
    meanings: ['家庭、家族事务', '缺乏行动力', '固守现状不愿改变']
  },
  {
    id: 5, name: '树', image: '/cards/05-tree.JPG',
    core: '自然状态、健康长寿',
    meanings: ['时间跨度长', '家族图腾/根基', '缓慢但稳固的发展']
  },
  {
    id: 6, name: '云', image: '/cards/06-clouds.JPG',
    core: '迷茫、情绪低落',
    meanings: ['视线不清、遮挡光亮', '动力不足的状态', '弥漫性、持续性的困惑']
  },
  {
    id: 7, name: '蛇', image: '/cards/07-snake.JPG',
    core: '非正常态、曲折算计',
    meanings: ['欺骗、挖坑、有目的性', '玄学、神秘学相关', '尴尬、扭曲变形']
  },
  {
    id: 8, name: '棺材', image: '/cards/08-coffin.JPG',
    core: '受限、封闭状态',
    meanings: ['不等于死亡，而是被束缚', '方方正正的空间', '行为受限、暂时停滞']
  },
  {
    id: 9, name: '花束', image: '/cards/09-bouquet.JPG',
    core: '绽放、展示美好',
    meanings: ['曝光、展示给他人看', '整体气质令人舒适', '带有虚荣成分的展现']
  },
  {
    id: 10, name: '镰刀', image: '/cards/10-scythe.JPG',
    core: '快速截断、突然收割',
    meanings: ['关系一刀两断', '尖锐物品、伤害', '封闭式问题倾向否定']
  },
  {
    id: 11, name: '鞭子', image: '/cards/11-whip.JPG',
    core: '反复鞭策、思想碰撞',
    meanings: ['辩论、反复沟通', '加速时间进程', '重复经历同一场景']
  },
  {
    id: 12, name: '鸟', image: '/cards/12-birds.JPG',
    core: '信息沟通、言语往来',
    meanings: ['有来有往的对话', '说说而已（高纬位置）', '会议、讨论']
  },
  {
    id: 13, name: '孩子', image: '/cards/13-child.JPG',
    core: '不成熟、新的开始',
    meanings: ['概率10-20%', '小体量、情绪化', '事情的起始状态']
  },
  {
    id: 14, name: '狐狸', image: '/cards/14-fox.JPG',
    core: '生存本能、灵活伪装',
    meanings: ['紧张试探、观察环境', '被动性欺骗（为生存）', '戴面具的人、灵活应变']
  },
  {
    id: 15, name: '熊', image: '/cards/15-bear.JPG',
    core: '强大资源、力量象征',
    meanings: ['最大资源体', '有帮助能力但无主动性', '周围存在更强大的力量']
  },
  {
    id: 16, name: '星星', image: '/cards/16-stars.JPG',
    core: '遥远光亮、愿望目标',
    meanings: ['不落地、结果难达', '非常遥远、够不着', '代表多个数量', '网络连接（极少用）']
  },
  {
    id: 17, name: '鹳', image: '/cards/17-stork.JPG',
    core: '指数级改变、状态升级',
    meanings: ['变得更好（不一定是感情升级）', '事业更上一层楼', '根本性的状态转变']
  },
  {
    id: 18, name: '狗', image: '/cards/18-dog.JPG',
    core: '贵人相助、友善主动',
    meanings: ['主动提供帮助', '朋友、忠诚伙伴', '友善但能力不一定够']
  },
  {
    id: 19, name: '塔', image: '/cards/19-tower.JPG',
    core: '距离、权威高冷',
    meanings: ['政府、企业等权威机构', '两个世界的人', '距离成功较远', '高冷或直接的人']
  },
  {
    id: 20, name: '花园', image: '/cards/20-garden.JPG',
    core: '群体、公开场合',
    meanings: ['社交环境、公共场合', '普通人、大众类型', '综合情况的平均值']
  },
  {
    id: 21, name: '山', image: '/cards/21-mountain.JPG',
    core: '堆积、庞大障碍',
    meanings: ['无序的堆积', '知识/财富的积累', '需要整理清除的障碍']
  },
  {
    id: 22, name: '十字路口', image: '/cards/22-crossroads.JPG',
    core: '选择、多重可能性',
    meanings: ['感情上有多个选择', '实现路径出现偏差', '需要做出决定']
  },
  {
    id: 23, name: '老鼠', image: '/cards/23-mice.JPG',
    core: '小东西、啃食减少',
    meanings: ['隐藏、低调、不见光', '勤恳埋头苦干', '数量多、逐个完成']
  },
  {
    id: 24, name: '心', image: '/cards/24-heart.JPG',
    core: '感情、心愿满足',
    meanings: ['内心真实想法', '心满意足的状态', '不一定等于爱情']
  },
  {
    id: 25, name: '戒指', image: '/cards/25-ring.JPG',
    core: '约定、锁定目标',
    meanings: ['承诺、契约关系', '自我约束的约定', '循环、周而复始']
  },
  {
    id: 26, name: '书', image: '/cards/26-book.JPG',
    core: '收敛、隐藏知识',
    meanings: ['闭口不言、内敛', '复杂理论体系', '最后出现大概率放弃']
  },
  {
    id: 27, name: '信', image: '/cards/27-letter.JPG',
    core: '信息、书面通知',
    meanings: ['单向信息传递', '纸面文件、邮件', '正式通知']
  },
  {
    id: 28, name: '男人', image: '/cards/28-man.JPG',
    core: '提问者/被问者（男性）',
    meanings: ['代表男性当事人', '有男人味的特质', '阳性、主动能量']
  },
  {
    id: 29, name: '女人', image: '/cards/29-woman.JPG',
    core: '提问者/被问者（女性）',
    meanings: ['代表女性当事人', '有女人味的特质', '阴性、接纳能量']
  },
  {
    id: 30, name: '百合', image: '/cards/30-lily.JPG',
    core: '成熟、过度理智',
    meanings: ['想的多行动慢', '深思熟虑反而错过时机', '第三张牌出现则难推进']
  },
  {
    id: 31, name: '太阳', image: '/cards/31-sun.JPG',
    core: '爆发性光芒、热情',
    meanings: ['不落地、结果难持久', '极其热情如发烧', '突然爆发一瞬间']
  },
  {
    id: 32, name: '月亮', image: '/cards/32-moon.JPG',
    core: '阴晴不定、情绪周期',
    meanings: ['情绪、状态起伏', '虚幻的名声口碑', '有周期性规律的事物', '荣耀title但不稳定']
  },
  {
    id: 33, name: '钥匙', image: '/cards/33-key.JPG',
    core: '关键、解决办法',
    meanings: ['看到解决关键点', '难度大大下降', '问题有解但不等于已解决']
  },
  {
    id: 34, name: '鱼', image: '/cards/34-fish.JPG',
    core: '混乱忙碌、无序行动',
    meanings: ['突发状况不可控', '忙碌状态', '行动路径混乱']
  },
  {
    id: 35, name: '锚', image: '/cards/35-anchor.JPG',
    core: '定点、稳定/停滞',
    meanings: ['固定在某一状态', '第三张牌代表稳定', '第一张牌代表出发困难']
  },
  {
    id: 36, name: '十字架', image: '/cards/36-cross.JPG',
    core: '深刻印记、执念原则',
    meanings: ['道德底线、行为框架', '深入骨髓的痛苦/信念', '医院、病症相关', '需要付出巨大努力']
  },
]

const STORAGE_KEY = 'lenormand-meanings'

// 获取当前牌意（从 localStorage 或默认）
export function getMeanings(): CardMeaning[] {
  if (typeof window === 'undefined') return defaultMeanings
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return defaultMeanings
  try {
    return JSON.parse(stored)
  } catch {
    return defaultMeanings
  }
}

// 保存牌意到 localStorage
export function saveMeanings(meanings: CardMeaning[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meanings))
}

// 更新单张卡牌牌意
export function updateCardMeaning(id: number, updates: Partial<Omit<CardMeaning, 'id'>>): void {
  const meanings = getMeanings()
  const idx = meanings.findIndex(m => m.id === id)
  if (idx === -1) return
  const { id: _, ...safeUpdates } = updates as any
  meanings[idx] = { ...meanings[idx], ...safeUpdates }
  saveMeanings(meanings)
}

// 添加新的补充意思
export function addMeaning(id: number, meaning: string): void {
  const meanings = getMeanings()
  const card = meanings.find(m => m.id === id)
  if (!card) return
  card.meanings.push(meaning)
  saveMeanings(meanings)
}

// 删除补充意思
export function removeMeaning(id: number, meaningIndex: number): void {
  const meanings = getMeanings()
  const card = meanings.find(m => m.id === id)
  if (!card || meaningIndex < 0 || meaningIndex >= card.meanings.length) return
  card.meanings.splice(meaningIndex, 1)
  saveMeanings(meanings)
}

// 更新核心意思
export function updateCore(id: number, core: string): void {
  updateCardMeaning(id, { core })
}

// 导出为 JSON
export function exportMeanings(): string {
  return JSON.stringify(getMeanings(), null, 2)
}

// 从 JSON 导入
export function importMeanings(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as CardMeaning[]
    if (!Array.isArray(parsed)) return false
    if (parsed.length !== 36) return false
    if (!parsed.every(m => m.id && m.name && m.core && Array.isArray(m.meanings))) return false
    saveMeanings(parsed)
    return true
  } catch {
    return false
  }
}

// 重置为默认
export function resetToDefault(): void {
  saveMeanings(defaultMeanings)
}

// 格式化牌意为字符串（兼容旧格式）
export function formatMeaning(card: CardMeaning): string {
  const lines = [
    `核心: ${card.core}`,
    '',
    '补充意思：',
    ...card.meanings.map((m, i) => `${i + 1}. ${m}`)
  ]
  return lines.join('\n')
}

// 转换为兼容 Card 接口的格式
export function getCardsForDisplay(): Card[] {
  const meanings = getMeanings()
  return meanings.map(m => ({
    number: m.id,
    name: m.name,
    image: m.image,
    meaning: formatMeaning(m)
  }))
}

// 获取单张卡牌的完整信息
export function getCardByNumber(number: number): CardMeaning | undefined {
  return getMeanings().find(m => m.id === number)
}
