<template>
  <v-app :theme="currentTheme">
    <v-layout class="rounded rounded-md border">
      <v-app-bar title="LENORMAND" density="compact">
        <!-- 左侧返回按钮 -->
        <template v-slot:prepend v-if="currentView !== 'welcome'">
          <v-btn icon="mdi-arrow-left" @click="goBack"></v-btn>
        </template>

        <!-- 右侧主题切换按钮 -->
        <template v-slot:append>
          <v-btn
            @click="toggleTheme"
            variant="text"
            :prepend-icon="currentTheme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            :color="currentTheme === 'light' ? 'orange-darken-2' : 'indigo-lighten-3'"
            class="theme-toggle-btn"
          >
            {{ currentTheme === 'light' ? '白天' : '黑夜' }}
          </v-btn>
        </template>
      </v-app-bar>

      <v-navigation-drawer width="220" v-if="currentView !== 'welcome'">
        <v-list nav>
          <v-list-item
            title="抽三张牌"
            link
            prepend-icon="mdi-numeric-3-circle"
            :active="isActiveMode('three')"
            @click="switchMode('three')"
          ></v-list-item>
          <v-list-item
            title="抽五张牌"
            link
            prepend-icon="mdi-numeric-5-circle"
            :active="isActiveMode('five')"
            @click="switchMode('five')"
          ></v-list-item>
          <v-list-item
            title="抽九张牌"
            link
            prepend-icon="mdi-numeric-9-circle"
            :active="isActiveMode('nine')"
            @click="switchMode('nine')"
          ></v-list-item>
          <v-divider class="my-2"></v-divider>
          <v-list-item
            title="历史记录"
            link
            prepend-icon="mdi-history"
            :active="currentView === 'history'"
            @click="goHistory"
          ></v-list-item>
          <v-list-item
            title="牌意速查"
            link
            prepend-icon="mdi-book-open-page-variant"
            :active="currentView === 'reference'"
            @click="goReference"
          ></v-list-item>
          <v-list-item
            title="牌意管理"
            link
            prepend-icon="mdi-pencil"
            :active="currentView === 'meanings'"
            @click="goMeanings"
          ></v-list-item>
          <v-divider class="my-2"></v-divider>
          <v-list-item title="返回首页" link prepend-icon="mdi-home" @click="goWelcome"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="d-flex align-center justify-center" style="min-height: calc(100vh - 64px);">
        <v-container fluid class="pa-4 h-100">
          <v-sheet
            color="surface-light"
            rounded="lg"
            class="h-100 d-flex flex-column"
            elevation="1"
          >
            <div class="flex-grow-1 pa-4">
              <!-- 欢迎界面 -->
              <Welcome
                v-if="currentView === 'welcome'"
                @select="onSelectMode"
                @history="goHistory"
                @reference="goReference"
              />
              <!-- 抽牌界面 -->
              <Card
                v-else-if="currentView === 'draw'"
                :mode="currentMode"
                :key="cardKey"
                :initial-question="replayQuestion"
                @reset="goWelcome"
              />
              <!-- 历史记录界面 -->
              <History
                v-else-if="currentView === 'history'"
                @back="goWelcome"
                @replay="onReplay"
              />
              <!-- 牌意速查界面 -->
              <CardReference
                v-else-if="currentView === 'reference'"
                @back="goWelcome"
              />
              <!-- 牌意管理界面 -->
              <MeaningManager
                v-else-if="currentView === 'meanings'"
                @back="goWelcome"
              />
            </div>
          </v-sheet>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Welcome from "@/components/Welcome.vue";
import Card from "@/components/card.vue";
import History from "@/components/History.vue";
import CardReference from "@/components/CardReference.vue";
import MeaningManager from "@/views/MeaningManager.vue";

type DrawMode = 'three' | 'five' | 'nine'
type ViewType = 'welcome' | 'draw' | 'history' | 'reference' | 'meanings'

//当前显示的视图
const currentView = ref<ViewType>('welcome')

//当前抽牌模式
const currentMode = ref<DrawMode>('three')

//强制重新渲染抽牌组件的 key
const cardKey = ref(0)

//从历史记录重新占卜时的问题
const replayQuestion = ref('')

//当前主题（light/dark）
const currentTheme = ref<'light' | 'dark'>('light')

// 判断牌阵是否处于激活状态（只有在抽牌界面才高亮）
const isActiveMode = (mode: DrawMode) => {
  return currentView.value === 'draw' && currentMode.value === mode
}

//首页选择模式，进入抽牌界面
const onSelectMode = (mode: DrawMode) => {
  currentMode.value = mode
  currentView.value = 'draw'
  replayQuestion.value = ''
  cardKey.value++
}

//侧边栏切换模式
const switchMode = (mode: DrawMode) => {
  currentMode.value = mode
  replayQuestion.value = ''
  currentView.value = 'draw'
  cardKey.value++
}

//返回首页
const goWelcome = () => {
  currentView.value = 'welcome'
  replayQuestion.value = ''
}

//进入历史记录
const goHistory = () => {
  currentView.value = 'history'
}

//进入牌意速查
const goReference = () => {
  currentView.value = 'reference'
}

//进入牌意管理
const goMeanings = () => {
  currentView.value = 'meanings'
}

//顶部栏返回按钮
const goBack = () => {
  if (currentView.value === 'draw' || currentView.value === 'history' || currentView.value === 'reference' || currentView.value === 'meanings') {
    goWelcome()
  }
}

//从历史记录重新占卜
const onReplay = (question: string, mode: DrawMode) => {
  currentMode.value = mode
  replayQuestion.value = question
  currentView.value = 'draw'
  cardKey.value++
}

//切换主题
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  // 保存到本地存储
  localStorage.setItem('lenormand-theme', currentTheme.value)
}

//组件挂载时读取保存的主题
onMounted(() => {
  const savedTheme = localStorage.getItem('lenormand-theme') as 'light' | 'dark' | null
  if (savedTheme) {
    currentTheme.value = savedTheme
  }
})
</script>

<style scoped>
.theme-toggle-btn {
  text-transform: none;
  letter-spacing: 0;
}
</style>


