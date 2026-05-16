<<template>
  <div class="d-flex flex-column align-center pa-4" style="width: 100%;">
    <!-- 标题 -->
    <div class="text-h5 mb-2 text-primary font-weight-bold text-center">
      {{ title }}
    </div>

    <div class="text-body-2 mb-4 text-grey text-center">
      {{ subtitle }}
    </div>

    <!-- 问题输入框 -->
    <v-textarea
      v-model="question"
      :placeholder="placeholder"
      variant="outlined"
      rows="3"
      class="mb-4"
      style="max-width: 500px; width: 100%;"
      hide-details
      auto-grow
    ></v-textarea>

    <!-- 按钮区域 -->
    <div class="d-flex gap-3 justify-center flex-wrap">
      <!-- 预览牌阵按钮 -->
      <v-btn
        size="large"
        color="info"
        variant="outlined"
        elevation="1"
        @click="showPreview = true"
      >
        <v-icon icon="mdi-eye-outline" class="mr-1" />
        预览牌阵
      </v-btn>

      <!-- 开始抽牌按钮 -->
      <v-btn
        size="large"
        color="primary"
        elevation="2"
        :disabled="!question.trim()"
        @click="onStart"
      >
        <v-icon icon="mdi-cards-playing" class="mr-1" />
        开始抽牌
      </v-btn>
    </div>

    <!-- 牌阵预览弹窗 -->
    <v-dialog v-model="showPreview" width="520" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center pa-4">
          <v-icon icon="mdi-cards-outline" color="primary" class="mr-2" />
          <span class="text-h6">牌阵预览</span>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="showPreview = false" />
        </v-card-title>

        <v-card-text class="pa-0">
          <SpreadPreview :mode="props.mode" />
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            color="primary"
            @click="showPreview = false"
          >
            知道了，开始抽牌
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SpreadPreview from './SpreadPreview.vue'

type DrawMode = 'three' | 'five' | 'nine'

const props = defineProps<{
  mode: DrawMode
}>()

const emit = defineEmits<{
  start: [question: string]
}>()

const question = ref('')
const showPreview = ref(false)

const title = computed(() => {
  switch (props.mode) {
    case 'three': return '雷诺曼三张牌占卜'
    case 'five': return '雷诺曼五张牌占卜'
    case 'nine': return '雷诺曼九张牌占卜'
    default: return '雷诺曼占卜'
  }
})

const subtitle = computed(() => {
  switch (props.mode) {
    case 'three': return '从36张牌中选择3张，解读事情的起因-核心-结果'
    case 'five': return '从36张牌中选择5张，十字形解读过去-助力-核心-挑战-未来'
    case 'nine': return '从36张牌中选择9张，九宫格全面解读复杂问题'
    default: return ''
  }
})

const placeholder = '请输入您想咨询的问题'

const onStart = () => {
  if (!question.value.trim()) return
  emit('start', question.value.trim())
}
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}
</style>
