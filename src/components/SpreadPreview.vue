<<template>
  <div class="spread-preview-container">
    <div class="text-h6 mb-2 text-primary font-weight-bold text-center">
      {{ title }}
    </div>

    <div class="text-body-2 mb-4 text-grey text-center px-2">
      {{ description }}
    </div>

    <!-- 牌阵布局图示 -->
    <div class="spread-layout mb-4" :class="`layout-${mode}`">
      <div
        v-for="(pos, i) in positions"
        :key="i"
        class="layout-slot"
        :class="{ 'is-center': pos.isCenter }"
      >
        <div class="slot-number">{{ pos.number }}</div>
        <div class="slot-label">{{ pos.label }}</div>
      </div>
    </div>

    <!-- 位置含义说明 -->
    <div class="positions-info">
      <div
        v-for="(pos, i) in positions"
        :key="`info-${i}`"
        class="position-item"
      >
        <div class="position-number">{{ pos.number }}</div>
        <div class="position-detail">
          <div class="position-label">{{ pos.label }}</div>
          <div class="position-desc">{{ pos.description }}</div>
        </div>
      </div>
    </div>

    <!-- 解读提示 -->
    <div class="reading-tip mt-4">
      <v-icon icon="mdi-lightbulb-outline" color="warning" size="small" class="mr-2 flex-shrink-0" />
      <span class="text-body-2 text-grey-darken-1">{{ readingTip }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type DrawMode = 'three' | 'five' | 'nine'

const props = defineProps<{
  mode: DrawMode
}>()

interface Position {
  number: number
  label: string
  description: string
  isCenter?: boolean
}

const title = computed(() => {
  switch (props.mode) {
    case 'three': return '雷诺曼三牌阵'
    case 'five': return '雷诺曼五牌阵'
    case 'nine': return '雷诺曼九牌阵（九宫格）'
    default: return ''
  }
})

const description = computed(() => {
  switch (props.mode) {
    case 'three': return '最基础的线性牌阵，解读事情的起因-核心-结果'
    case 'five': return '横向排列五张牌，解读过去-现在-未来的完整时间线'
    case 'nine': return '3×3 网格牌阵，创建完整的情况肖像，适合复杂问题'
    default: return ''
  }
})

const positions = computed((): Position[] => {
  switch (props.mode) {
    case 'three':
      return [
        { number: 1, label: '起因 / 过去', description: '事情的开端、背景或过去的影响因素', isCenter: false },
        { number: 2, label: '核心 / 现在', description: '问题的核心主题、当前状态（主牌）', isCenter: true },
        { number: 3, label: '结果 / 未来', description: '事情的发展方向、最终结果或未来影响', isCenter: false },
      ]
    case 'five':
      return [
        { number: 1, label: '过去 / 起因', description: '事情的历史背景、过去的起因和已知因素', isCenter: false },
        { number: 2, label: '现状 / 障碍', description: '当前的障碍、挑战或需要面对的问题', isCenter: false },
        { number: 3, label: '核心 / 现在', description: '问题的核心主题、当前状态（主牌）', isCenter: true },
        { number: 4, label: '助力 / 资源', description: '可用的资源、助力或积极的影响因素', isCenter: false },
        { number: 5, label: '未来 / 结果', description: '事情的发展方向、最终结果或未来走向', isCenter: false },
      ]
    case 'nine':
      return [
        { number: 1, label: '客观因素', description: '不可控的外部客观环境', isCenter: false },
        { number: 2, label: '自我体验', description: '你当前的主观感受和体验', isCenter: false },
        { number: 3, label: '可控因素', description: '你可以主动影响和改变的部分', isCenter: false },
        { number: 4, label: '过去状态', description: '事情的历史背景和过往影响', isCenter: false },
        { number: 5, label: '核心 / 现在', description: '问题的核心、当前状态（指示牌）', isCenter: true },
        { number: 6, label: '未来结果', description: '事情的发展方向和最终结果', isCenter: false },
        { number: 7, label: '隐藏信息', description: '表面之下的隐藏因素和潜意识影响', isCenter: false },
        { number: 8, label: '即时影响', description: '当前正在发生的直接影响', isCenter: false },
        { number: 9, label: '深层发展', description: '事情深层次的演变和长期趋势', isCenter: false },
      ]
    default:
      return []
  }
})

const readingTip = computed(() => {
  switch (props.mode) {
    case 'three':
      return '解读方法：先分别解读 1+2 和 2+3 的组合，再综合成完整故事。也可使用镜像法 1+3 来辅助理解核心牌 2 的含义。'
    case 'five':
      return '解读方法：以中心牌（第3张）为核心，横向从左到右读取完整时间线。注意相邻牌之间的组合关系。'
    case 'nine':
      return '解读方法：横向读行（时间线），纵向读列（维度分析），对角读隐藏联系。中心牌是问题的核心。'
    default: return ''
  }
})
</script>

<style scoped>
.spread-preview-container {
  padding: 16px;
  max-width: 500px;
  margin: 0 auto;
}

/* 牌阵布局图示 */
.spread-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: rgba(103, 126, 234, 0.05);
  border-radius: 12px;
  min-height: 120px;
}

/* 三牌阵 - 水平排列 */
.layout-three {
  flex-direction: row;
}

/* 五牌阵 - 水平排列（修正） */
.layout-five {
  flex-direction: row;
  flex-wrap: wrap;
}

/* 九牌阵 - 3×3 网格 */
.layout-nine {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-width: 280px;
  margin: 0 auto;
  min-height: 280px;
}

.layout-slot {
  width: 70px;
  height: 95px;
  border: 2px dashed rgba(103, 126, 234, 0.3);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.layout-slot.is-center {
  border: 2px solid #667eea;
  background: rgba(102, 126, 234, 0.15);
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
}

.slot-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(103, 126, 234, 0.1);
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}

.layout-slot.is-center .slot-number {
  background: #667eea;
  color: white;
}

.slot-label {
  font-size: 11px;
  color: #666;
  text-align: center;
  line-height: 1.2;
  padding: 0 4px;
}

.layout-slot.is-center .slot-label {
  color: #667eea;
  font-weight: bold;
}

/* 位置说明列表 */
.positions-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.position-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

.position-item:hover {
  background: rgba(103, 126, 234, 0.05);
  border-left-color: #667eea;
}

.position-number {
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-radius: 50%;
  background: rgba(103, 126, 234, 0.1);
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  margin-top: 2px;
}

.position-detail {
  flex: 1;
}

.position-label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.position-desc {
  font-size: 12px;
  color: #888;
  line-height: 1.4;
}

/* 解读提示 */
.reading-tip {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  background: rgba(255, 193, 7, 0.08);
  border-radius: 8px;
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.reading-tip span {
  line-height: 1.5;
}

/* 响应式 */
@media (max-width: 600px) {
  .layout-slot {
    width: 60px;
    height: 80px;
  }

  .slot-label {
    font-size: 10px;
  }
}
</style>
