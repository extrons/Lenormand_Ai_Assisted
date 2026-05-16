<<template>
  <div class="d-flex flex-column align-center pa-2" style="min-height: 100%; width: 100%;">

    <!-- 步骤1：输入问题 -->
    <QuestionInput
      v-if="step === 1"
      :mode="props.mode"
      @start="onStart"
    />

    <!-- 步骤2：选卡区域 -->
    <template v-if="step === 2">
      <div class="text-h5 mb-2 text-primary font-weight-bold text-center" style="max-width: 90%;">
        {{ currentQuestion }}
      </div>

      <!-- 新增：牌阵说明折叠面板 -->
      <v-expansion-panels class="mb-3" style="max-width: 90%;">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-information-outline" color="info" class="mr-2" />
            <span class="text-body-2">当前牌阵说明（点击展开）</span>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <SpreadPreview :mode="props.mode" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <div class="text-body-2 mb-2 text-grey">
        选择第 {{ currentDrawOrder }} 张（已选 {{ selectedCount }} 张 / 共 {{ targetCount }} 张）
      </div>

      <!-- 已选卡牌区域 - 带高亮提示 -->
      <div class="selected-area mb-3">
        <div class="selected-slots" :class="`slots-${targetCount}`">
          <div
            v-for="i in targetCount"
            :key="i"
            class="selected-slot"
            :class="{
              'is-filled': selectedSlots[i-1],
              'is-current': getDisplayOrder(i) === currentDrawOrder && !selectedSlots[i-1]
            }"
          >
            <template v-if="selectedSlots[i-1]">
              <div
                class="selected-card-display"
                :class="{ 'fly-in': animatingSlots[i-1] }"
              >
                <div class="selected-card-back">
                  <div class="selected-card-number">{{ selectedSlots[i-1]!.displayNumber }}</div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="empty-slot" :class="{ 'highlight': getDisplayOrder(i) === currentDrawOrder }">
                <span class="slot-number">{{ getDisplayOrder(i) }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 36张卡牌扇形排列 -->
      <div class="cards-fan-container">
        <div class="cards-fan">
          <div
            v-for="displayNum in 36"
            :key="displayNum"
            class="fan-card-wrapper"
            :class="{
              'is-selected': isSelected(displayNum),
              'is-disabled': isSelectionComplete,
              'is-hovered': hoveredCard === displayNum
            }"
            :style="getCardWrapperStyle(displayNum)"
            @mouseenter="hoveredCard = displayNum"
            @mouseleave="hoveredCard = null"
            @click="!isSelected(displayNum) && !isSelectionComplete && selectCard(displayNum)"
          >
            <div
              class="fan-card"
              :class="{
                'animate-in': showAnimation,
                'is-hovered': hoveredCard === displayNum,
                'is-selected': isSelected(displayNum)
              }"
              :style="{ animationDelay: `${(displayNum - 1) * 15}ms` }"
            >
              <div class="fan-card-inner">
                <div class="fan-card-back">
                  <div class="fan-card-number">{{ displayNum }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 步骤3：揭晓牌 -->
    <template v-if="step === 3">
      <div class="text-h5 mb-3 text-primary font-weight-bold text-center" style="max-width: 90%;">
        {{ currentQuestion }}
      </div>

      <!-- 性别信息 -->
      <div v-if="hasGenderCard && hasGenderInfo" class="mb-3 text-body-2">
        <v-chip v-if="querentGender" class="mr-2" color="info" size="small">
          提问者：{{ querentGender }}
        </v-chip>
        <v-chip v-if="queriedGender" color="info" size="small">
          被提问者：{{ queriedGender }}
        </v-chip>
      </div>

      <!-- 揭晓的牌 - 按实际位置显示 -->
      <div class="reveal-container mb-4" :class="`reveal-${props.mode}`">
        <div
          v-for="(card, i) in displayCards"
          :key="i"
          class="reveal-card-wrapper"
        >
          <div class="reveal-card-container" :class="{ 'reveal': revealCards[i] }">
            <!-- 背面 -->
            <div class="reveal-card-back" v-if="!revealCards[i]">
              <div class="reveal-number">{{ i + 1 }}</div>
            </div>
            <!-- 正面 -->
            <v-card
              v-else
              class="result-card"
              :width="props.mode === 'nine' ? 100 : 140"
              :height="props.mode === 'nine' ? 160 : 220"
            >
              <v-img
                :src="card.image"
                :height="props.mode === 'nine' ? 120 : 170"
                cover
                class="rounded-t"
              ></v-img>
              <v-card-text class="text-center pa-1">
                <div class="text-subtitle-2 font-weight-bold" :class="{ 'text-caption': props.mode === 'nine' }">{{ card.name }}</div>
                <!-- 新增：位置标签 -->
                <div class="position-tag mt-1" :class="{ 'is-center': getPositionInfo(i)?.isCenter }">
                  {{ getPositionInfo(i)?.label }}
                </div>
                <v-chip
                  v-if="isGenderCard(card) && getGenderForCard(card)"
                  size="x-small"
                  color="primary"
                  class="mt-1"
                >
                  {{ getGenderForCard(card) }}
                </v-chip>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="d-flex gap-4">
        <v-btn
          v-if="allRevealed && !showGenderSelection"
          size="large"
          color="success"
          text="AI解析"
          @click="onAiAnalyzeClick"
          elevation="2"
          class="mr-4"
        ></v-btn>

        <v-btn
          size="large"
          color="grey"
          variant="outlined"
          text="返回首页"
          @click="goHome"
          elevation="1"
        ></v-btn>
      </div>
    </template>

    <!-- 性别选择弹窗 -->
    <v-dialog v-if="hasGenderCard" v-model="showGenderSelection" width="400" persistent>
      <v-card>
        <v-card-title class="text-h6 bg-primary text-white pa-4">
          检测到性别牌，请确认性别信息
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="mb-4">
            <div class="text-subtitle-1 mb-2">提问者的性别：</div>
            <v-select
              v-model="tempQuerentGender"
              :items="genderOptions"
              variant="outlined"
              density="comfortable"
              placeholder="请选择"
            ></v-select>
          </div>
          <div class="mb-2">
            <div class="text-subtitle-1 mb-2">被提问者的性别：</div>
            <v-select
              v-model="tempQueriedGender"
              :items="genderOptions"
              variant="outlined"
              density="comfortable"
              placeholder="请选择"
            ></v-select>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :disabled="!canConfirmGender"
            text="确认"
            @click="confirmGender"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- AI解析弹窗 - 不展示图片 -->
    <AiDialog
      v-model="showDialog"
      :question="currentQuestion"
      :cards="selectedCardsForAI"
      :querent-gender="querentGender"
      :queried-gender="queriedGender"
      :has-gender-card="hasGenderCard"
      :mode="props.mode"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import QuestionInput from './QuestionInput.vue'
import AiDialog from './AiDialog.vue'
import SpreadPreview from './SpreadPreview.vue'  // 新增导入
import { getAllCards, type Card } from '@/card-meanings'
import { getCardsForDisplay } from '@/card-meanings-editable'
import { saveHistory } from '@/db/history-db'

type DrawMode = 'three' | 'five' | 'nine'

interface SelectedSlot {
  displayNumber: number
  card: Card | undefined
}

const props = defineProps<{
  mode: DrawMode
  initialQuestion?: string
}>()

const emit = defineEmits<{
  reset: []
}>()

const step = ref(1)
const currentQuestion = ref('')
const showDialog = ref(false)
const hoveredCard = ref<number | null>(null)
const cardMapping = ref<Map<number, Card>>(new Map())
const selectedDisplayNumbers = ref<number[]>([])
const showAnimation = ref(false)
const animatingSlots = ref<boolean[]>([])
const isSelectionComplete = ref(false)
const revealCards = ref<boolean[]>([])
const hasSaved = ref(false)

// 抽牌顺序映射：数组索引是抽牌顺序（0开始），值是实际位置（0开始）
const drawOrderMap = computed((): number[] => {
  switch (props.mode) {
    case 'three':
      return [1, 0, 2] // 2-1-3（显示顺序：第2张、第1张、第3张）
    case 'five':
      return [2, 1, 3, 0, 4] // 3-2-4-1-5
    case 'nine':
      return [4, 3, 5, 1, 7, 0, 2, 6, 8] // 5-4-6-2-8-1-3-7-9
    default:
      return []
  }
})

// 当前应该抽第几张（1开始计数）
const currentDrawOrder = computed(() => {
  return selectedCount.value + 1
})

// 获取某个位置应该显示的数字（抽牌顺序编号）
const getDisplayOrder = (slotIndex: number): number => {
  const order = drawOrderMap.value.findIndex(pos => pos === slotIndex - 1)
  return order + 1
}

// 获取当前应该填充的位置索引（0开始）
const getCurrentSlotIndex = (): number => {
  if (selectedCount.value >= targetCount.value) return -1
  const slotIndex = drawOrderMap.value[selectedCount.value]
  return slotIndex !== undefined ? slotIndex : -1
}

const allRevealed = computed(() => {
  const result = revealCards.value.length > 0 && revealCards.value.every(v => v)
  return result
})

// 性别相关
const showGenderSelection = ref(false)
const genderOptions = ['男性', '女性', '未提及']
const tempQuerentGender = ref('')
const tempQueriedGender = ref('')
const querentGender = ref('')
const queriedGender = ref('')

const targetCount = computed(() => {
  switch (props.mode) {
    case 'three': return 3
    case 'five': return 5
    case 'nine': return 9
    default: return 3
  }
})

// 新增：位置信息映射（用于揭晓时显示位置标签）
const positionInfoMap = computed(() => {
  switch (props.mode) {
    case 'three':
      return [
        { label: '起因 / 过去', isCenter: false },
        { label: '核心 / 现在', isCenter: true },
        { label: '结果 / 未来', isCenter: false },
      ]
    case 'five':
      return [
        { label: '过去 / 已知', isCenter: false },
        { label: '上方 / 助力', isCenter: false },
        { label: '核心 / 现在', isCenter: true },
        { label: '下方 / 挑战', isCenter: false },
        { label: '未来 / 发展', isCenter: false },
      ]
    case 'nine':
      return [
        { label: '客观因素', isCenter: false },
        { label: '自我体验', isCenter: false },
        { label: '可控因素', isCenter: false },
        { label: '过去状态', isCenter: false },
        { label: '核心 / 现在', isCenter: true },
        { label: '未来结果', isCenter: false },
        { label: '隐藏信息', isCenter: false },
        { label: '即时影响', isCenter: false },
        { label: '深层发展', isCenter: false },
      ]
    default:
      return []
  }
})

// 新增：获取位置信息
const getPositionInfo = (index: number) => {
  return positionInfoMap.value[index]
}

// 监听全部揭晓后自动保存
watch(allRevealed, async (revealed) => {
  if (revealed && !hasSaved.value && selectedCards.value.length > 0) {
    await saveCurrentReading()
  }
})

const saveCurrentReading = async () => {
  try {
    const record = {
      question: currentQuestion.value,
      mode: props.mode,
      cards: selectedCardsForAI.value.map(c => ({
        number: c.number,
        name: c.name,
        image: c.image,
        meaning: c.meaning
      })),
      querentGender: querentGender.value || undefined,
      queriedGender: queriedGender.value || undefined
    }

    const id = await saveHistory(record)
    hasSaved.value = true
    console.log('历史记录保存成功, ID:', id)
  } catch (err) {
    console.error('保存历史记录失败:', err)
  }
}

// 组件挂载时处理 initialQuestion
if (props.initialQuestion) {
  nextTick(() => {
    onStart(props.initialQuestion!)
  })
}

const getCardWrapperStyle = (displayNum: number) => {
  const styles: Record<string, string | number> = {}
  if (hoveredCard.value === displayNum) {
    styles.zIndex = 100
  } else {
    styles.zIndex = displayNum
  }
  if (hoveredCard.value && hoveredCard.value !== displayNum) {
    const diff = displayNum - hoveredCard.value
    const absDiff = Math.abs(diff)
    if (absDiff === 1) {
      styles.transform = `translateX(${diff > 0 ? 15 : -15}px)`
    } else if (absDiff === 2) {
      styles.transform = `translateX(${diff > 0 ? 8 : -8}px)`
    }
  }
  return styles
}

const getCardByDisplayNumber = (displayNum: number): Card | undefined => {
  return cardMapping.value.get(displayNum)
}

// 按抽牌顺序排列的选中卡牌（用于保存和AI解析）
const selectedCards = computed(() => {
  return selectedDisplayNumbers.value
    .map(num => getCardByDisplayNumber(num))
    .filter((card): card is Card => card !== undefined)
})

// 按实际位置排列的卡牌（用于揭晓时显示）
const displayCards = computed(() => {
  const cards: (Card | null)[] = new Array(targetCount.value).fill(null)
  selectedDisplayNumbers.value.forEach((num, index) => {
    const slotIndex = drawOrderMap.value[index]
    if (slotIndex === undefined) return
    const card = getCardByDisplayNumber(num)
    if (card) {
      cards[slotIndex] = card
    }
  })
  return cards.filter((c): c is Card => c !== null)
})

// AI解析用的卡牌（按实际位置顺序，与显示一致）
const selectedCardsForAI = computed(() => {
  return displayCards.value
})

// 修复：selectedSlots 正确映射到实际位置
const selectedSlots = computed((): (SelectedSlot | null)[] => {
  // 初始化空数组
  const slots: (SelectedSlot | null)[] = new Array(targetCount.value).fill(null)

  // 按抽牌顺序遍历，将卡牌放到对应的实际位置
  selectedDisplayNumbers.value.forEach((num, drawIndex) => {
    const slotIndex = drawOrderMap.value[drawIndex]
    if (slotIndex === undefined) return
    slots[slotIndex] = {
      displayNumber: num,
      card: getCardByDisplayNumber(num)
    }
  })

  return slots
})

const selectedCount = computed(() => selectedDisplayNumbers.value.length)

const hasGenderCard = computed(() => {
  return selectedCards.value.some(card => isGenderCard(card))
})

const hasGenderInfo = computed(() => querentGender.value || queriedGender.value)
const canConfirmGender = computed(() => tempQuerentGender.value && tempQueriedGender.value)

const isGenderCard = (card: Card): boolean => {
  return card.number === 28 || card.number === 29
}

const getGenderForCard = (card: Card): string => {
  if (card.number === 28) return querentGender.value
  if (card.number === 29) return queriedGender.value
  return ''
}

const isSelected = (displayNum: number): boolean => {
  return selectedDisplayNumbers.value.includes(displayNum)
}

function onStart(question: string) {
  console.log('开始新的占卜:', question, '模式:', props.mode)

  // 重置所有状态
  currentQuestion.value = question
  step.value = 2
  hasSaved.value = false

  // 重置卡牌映射
  const currentCards = getCardsForDisplay()
  const shuffled = [...currentCards].sort(() => Math.random() - 0.5)
  const newMapping = new Map<number, Card>()
  shuffled.forEach((card, index) => {
    newMapping.set(index + 1, card)
  })
  cardMapping.value = newMapping

  // 重置选择状态
  selectedDisplayNumbers.value = []
  showAnimation.value = false
  animatingSlots.value = new Array(targetCount.value).fill(false)
  revealCards.value = new Array(targetCount.value).fill(false)
  isSelectionComplete.value = false
  hoveredCard.value = null

  // 重置性别
  querentGender.value = ''
  queriedGender.value = ''
  tempQuerentGender.value = ''
  tempQueriedGender.value = ''

  setTimeout(() => {
    showAnimation.value = true
  }, 50)
}

// 修复：selectCard 正确设置动画
const selectCard = (displayNum: number) => {
  if (isSelectionComplete.value) return
  if (isSelected(displayNum)) return

  // 找到当前这张牌应该放在哪个实际位置
  const slotIndex = getCurrentSlotIndex()
  if (slotIndex === -1) return

  console.log('选择卡牌:', displayNum, '放到位置:', slotIndex + 1, '抽牌顺序:', currentDrawOrder.value)

  selectedDisplayNumbers.value.push(displayNum)

  // 按实际位置索引设置动画 - 这是修复的关键！
  animatingSlots.value[slotIndex] = true

  if (selectedCount.value === targetCount.value) {
    isSelectionComplete.value = true
    setTimeout(() => {
      step.value = 3
      startAutoReveal()
    }, 800)
  }
}

const startAutoReveal = () => {
  console.log('开始揭晓动画, 目标数量:', targetCount.value)
  revealCards.value = new Array(targetCount.value).fill(false)
  const revealSequence = Array.from({ length: targetCount.value }, (_, i) => i)
  revealSequence.forEach((index, i) => {
    setTimeout(() => {
      console.log('揭晓第', index + 1, '张牌')
      revealCards.value[index] = true
    }, i * 500)
  })
}

const onAiAnalyzeClick = () => {
  if (hasGenderCard.value) {
    showGenderSelection.value = true
  } else {
    showDialog.value = true
  }
}

const confirmGender = () => {
  querentGender.value = tempQuerentGender.value
  queriedGender.value = tempQueriedGender.value
  showGenderSelection.value = false
  showDialog.value = true
}

const goHome = () => {
  emit('reset')
}
</script>

<style scoped>
.selected-area {
  padding: 16px 24px;
  background: rgba(103, 126, 234, 0.06);
  border-radius: 12px;
  border: 2px dashed rgba(103, 126, 234, 0.3);
}

.selected-slots {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.selected-slots.slots-5 {
  gap: 10px;
}

.selected-slots.slots-9 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-width: 200px;
}

.selected-slot {
  width: 55px;
  height: 82px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

/* 当前要抽的位置高亮 */
.selected-slot.is-current {
  transform: scale(1.1);
}

.empty-slot {
  width: 100%;
  height: 100%;
  border: 2px dashed #ccc;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
}

/* 高亮提示 */
.empty-slot.highlight {
  border: 3px solid #667eea;
  background: rgba(102, 126, 234, 0.15);
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.4);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 15px rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 0 25px rgba(102, 126, 234, 0.8);
  }
}

.slot-number {
  font-size: 18px;
  color: #bbb;
  font-weight: bold;
}

.empty-slot.highlight .slot-number {
  color: #667eea;
  font-weight: bold;
  font-size: 20px;
}

.selected-card-display {
  width: 55px;
  height: 82px;
  opacity: 0;
  transform: scale(0.6) translateY(-40px);
}

.selected-card-display.fly-in {
  animation: flyToSlot 0.5s ease-out forwards;
}

@keyframes flyToSlot {
  0% {
    opacity: 0;
    transform: scale(0.6) translateY(-40px) rotateY(180deg);
  }
  60% {
    opacity: 0.9;
    transform: scale(1.1) translateY(5px) rotateY(90deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0) rotateY(0);
  }
}

.selected-card-back {
  width: 100%;
  height: 100%;
  background: url('/card-back.jpg') center center / cover no-repeat;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
}

.selected-card-number {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  font-size: 18px;
  font-weight: bold;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 扇形排列的卡牌容器 - 紧凑版本 */
.cards-fan-container {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  overflow-x: auto;
  min-height: 220px;
}

.cards-fan {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
  padding: 20px 40px;
  height: 160px;
}

/* 每张卡牌的包装器 - 紧凑排列 */
.fan-card-wrapper {
  position: relative;
  margin-left: -30px;
  cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.fan-card-wrapper:first-child {
  margin-left: 0;
}

.fan-card-wrapper.is-selected {
  opacity: 0.3;
  pointer-events: none;
}

.fan-card-wrapper.is-disabled {
  cursor: not-allowed;
}

/* 卡牌本体 - 较小尺寸 */
.fan-card {
  width: 60px;
  height: 90px;
  position: relative;
  opacity: 0;
  transform: translateY(20px) rotateZ(-2deg);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fan-card.animate-in {
  animation: fanCardAppear 0.5s ease-out forwards;
}

@keyframes fanCardAppear {
  0% {
    opacity: 0;
    transform: translateY(30px) rotateZ(-8deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateZ(-2deg);
  }
}

/* 悬停效果 - 仅悬停的牌轻微上浮 */
.fan-card.is-hovered {
  transform: translateY(-20px) scale(1.08) rotateZ(0deg) !important;
}

.fan-card.is-selected {
  transform: scale(0.9) rotateZ(-2deg);
  filter: grayscale(100%);
}

/* 卡牌内部容器 */
.fan-card-inner {
  width: 100%;
  height: 100%;
  transition: box-shadow 0.3s ease;
  border-radius: 6px;
}

.fan-card.is-hovered .fan-card-inner {
  box-shadow:
    0 20px 40px rgba(103, 126, 234, 0.3),
    0 8px 16px rgba(0, 0, 0, 0.2);
}

/* 卡牌背面 */
.fan-card-back {
  width: 60px;
  height: 90px;
  background: url('/card-back.jpg') center center / cover no-repeat;
  border-radius: 6px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 4px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

/* 卡牌编号 - 左上角 */
.fan-card-number {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  font-size: 14px;
  font-weight: bold;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

/* 揭晓区域样式 */
.reveal-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.reveal-five {
  gap: 12px;
}

.reveal-nine {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-width: 340px;
}

.reveal-nine .reveal-card-wrapper {
  width: 100px;
}

.reveal-card-wrapper {
  perspective: 1000px;
}

.reveal-card-container {
  width: 140px;
  height: 220px;
  position: relative;
}

.reveal-nine .reveal-card-container {
  width: 100px;
  height: 160px;
}

.reveal-card-back {
  width: 140px;
  height: 220px;
  background: url('/card-back.jpg') center center / cover no-repeat;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.reveal-nine .reveal-card-back {
  width: 100px;
  height: 160px;
  border-radius: 8px;
}

.reveal-number {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  font-size: 24px;
  font-weight: bold;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reveal-nine .reveal-number {
  font-size: 20px;
  width: 40px;
  height: 40px;
}

.result-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  animation: flipReveal 0.6s ease-out;
}

/* 新增：位置标签样式 */
.position-tag {
  font-size: 10px;
  color: #888;
  background: rgba(0, 0, 0, 0.04);
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.position-tag.is-center {
  color: #667eea;
  background: rgba(102, 126, 234, 0.12);
  font-weight: bold;
}

@keyframes flipReveal {
  0% {
    opacity: 0;
    transform: rotateY(90deg);
  }
  100% {
    opacity: 1;
    transform: rotateY(0);
  }
}

.gap-4 {
  gap: 16px;
}

.mr-4 {
  margin-right: 16px;
}

/* 响应式调整 - 更紧凑 */
@media (max-width: 900px) {
  .fan-card-wrapper {
    margin-left: -30px;
  }

  .fan-card {
    width: 55px;
    height: 85px;
  }

  .fan-card-back {
    width: 55px;
    height: 85px;
  }

  .cards-fan {
    padding: 15px 30px;
  }
}

@media (max-width: 600px) {
  .fan-card-wrapper {
    margin-left: -32px;
  }

  .fan-card {
    width: 50px;
    height: 75px;
  }

  .fan-card-back {
    width: 50px;
    height: 75px;
  }

  .fan-card-number {
    font-size: 12px;
    width: 18px;
    height: 18px;
  }

  .cards-fan {
    padding: 10px 20px;
    height: 140px;
  }

  .cards-fan-container {
    min-height: 180px;
    padding: 30px 10px;
  }
}
</style>
