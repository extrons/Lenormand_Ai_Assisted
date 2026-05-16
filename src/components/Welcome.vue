<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <div class="welcome-title">雷诺曼占卜</div>
      <div class="welcome-subtitle">选择牌阵开始占卜</div>

      <div class="card-options">
        <div
          v-for="option in options"
          :key="option.mode"
          class="card"
          @click="selectMode(option.mode)"
        >
          <!-- 卡片内容 -->
          <div class="card-header">
            <span class="option-icon">{{ option.icon }}</span>
            <span class="option-title">{{ option.title }}</span>
          </div>

          <span class="temp">{{ option.mode === 'three' ? '3' : option.mode === 'five' ? '5' : '9' }}</span>
          <div class="temp-scale">
            <span>{{ option.desc }}</span>
          </div>
        </div>
      </div>

      <!-- 功能按钮区域 -->
      <div class="action-section">
        <v-btn
          variant="outlined"
          color="primary"
          prepend-icon="mdi-history"
          @click="goHistory"
          class="action-btn"
        >
          历史记录
        </v-btn>

        <v-btn
          variant="outlined"
          color="info"
          prepend-icon="mdi-book-open-page-variant"
          @click="goReference"
          class="action-btn"
        >
          牌意速查
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type DrawMode = 'three' | 'five' | 'nine'

const emit = defineEmits<{
  select: [mode: DrawMode]
  history: []
  reference: []
}>()

const options = [
  {
    mode: 'three' as DrawMode,
    icon: '3️⃣',
    title: '三张牌',
    desc: '起因-核心-结果，快速解读问题本质'
  },
  {
    mode: 'five' as DrawMode,
    icon: '5️⃣',
    title: '五张牌',
    desc: '时间线发展，看清事情来龙去脉'
  },
  {
    mode: 'nine' as DrawMode,
    icon: '9️⃣',
    title: '九张牌',
    desc: '3×3方阵，深度剖析问题全貌'
  }
]

const selectMode = (mode: DrawMode) => {
  emit('select', mode)
}

const goHistory = () => {
  emit('history')
}

const goReference = () => {
  emit('reference')
}
</script>

<style scoped>
.welcome-container {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.welcome-content {
  text-align: center;
  max-width: 1200px;
}

.welcome-title {
  font-size: 48px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
}

.welcome-subtitle {
  font-size: 20px;
  color: #666;
  margin-bottom: 60px;
}

.card-options {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

/* 紫色统一风格卡片 */
.card {
  width: 350px;
  height: 235px;
  position: relative;
  padding: 25px;
  /* 紫色渐变背景 */
  background: radial-gradient(178.94% 106.41% at 26.42% 106.41%, #E5E1FF 0%, rgba(255, 255, 255, 0) 71.88%), #FCFCFF;
  box-shadow: 0px 155px 62px rgba(0, 0, 0, 0.01), 0px 87px 52px rgba(0, 0, 0, 0.05), 0px 39px 39px rgba(0, 0, 0, 0.09), 0px 10px 21px rgba(0, 0, 0, 0.1);
  border-radius: 23px;
  transition: all 0.8s cubic-bezier(0.15, 0.83, 0.66, 1);
  cursor: pointer;
  border: none;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0px 155px 62px rgba(102, 126, 234, 0.03),
  0px 87px 52px rgba(102, 126, 234, 0.07),
  0px 39px 39px rgba(102, 126, 234, 0.11),
  0px 10px 21px rgba(102, 126, 234, 0.12);
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-icon {
  word-break: break-all;
  font-weight: 800;
  font-size: 32px;
  line-height: 135%;
  color: #764BA2; /* 紫色 */
  margin-bottom: 5px;
}

.option-title {
  font-weight: 700;
  font-size: 20px;
  line-height: 135%;
  color: #667EEA; /* 紫色 */
}

.temp {
  position: absolute;
  left: 25px;
  bottom: 12px;
  font-weight: 700;
  font-size: 64px;
  line-height: 77px;
  color: #665DF3; /* 统一紫色 */
}

.temp-scale {
  width: 180px;
  height: 36px;
  position: absolute;
  right: 25px;
  bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.12); /* 淡紫色 */
  border-radius: 9px;
  padding: 0 10px;
}

.temp-scale span {
  font-weight: 700;
  font-size: 12px;
  line-height: 134.49%;
  color: #667EEA;
  text-align: center;
}

.action-section {
  margin-top: 40px;
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  min-width: 150px;
}
</style>
