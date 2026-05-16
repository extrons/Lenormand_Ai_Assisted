<template>
  <div class="meaning-manager">
    <v-container fluid>
      <!-- 页面标题 -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold text-primary">
                <v-icon size="36" class="mr-2">mdi-cards-playing-outline</v-icon>
                牌意管理
              </h1>
              <p class="text-body-1 text-grey mt-2">
                自定义雷诺曼卡牌含义，支持导入导出，数据保存在本地浏览器
              </p>
            </div>
            <v-btn
              color="primary"
              variant="outlined"
              prepend-icon="mdi-arrow-left"
              @click="goBack"
            >
              返回占卜
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- 使用说明 -->
      <v-alert
        type="info"
        variant="tonal"
        class="mb-4"
        closable
      >
        <div class="font-weight-bold mb-1">使用说明：</div>
        <div class="text-body-2">
          1. 点击卡牌右上角的 <v-icon size="small">mdi-pencil</v-icon> 进入编辑模式<br>
          2. 修改核心意思和补充意思，回车添加新意思<br>
          3. 点击 <v-icon size="small">mdi-check</v-icon> 保存修改<br>
          4. 使用顶部按钮导出/导入 JSON 文件，方便备份和分享
        </div>
      </v-alert>

      <!-- 编辑器组件 -->
      <CardMeaningEditor />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import CardMeaningEditor from '@/components/CardMeaningEditor.vue'

const emit = defineEmits<{
  back: []
}>()

const goBack = () => {
  emit('back')
}
</script>

<style scoped>
.meaning-manager {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  padding: 20px 0;
}
</style>
