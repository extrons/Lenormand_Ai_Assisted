<template>
  <div class="card-reference-container">
    <!-- 标题 -->
    <div class="text-h4 mb-6 text-primary font-weight-bold text-center">
      牌意速查
    </div>

    <!-- 搜索栏 -->
    <v-card class="mb-4" flat>
      <v-card-text>
        <v-text-field
          v-model="searchQuery"
          label="搜索卡牌名称或含义"
          prepend-inner-icon="mdi-magnify"
          clearable
          variant="outlined"
          density="comfortable"
          hide-details
          @keyup.enter="doSearch"
        ></v-text-field>
      </v-card-text>
    </v-card>

    <!-- 快捷筛选：按核心含义 -->
    <v-card class="mb-4" flat>
      <v-card-text>
        <div class="text-subtitle-2 mb-2 text-grey">快速筛选</div>
        <v-chip-group v-model="selectedTag" filter>
          <v-chip value="action" color="primary" variant="outlined">行动牌</v-chip>
          <v-chip value="info" color="info" variant="outlined">信息牌</v-chip>
          <v-chip value="emotion" color="error" variant="outlined">感情/情绪</v-chip>
          <v-chip value="change" color="warning" variant="outlined">变化</v-chip>
          <v-chip value="person" color="success" variant="outlined">人物</v-chip>
          <v-chip value="ending" color="grey" variant="outlined">结局牌</v-chip>
        </v-chip-group>
      </v-card-text>
    </v-card>

    <!-- 卡牌网格 -->
    <v-row>
      <v-col
        v-for="card in filteredCards"
        :key="card.number"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="card-item" hover @click="showDetail(card)">
          <v-img
            :src="card.image"
            height="200"
            cover
            class="card-image"
          >
            <template v-slot:placeholder>
              <v-sheet color="grey-lighten-2" class="fill-height d-flex align-center justify-center">
                <v-icon size="48" color="grey">mdi-image</v-icon>
              </v-sheet>
            </template>
          </v-img>

          <v-card-item>
            <template v-slot:prepend>
              <v-avatar color="primary" size="36">
                <span class="text-h6 text-white">{{ card.number }}</span>
              </v-avatar>
            </template>
            <v-card-title>{{ card.name }}</v-card-title>
            <template v-slot:append>
              <v-chip size="small" :color="getCardTagColor(card)" variant="flat">
                {{ getCardTag(card) }}
              </v-chip>
            </template>
          </v-card-item>

          <v-card-text>
            <div class="meaning-preview text-body-2 text-grey-darken-1">
              {{ getFirstLine(card.meaning) }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn variant="text" color="primary" size="small" block>
              查看完整牌意
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 无结果提示 -->
    <v-empty-state
      v-if="filteredCards.length === 0"
      icon="mdi-magnify-close"
      title="未找到匹配的卡牌"
      text="请尝试其他关键词"
      class="my-8"
    ></v-empty-state>

    <!-- 详情弹窗 -->
    <v-dialog v-model="detailDialog" max-width="700" scrollable>
      <v-card v-if="selectedCard">
        <v-card-title class="bg-primary text-white pa-4 d-flex align-center">
          <v-avatar color="white" size="40" class="mr-3">
            <span class="text-h6 text-primary">{{ selectedCard.number }}</span>
          </v-avatar>
          <span class="text-h5">{{ selectedCard.name }}</span>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" color="white" @click="detailDialog = false"></v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <!-- 卡牌大图 -->
          <v-img
            :src="selectedCard.image"
            height="300"
            cover
            rounded="lg"
            class="mb-4"
          >
            <template v-slot:placeholder>
              <v-sheet color="grey-lighten-2" class="fill-height d-flex align-center justify-center">
                <v-icon size="64" color="grey">mdi-image</v-icon>
              </v-sheet>
            </template>
          </v-img>

          <!-- 核心标签 -->
          <div class="mb-4">
            <v-chip :color="getCardTagColor(selectedCard)" size="large" class="mr-2">
              {{ getCardTag(selectedCard) }}
            </v-chip>
            <v-chip color="grey" variant="outlined" size="large">
              第 {{ selectedCard.number }} 号牌
            </v-chip>
          </div>

          <!-- 核心定义 -->
          <v-sheet color="primary-lighten-5" rounded="lg" class="pa-4 mb-4" border>
            <div class="d-flex align-start">
              <v-icon color="primary" class="mr-2 mt-1">mdi-star-circle</v-icon>
              <div>
                <div class="text-subtitle-2 text-primary font-weight-bold mb-1">核心</div>
                <div class="text-body-1 font-weight-medium">{{ getCoreMeaning(selectedCard.meaning) }}</div>
              </div>
            </div>
          </v-sheet>

          <!-- 完整牌意和解读要点结合展示 -->
          <v-sheet color="surface-light" rounded="lg" class="pa-4">
            <div class="text-subtitle-1 font-weight-bold mb-3">牌意详解</div>

            <!-- 核心定义之后的详细解读 -->
            <div class="meaning-content">
              <div
                v-for="(line, index) in getMeaningLines(selectedCard.meaning)"
                :key="index"
                class="meaning-line mb-2"
              >
                <!-- 如果是带数字的要点，显示星星图标 -->
                <template v-if="isKeyPoint(line)">
                  <div class="d-flex align-start">
                    <v-icon color="warning" size="small" class="mr-2 mt-1">mdi-star</v-icon>
                    <span class="text-body-1">{{ cleanLine(line) }}</span>
                  </div>
                </template>
                <!-- 普通描述行 -->
                <template v-else-if="isDescription(line)">
                  <span class="text-body-2 text-grey-darken-1">{{ line }}</span>
                </template>
              </div>
            </div>
          </v-sheet>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-btn color="primary" variant="elevated" block @click="detailDialog = false">
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getCardsForDisplay } from '@/card-meanings-editable'
import type { Card } from '@/card-meanings'

const emit = defineEmits<{
  back: []
}>()

// 搜索和筛选
const searchQuery = ref('')
const selectedTag = ref<string | null>(null)
const detailDialog = ref(false)
const selectedCard = ref<Card | null>(null)

// 卡牌标签映射
const cardTags: Record<number, { tag: string; color: string }> = {
  1: { tag: '行动牌', color: 'primary' },
  2: { tag: '意外', color: 'warning' },
  3: { tag: '行动牌', color: 'primary' },
  4: { tag: '稳定', color: 'success' },
  5: { tag: '健康', color: 'success' },
  6: { tag: '迷茫', color: 'grey' },
  7: { tag: '变化', color: 'warning' },
  8: { tag: '结束', color: 'grey' },
  9: { tag: '美好', color: 'success' },
  10: { tag: '切断', color: 'error' },
  11: { tag: '反复', color: 'warning' },
  12: { tag: '信息牌', color: 'info' },
  13: { tag: '开始', color: 'success' },
  14: { tag: '生存', color: 'warning' },
  15: { tag: '资源', color: 'success' },
  16: { tag: '目标', color: 'primary' },
  17: { tag: '变化', color: 'warning' },
  18: { tag: '贵人', color: 'success' },
  19: { tag: '距离', color: 'grey' },
  20: { tag: '社交', color: 'info' },
  21: { tag: '积累', color: 'warning' },
  22: { tag: '选择', color: 'primary' },
  23: { tag: '隐藏', color: 'grey' },
  24: { tag: '感情', color: 'error' },
  25: { tag: '约定', color: 'primary' },
  26: { tag: '收敛', color: 'grey' },
  27: { tag: '信息牌', color: 'info' },
  28: { tag: '人物', color: 'primary' },
  29: { tag: '人物', color: 'error' },
  30: { tag: '成熟', color: 'success' },
  31: { tag: '爆发', color: 'warning' },
  32: { tag: '情绪', color: 'info' },
  33: { tag: '关键', color: 'success' },
  34: { tag: '行动牌', color: 'primary' },
  35: { tag: '定点', color: 'primary' },
  36: { tag: '原则', color: 'error' },
}

// 标签分类映射（用于筛选）
const tagCategories: Record<string, string[]> = {
  action: ['行动牌'],
  info: ['信息牌'],
  emotion: ['感情', '情绪', '美好', '心'],
  change: ['变化', '转变', '意外', '反复', '爆发'],
  person: ['人物', '男人', '女人'],
  ending: ['结束', '切断', '收敛', '隐藏']
}

// 过滤后的卡牌列表
const filteredCards = computed(() => {
  let result = getCardsForDisplay()

  // 按标签筛选
  if (selectedTag.value) {
    const categories = tagCategories[selectedTag.value] || []
    result = result.filter(card => {
      const cardTag = cardTags[card.number]?.tag || ''
      return categories.some(cat => cardTag.includes(cat))
    })
  }

  // 按搜索词筛选
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase()
    result = result.filter(card =>
      card.name.toLowerCase().includes(keyword) ||
      card.meaning.toLowerCase().includes(keyword) ||
      (cardTags[card.number]?.tag || '').toLowerCase().includes(keyword)
    )
  }

  return result
})

// 获取卡牌标签
const getCardTag = (card: Card): string => {
  return cardTags[card.number]?.tag || '其他'
}

// 获取标签颜色
const getCardTagColor = (card: Card): string => {
  return cardTags[card.number]?.color || 'grey'
}

// 获取第一行预览（核心定义）
const getFirstLine = (meaning: string): string => {
  const lines = meaning.split('\n').filter(line => line.trim())
  const coreLine = lines.find(l => l.includes('核心'))
  if (coreLine) {
    return coreLine.replace(/^核心[:：]\s*/, '').slice(0, 50) + '...'
  }
  return lines[0]?.slice(0, 50) + '...' || '暂无描述'
}

// 获取核心定义
const getCoreMeaning = (meaning: string): string => {
  const lines = meaning.split('\n').filter(line => line.trim())
  const coreLine = lines.find(l => l.includes('核心'))
  if (coreLine) {
    const match = coreLine.match(/核心[：:]\s*(.+)/)
    if (match && match[1]) {
      return match[1].trim()
    }
    return coreLine.replace(/^核心[:：]\s*/, '').trim()
  }
  return '暂无核心定义'
}

// 获取牌意行（排除核心定义行和标题行，保留补充意思）
const getMeaningLines = (meaning: string): string[] => {
  const lines = meaning.split('\n').filter(line => line.trim())
  return lines.filter(line => {
    const trimmed = line.trim()
    if (trimmed.match(/^核心[：:]/)) return false
    if (trimmed === '描述' || trimmed === '描述：' || trimmed === '描述:') return false
    if (trimmed === '补充意思：' || trimmed === '补充意思:') return false
    if (trimmed === '') return false
    return true
  })
}

// 判断是否为关键要点（带数字编号或!!标记）
const isKeyPoint = (line: string): boolean => {
  return/^\d+\./.test(line.trim()) ||/^\d️⃣/.test(line.trim()) || line.includes('!!')
}

// 判断是否为普通描述
const isDescription = (line: string): boolean => {
  return line.trim().length > 0
}

// 清理行内容（移除数字标记和!!标记）
const cleanLine = (line: string): string => {
  return line
    .replace(/^\d+\.\s*/, '')
    .replace(/^\d️⃣\s*/, '')
    .replace(/!!/g, '')
    .replace(/^\+\s*/, '')
    .trim()
}

// 显示详情
const showDetail = (card: Card) => {
  selectedCard.value = card
  detailDialog.value = true
}

// 执行搜索
const doSearch = () => {
  // 搜索逻辑已在 computed 中处理
}

// 返回
const goBack = () => {
  emit('back')
}
</script>

<style scoped>
.card-reference-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card-item {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
}

.card-image {
  border-radius: 8px 8px 0 0;
}

.meaning-preview {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 44px;
}

.meaning-content {
  line-height: 1.8;
}

.meaning-line {
  padding: 4px 0;
}
</style>
