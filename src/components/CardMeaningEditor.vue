<template>
  <div class="meaning-editor">
    <!-- 顶部工具栏 -->
    <v-card class="mb-4" flat>
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" sm="6">
            <div class="text-h6 font-weight-bold">
              <v-icon class="mr-2" color="primary">mdi-book-open-variant</v-icon>
              牌意编辑器
            </div>
            <div class="text-caption text-grey mt-1">
              共 {{ cards.length }} 张卡牌，{{ editingId ? '正在编辑' : '浏览模式' }}
            </div>
          </v-col>
          <v-col cols="12" sm="6" class="d-flex gap-2 justify-end">
            <v-btn
              color="primary"
              variant="outlined"
              prepend-icon="mdi-download"
              @click="exportData"
            >
              导出JSON
            </v-btn>
            <v-btn
              color="success"
              variant="outlined"
              prepend-icon="mdi-upload"
              @click="showImport = true"
            >
              导入JSON
            </v-btn>
            <v-btn
              color="warning"
              variant="outlined"
              prepend-icon="mdi-refresh"
              @click="confirmReset"
            >
              重置默认
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 搜索过滤 -->
    <v-text-field
      v-model="searchQuery"
      label="搜索卡牌名称或意思"
      prepend-inner-icon="mdi-magnify"
      clearable
      variant="outlined"
      class="mb-4"
      density="comfortable"
    ></v-text-field>

    <!-- 卡牌网格 -->
    <v-row>
      <v-col
        v-for="card in filteredCards"
        :key="card.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="card-item"
          :class="{ 'is-editing': editingId === card.id }"
          hover
        >
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar size="48" rounded="lg">
                <v-img :src="card.image" cover></v-img>
              </v-avatar>
            </template>
            <v-card-title class="text-truncate">
              {{ card.id }}. {{ card.name }}
            </v-card-title>
            <template v-slot:append>
              <v-btn
                :icon="editingId === card.id ? 'mdi-check' : 'mdi-pencil'"
                :color="editingId === card.id ? 'success' : 'primary'"
                variant="text"
                size="small"
                @click="toggleEdit(card.id)"
              ></v-btn>
            </template>
          </v-card-item>

          <v-card-text>
            <!-- 核心意思 -->
            <div class="mb-3">
              <div class="text-caption text-grey mb-1">核心意思</div>
              <div v-if="editingId !== card.id" class="text-body-1 font-weight-medium">
                {{ card.core }}
              </div>
              <v-text-field
                v-else
                v-model="editForm.core"
                label="核心意思"
                variant="outlined"
                density="compact"
                hide-details
                class="mb-2"
              ></v-text-field>
            </div>

            <!-- 补充意思列表 -->
            <div>
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="text-caption text-grey">补充意思</div>
                <div class="text-caption text-grey">{{ card.meanings.length }} 条</div>
              </div>

              <div v-if="editingId !== card.id">
                <v-chip
                  v-for="(m, i) in card.meanings"
                  :key="i"
                  size="small"
                  class="mr-1 mb-1"
                  color="primary"
                  variant="tonal"
                >
                  {{ m }}
                </v-chip>
              </div>

              <!-- 编辑模式：补充意思可编辑 -->
              <div v-else>
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="(m, i) in editForm.meanings"
                    :key="i"
                    class="px-0"
                  >
                    <template v-slot:prepend>
                      <span class="text-caption text-grey mr-2">{{ i + 1 }}.</span>
                    </template>
                    <v-text-field
                      v-model="editForm.meanings[i]"
                      variant="outlined"
                      density="compact"
                      hide-details
                      class="flex-grow-1"
                    >
                      <template v-slot:append-inner>
                        <v-btn
                          icon="mdi-delete"
                          size="x-small"
                          color="error"
                          variant="text"
                          @click="removeMeaning(i)"
                        ></v-btn>
                      </template>
                    </v-text-field>
                  </v-list-item>
                </v-list>

                <!-- 新增意思 -->
                <v-text-field
                  v-model="newMeaning"
                  label="新增补充意思（回车添加）"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="mt-2"
                  append-inner-icon="mdi-plus"
                  @keyup.enter="addNewMeaning"
                  @click:append-inner="addNewMeaning"
                ></v-text-field>
              </div>
            </div>
          </v-card-text>

          <!-- 编辑模式操作按钮 -->
          <v-card-actions v-if="editingId === card.id">
            <v-spacer></v-spacer>
            <v-btn color="success" variant="elevated" @click="saveCard">
              <v-icon class="mr-1">mdi-content-save</v-icon>
              保存
            </v-btn>
            <v-btn color="grey" variant="text" @click="cancelEdit">
              取消
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 导入弹窗 -->
    <v-dialog v-model="showImport" max-width="600">
      <v-card>
        <v-card-title class="bg-primary text-white pa-4">
          导入牌意 JSON
        </v-card-title>
        <v-card-text class="pa-4">
          <v-file-input
            v-model="importFile"
            accept=".json"
            label="选择 JSON 文件"
            variant="outlined"
            show-size
          ></v-file-input>
          <v-alert type="info" class="mt-2" density="compact" variant="tonal">
            导入将覆盖当前所有牌意，建议先导出备份。
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn text @click="showImport = false">取消</v-btn>
          <v-btn color="primary" :disabled="!importFile" @click="doImport">
            确认导入
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 重置确认弹窗 -->
    <v-dialog v-model="showResetConfirm" max-width="400">
      <v-card>
        <v-card-title class="text-warning">确认重置</v-card-title>
        <v-card-text>
          确定要重置为默认牌意吗？所有自定义修改将丢失！
          <br><br>
          建议先导出当前牌意作为备份。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showResetConfirm = false">取消</v-btn>
          <v-btn color="warning" @click="doReset">确认重置</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 提示消息 -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  getMeanings,
  saveMeanings,
  exportMeanings,
  importMeanings,
  resetToDefault,
  type CardMeaning
} from '@/card-meanings-editable'

const cards = ref(getMeanings() as CardMeaning[])
const editingId = ref<number | null>(null)
const searchQuery = ref('')
const newMeaning = ref('')

const editForm = ref({
  id: 0,
  name: '',
  image: '',
  core: '',
  meanings: [] as string[]
} as CardMeaning)

const showImport = ref(false)
const showResetConfirm = ref(false)
const importFile = ref<File[] | null>(null)

const snackbar = ref<{ show: boolean; text: string; color: 'success' | 'error' }>({ show: false, text: '', color: 'success' })

const filteredCards = computed(() => {
  if (!searchQuery.value) return cards.value
  const q = searchQuery.value.toLowerCase()
  return cards.value.filter(c =>
    c.name.includes(q) ||
    c.core.includes(q) ||
    c.meanings.some(m => m.includes(q))
  )
})

const toggleEdit = (id: number) => {
  if (editingId.value === id) {
    saveCard()
    return
  }

  const card = cards.value.find(c => c.id === id)
  if (!card) return

  editingId.value = id
  editForm.value = {
    id: card.id,
    name: card.name,
    image: card.image,
    core: card.core,
    meanings: [...card.meanings]
  }
  newMeaning.value = ''
}

const saveCard = () => {
  if (!editingId.value) return

  const idx = cards.value.findIndex(c => c.id === editingId.value)
  if (idx === -1) return

  // 过滤空的意思
  const cleanedMeanings = editForm.value.meanings.filter(m => m.trim())

  // 创建新的卡牌对象
  const updatedCard: CardMeaning = {
    ...editForm.value,
    meanings: cleanedMeanings
  }

  // 使用 splice 替换数组元素，确保响应式更新
  cards.value.splice(idx, 1, updatedCard)

  // 保存到 localStorage
  saveMeanings([...cards.value])

  editingId.value = null
  showMessage('已保存')
}

const cancelEdit = () => {
  editingId.value = null
  newMeaning.value = ''
}

const addNewMeaning = () => {
  const text = newMeaning.value.trim()
  if (!text) return
  editForm.value.meanings.push(text)
  newMeaning.value = ''
}

const removeMeaning = (index: number) => {
  editForm.value.meanings.splice(index, 1)
}

const exportData = () => {
  const data = exportMeanings()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `lenormand-meanings-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  showMessage('牌意已导出')
}

const doImport = async () => {
  if (!importFile.value?.[0]) return
  try {
    const text = await importFile.value[0].text()
    if (importMeanings(text)) {
      const freshData = getMeanings()
      cards.value.splice(0, cards.value.length, ...freshData)
      showImport.value = false
      importFile.value = null
      showMessage('导入成功')
    } else {
      showMessage('导入失败，请检查文件格式', 'error')
    }
  } catch {
    showMessage('导入失败', 'error')
  }
}

const confirmReset = () => {
  showResetConfirm.value = true
}

const doReset = () => {
  resetToDefault()
  // 重新获取数据并替换整个数组，确保响应式
  const freshData = getMeanings()
  cards.value.splice(0, cards.value.length, ...freshData)
  editingId.value = null
  showResetConfirm.value = false
  showMessage('已重置为默认牌意')
}

const showMessage = (text: string, color: 'success' | 'error' = 'success') => {
  snackbar.value = { show: true, text, color }
}
</script>

<style scoped>
.meaning-editor {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.card-item {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.card-item.is-editing {
  border-color: #667eea;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2) !important;
}

.gap-2 {
  gap: 8px;
}
</style>
