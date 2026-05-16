<template>
  <div class="history-container">
    <!-- 标题 -->
    <div class="text-h4 mb-6 text-primary font-weight-bold text-center">
      历史记录
    </div>

    <!-- 调试信息（开发时查看，确认数据加载状态） -->
    <v-alert v-if="debugInfo" type="info" class="mb-4" closable @click:close="debugInfo = ''">
      {{ debugInfo }}
    </v-alert>

    <!-- 统计卡片 -->
    <v-row class="mb-6">
      <v-col cols="12" sm="4">
        <v-card color="primary" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h3 font-weight-bold">{{ stats.total }}</div>
            <div class="text-body-1">总次数</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="success" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h3 font-weight-bold">{{ stats.thisMonth }}</div>
            <div class="text-body-1">本月</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="info" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h3 font-weight-bold">{{ stats.favoriteMode }}</div>
            <div class="text-body-1">最爱牌阵</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 工具栏 -->
    <v-card class="mb-4" flat>
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" sm="3">
            <v-select
              v-model="filterMode"
              :items="modeOptions"
              label="牌阵筛选"
              clearable
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="5">
            <v-text-field
              v-model="searchQuery"
              label="搜索问题"
              prepend-inner-icon="mdi-magnify"
              clearable
              variant="outlined"
              density="comfortable"
              hide-details
              @keyup.enter="doSearch"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" class="d-flex gap-2 justify-end">
            <v-btn color="primary" variant="outlined" @click="refreshData">
              <v-icon>mdi-refresh</v-icon>
              刷新
            </v-btn>
            <v-btn color="primary" variant="outlined" @click="showImportDialog = true">
              <v-icon>mdi-upload</v-icon>
              导入
            </v-btn>
            <v-btn color="primary" variant="outlined" @click="exportData">
              <v-icon>mdi-download</v-icon>
              导出
            </v-btn>
            <v-btn color="error" variant="outlined" @click="confirmClear" :disabled="!history.length">
              <v-icon>mdi-delete-sweep</v-icon>
              清空
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 历史列表 -->
    <v-data-iterator
      :items="filteredHistory"
      :items-per-page="itemsPerPage"
      :page="page"
    >
      <template v-slot:default="{ items }">
        <v-row>
          <v-col v-for="item in items" :key="item.raw.id" cols="12" md="6" lg="4">
            <v-card class="history-card" hover @click="viewDetail(item.raw)">
              <v-card-item>
                <template v-slot:prepend>
                  <v-avatar color="primary" size="40">
                    <span class="text-h6">{{ getModeIcon(item.raw.mode) }}</span>
                  </v-avatar>
                </template>
                <v-card-title class="text-truncate">
                  {{ item.raw.question }}
                </v-card-title>
                <template v-slot:append>
                  <v-chip :color="getModeColor(item.raw.mode)" size="small" label>
                    {{ getModeLabel(item.raw.mode) }}
                  </v-chip>
                </template>
              </v-card-item>

              <v-card-text>
                <!-- 卡牌缩略图 -->
                <div class="d-flex gap-2 mb-3">
                  <v-tooltip v-for="(card, idx) in item.raw.cards.slice(0, 4)" :key="idx" :text="card.name">
                    <template v-slot:activator="{ props }">
                      <v-avatar v-bind="props" size="48" rounded="lg">
                        <v-img :src="card.image" cover></v-img>
                      </v-avatar>
                    </template>
                  </v-tooltip>
                  <v-avatar v-if="item.raw.cards.length > 4" size="48" rounded="lg" color="grey-lighten-2">
                    <span class="text-caption text-grey">+{{ item.raw.cards.length - 4 }}</span>
                  </v-avatar>
                </div>

                <!-- 时间和性别信息 -->
                <div class="d-flex align-center justify-space-between">
                  <div class="text-caption text-grey">
                    <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                    {{ formatDate(item.raw.createdAt) }}
                  </div>
                  <div v-if="item.raw.querentGender || item.raw.queriedGender">
                    <v-chip v-if="item.raw.querentGender" size="x-small" color="info" variant="flat" class="mr-1">
                      问:{{ item.raw.querentGender }}
                    </v-chip>
                    <v-chip v-if="item.raw.queriedGender" size="x-small" color="warning" variant="flat">
                      被:{{ item.raw.queriedGender }}
                    </v-chip>
                  </div>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-btn variant="text" color="primary" size="small" @click.stop="viewDetail(item.raw)">
                  查看详情
                </v-btn>
                <v-btn variant="text" color="success" size="small" @click.stop="reuseQuestion(item.raw)">
                  再问一次
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon="mdi-delete" size="small" color="error" variant="text" @click.stop="deleteItem(item.raw.id)"></v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <div class="d-flex align-center justify-center pa-4" v-if="filteredHistory.length > itemsPerPage">
          <v-pagination
            v-model="page"
            :length="Math.ceil(filteredHistory.length / itemsPerPage)"
            rounded="circle"
          ></v-pagination>
        </div>
      </template>

      <template v-slot:no-data>
        <v-empty-state
          icon="mdi-history"
          title="暂无历史记录"
          text="快去进行一次占卜吧！"
          class="my-8"
        >
          <v-btn color="primary" @click="goBack">开始占卜</v-btn>
        </v-empty-state>
      </template>
    </v-data-iterator>

    <!-- 详情弹窗 -->
    <v-dialog v-model="detailDialog" max-width="900" scrollable>
      <v-card v-if="selectedReading">
        <v-card-title class="bg-primary text-white pa-4 d-flex align-center">
          <span>占卜详情</span>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" color="white" @click="detailDialog = false"></v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <!-- 问题信息 -->
          <v-sheet color="surface-light" rounded="lg" class="pa-4 mb-4">
            <div class="text-subtitle-2 text-grey mb-1">占卜问题</div>
            <div class="text-h6 font-weight-bold">{{ selectedReading.question }}</div>
            <div class="d-flex align-center gap-4 mt-2">
              <div class="text-caption">
                <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                {{ formatDateFull(selectedReading.createdAt) }}
              </div>
              <v-chip :color="getModeColor(selectedReading.mode)" size="small">
                {{ getModeLabel(selectedReading.mode) }}
              </v-chip>
            </div>
          </v-sheet>

          <!-- 性别信息 -->
          <div v-if="selectedReading.querentGender || selectedReading.queriedGender" class="mb-4">
            <v-chip v-if="selectedReading.querentGender" color="info" class="mr-2">
              <v-icon start>mdi-account-question</v-icon>
              提问者：{{ selectedReading.querentGender }}
            </v-chip>
            <v-chip v-if="selectedReading.queriedGender" color="warning">
              <v-icon start>mdi-account-search</v-icon>
              被提问者：{{ selectedReading.queriedGender }}
            </v-chip>
          </div>

          <!-- 牌阵重现 -->
          <div class="mb-4">
            <div class="text-subtitle-1 font-weight-bold mb-3">牌阵</div>
            <div class="cards-display" :class="`display-${selectedReading.mode}`">
              <v-card
                v-for="(card, i) in selectedReading.cards"
                :key="i"
                class="result-card"
                width="140"
                hover
              >
                <v-img :src="card.image" height="170" cover class="rounded-t"></v-img>
                <v-card-text class="pa-2 text-center">
                  <div class="font-weight-bold text-subtitle-2">{{ card.name }}</div>
                  <div class="text-caption text-grey">第{{ i + 1 }}张</div>
                </v-card-text>
                <v-tooltip activator="parent" location="bottom" max-width="300">
                  <div class="text-body-2" style="white-space: pre-line">{{ card.meaning }}</div>
                </v-tooltip>
              </v-card>
            </div>
          </div>

          <!-- 备注 -->
          <v-textarea
            v-model="editNotes"
            label="添加备注（点击保存）"
            rows="3"
            variant="outlined"
            class="mb-4"
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-btn color="success" variant="elevated" @click="saveNotes" :disabled="!notesChanged">
            <v-icon class="mr-2">mdi-content-save</v-icon>
            保存备注
          </v-btn>
          <v-btn color="primary" variant="outlined" @click="copyToClipboard">
            <v-icon class="mr-2">mdi-content-copy</v-icon>
            复制解析模板
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="elevated" @click="reuseQuestion(selectedReading)">
            <v-icon class="mr-2">mdi-restart</v-icon>
            用此问题重新占卜
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 导入弹窗 -->
    <v-dialog v-model="showImportDialog" max-width="900" scrollable>
      <v-card>
        <v-card-title class="bg-primary text-white pa-4">
          导入历史记录
        </v-card-title>

        <v-card-text class="pa-4">
          <!-- 文件导入部分 -->
          <v-expansion-panels v-model="importPanel" class="mb-4">
            <v-expansion-panel value="file">
              <v-expansion-panel-title>
                <v-icon class="mr-2">mdi-upload</v-icon>
                从文件导入 (JSON)
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-file-input
                  v-model="importFile"
                  accept=".json"
                  label="选择备份文件"
                  variant="outlined"
                  show-size
                  @update:model-value="onFileSelected"
                ></v-file-input>
                <v-alert type="info" class="mt-2" density="compact" variant="tonal">
                  导入会合并数据，不会删除现有记录
                </v-alert>
                <v-btn
                  color="primary"
                  class="mt-3"
                  @click="doImport"
                  :disabled="!importFile"
                  block
                >
                  导入文件
                </v-btn>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel value="manual">
              <v-expansion-panel-title>
                <v-icon class="mr-2">mdi-pencil</v-icon>
                手动添加记录
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <!-- 手动输入表单 -->
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="manualRecord.question"
                      label="占卜问题 *"
                      variant="outlined"
                      :rules="[v => !!v || '请输入问题']"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="manualRecord.mode"
                      :items="modeOptions"
                      label="牌阵选择 *"
                      variant="outlined"
                      required
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="manualRecord.date"
                      label="时间"
                      type="datetime-local"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="manualRecord.querentGender"
                      :items="genderOptions"
                      label="提问者性别"
                      clearable
                      variant="outlined"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="manualRecord.queriedGender"
                      :items="genderOptions"
                      label="被提问者性别"
                      clearable
                      variant="outlined"
                    ></v-select>
                  </v-col>
                </v-row>

                <!-- 卡牌选择 -->
                <v-divider class="my-4"></v-divider>
                <div class="text-subtitle-1 font-weight-bold mb-3">
                  选择卡牌 ({{ manualRecord.mode === 'nine' ? 9 : manualRecord.mode === 'five' ? 5 : 3 }}张)
                </div>

                <v-row>
                  <v-col
                    v-for="i in getCardCount"
                    :key="i"
                    cols="12"
                    sm="4"
                    md="3"
                  >
                    <v-select
                      v-model="manualRecord.cards[i-1]"
                      :items="allCardsOptions"
                      :label="`第${i}张牌`"
                      variant="outlined"
                      density="comfortable"
                      item-title="displayTitle"
                      item-value="number"
                      return-object
                    ></v-select>
                  </v-col>
                </v-row>

                <!-- 备注 -->
                <v-textarea
                  v-model="manualRecord.notes"
                  label="备注"
                  rows="2"
                  variant="outlined"
                  class="mt-3"
                ></v-textarea>

                <!-- 预览和复制 -->
                <v-expansion-panels class="mt-4">
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      <v-icon class="mr-2">mdi-eye</v-icon>
                      预览解析模板
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-textarea
                        :model-value="manualTemplateText"
                        readonly
                        variant="outlined"
                        rows="6"
                        class="mb-2"
                      ></v-textarea>
                      <v-btn
                        color="primary"
                        variant="outlined"
                        @click="copyManualTemplate"
                        :disabled="!canSaveManual"
                      >
                        <v-icon class="mr-2">mdi-content-copy</v-icon>
                        复制解析模板
                      </v-btn>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>

                <v-btn
                  color="success"
                  class="mt-4"
                  @click="saveManualRecord"
                  :disabled="!canSaveManual"
                  block
                  size="large"
                >
                  <v-icon class="mr-2">mdi-content-save</v-icon>
                  保存记录
                </v-btn>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn text @click="closeImportDialog">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 确认清空弹窗 -->
    <v-dialog v-model="showClearConfirm" max-width="400">
      <v-card>
        <v-card-title class="text-error">确认清空</v-card-title>
        <v-card-text>
          确定要删除所有历史记录吗？此操作不可恢复！
          <br><br>
          建议先导出备份。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showClearConfirm = false">取消</v-btn>
          <v-btn color="error" @click="doClear">确认清空</v-btn>
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
import { ref, computed, onMounted, watch } from 'vue'
import {
  getAllHistory,
  deleteHistory,
  clearAllHistory,
  updateHistory,
  exportHistory,
  importHistory,
  type HistoryRecord
} from '@/db/history-db.ts'
import { getAllCards, type Card as CardData } from '@/card-meanings.ts'
import { getCardsForDisplay } from '@/card-meanings-editable'

// 类型定义
type DrawMode = 'three' | 'five' | 'nine'

const emit = defineEmits<{
  back: []
  replay: [question: string, mode: DrawMode]
}>()

const history = ref<HistoryRecord[]>([])
const filterMode = ref('')
const searchQuery = ref('')
const page = ref(1)
const itemsPerPage = ref(6)
const detailDialog = ref(false)
const selectedReading = ref<HistoryRecord | null>(null)
const editNotes = ref('')
const originalNotes = ref('')
const debugInfo = ref('')

const showImportDialog = ref(false)
const showClearConfirm = ref(false)
const importFile = ref<File[] | null>(null)

const snackbar = ref({ show: false, text: '', color: 'success' })

// 导入弹窗相关
const importPanel = ref<string[]>([])
const genderOptions = ['男性', '女性', '未提及']

// 手动输入的记录数据
const manualRecord = ref({
  question: '',
  mode: 'three' as DrawMode,
  date: new Date().toISOString().slice(0, 16),
  querentGender: '',
  queriedGender: '',
  cards: [] as CardData[],
  notes: ''
})

// 所有卡牌选项（用于下拉选择）
// 直接使用卡牌对象作为 items，通过 item-title 和 item-value 配置显示
const allCardsOptions = computed(() => {
  return getCardsForDisplay().map(card => ({
    ...card,
    displayTitle: `${card.number}. ${card.name}`
  }))
})

// 根据模式获取需要选择的卡牌数量
const getCardCount = computed(() => {
  const counts: Record<string, number> = { three: 3, five: 5, nine: 9 }
  return counts[manualRecord.value.mode] || 3
})

// 检查是否可以保存手动记录
const canSaveManual = computed(() => {
  const requiredCards = getCardCount.value
  const hasQuestion = !!manualRecord.value.question
  const hasAllCards = manualRecord.value.cards.filter(c => c).length === requiredCards
  return hasQuestion && hasAllCards
})

// 手动记录的解析模板文本
const manualTemplateText = computed(() => {
  if (!canSaveManual.value) return '请填写完整信息以生成模板'

  const cards = manualRecord.value.cards.filter(c => c)
  const cardNames = cards.map(c => c.name).join('、')
  const meanings = cards.map((c, i) => `第${i + 1}张${c.name}(${c.meaning})`).join('；')

  let template = `雷诺曼问题"${manualRecord.value.question}"，抽到的${manualRecord.value.mode === 'nine' ? '九' : manualRecord.value.mode === 'five' ? '五' : '三'}张雷诺曼卡牌为：${cardNames}。

`
  template += `${manualRecord.value.mode === 'nine' ? '九' : manualRecord.value.mode === 'five' ? '五' : '三'}张牌意按顺序分别为：${meanings}。

`

  // 添加解读方法
  if (manualRecord.value.mode === 'three') {
    template += `解读方法:以第二张牌为核心来讲 只看我写的意思 不要参考其他意思。解牌思路：起牌 核心点 收牌点 从因—>果

第一步 先解2
第二步 解12
第三步 解23
第四步 3反映1

注意雷诺曼是拼读结构 比如小猫 在窝里 玩耍 抽到的是狗 棺材 鱼 可以分别对应小猫 在窝里 玩耍 12连起来 小猫在窝里 23连起来在窝里玩耍 13小猫在玩耍`
  } else if (manualRecord.value.mode === 'five') {
    template += `五张牌解读方法：
1️⃣ 先解3
2️⃣ 像解三张牌一样 先解读234
3️⃣ 解读123
4️⃣ 解读345
5️⃣ 5是1的镜像

‼️这里给出解三张牌的方法：

以第二张牌为核心来讲 只看我写的意思 不要参考其他意思。解牌思路：起牌 核心点 收牌点 从因—>果

1️⃣ 先解2
2️⃣ 解12
3️⃣ 解23
4️⃣ 3是1的镜像

注意雷诺曼横向是拼读结构 比如小猫 在窝里 玩耍 抽到的是狗 棺材 鱼 可以分别对应小猫 在窝里 玩耍 12连起来 小猫在窝里 23连起来在窝里玩耍 13小猫在玩耍`
  } else {
    template += `【九宫格解牌方法】
解读的时候只看我写的意思 不要参考其他意思

‼️从左上角到右下角 横向依次给牌编号为
1 2 3
4 5 6
7 8 9

‼️这里给出解三张牌的方法：
以第二张牌为核心来讲 只看我写的意思 不要参考其他意思。解牌思路：起牌 核心点 收牌点 从因—>果
1️⃣ 先解2
2️⃣ 解12
3️⃣ 解23
4️⃣ 3是1的镜像

注意雷诺曼横向是拼读结构 比如小猫 在窝里 玩耍 抽到的是狗 棺材 鱼 可以分别对应小猫 在窝里 玩耍 12连起来 小猫在窝里 23连起来在窝里玩耍 13小猫在玩耍
竖向是形容一件事 不含时间流逝 就是形容这个状态

解九宫格一共分为九个步骤：
1️⃣先解5号牌，因为5号牌是核心以及基本的概括
2️⃣ 解4，5，6号牌
3️⃣解2，5，8号牌 牌阵里位子越高相当于纬度越高（1，2，3号），位子越低相当于纬度越低（7，8，9号） 越高可以看成不可控的层面，越低可以看成可控层面。2号牌和8号牌相当于是5号牌的补充。2号牌从更大的维度（潜意识或者外部环境）来补充5号牌的讯息，通过上面的讯息我们用8号牌来推为什么有这样的结果 以及为什么有这样的行动细节。 也就是说，以5号为中心，横向的时间流和纵向的维度分别解说
4️⃣解完中心十字
5️⃣123，789综合解（两个横三）这个没有前后顺序 说的就是一件事 这个事发生的状态
6️⃣147，369综合解（两个纵三）这个没有前后顺序 说的就是一件事 这个事发生的状态
7️⃣1，3，7，9 看四角牌的骑士位（骑士位就是走日字 比如1号牌的骑士位就是6，8号；3号牌的骑士位就是4，8号；7号牌的骑士位就是2，6号；9号牌的骑士位就是2，4号。）可以把骑士位看成是四角牌的补牌（比如6，8号牌是1号牌的补牌 更深入的解释了1号牌的意思 其他三张以此类推）。
8️⃣（步骤8️⃣作为补充）大v。两组：解1 8 3号牌，7 2 9号牌作为补充 且整体逻辑符合牌面逻辑 这个技术更多的用途在于2号8号牌的关系上 或者2号8号牌更深度的解读。 补充：第一：菱形格。解2 4 8 6号牌。第二：大x。解 1 5 9号牌，3 5 7号牌。看到的是排面背后更外层的逻辑。相对于解答问题上来讲 大x给的意义不是那么贴题 但是更深入的分析事件背景给到的讯息的话是可以用大x的
9️⃣盘逻辑。用上面方法获取到的信息 盘出一个完整逻辑 包括在解其中某一个步骤的时候能解出多种可能性 这个时候就要在盘逻辑的时候用其他信息 盘出哪个意思合逻辑 哪个意思不合逻辑 把不合理逻辑排除 如果牌解的是透的就会发现 每一个技术下面的牌面给的意思都不违反核心逻辑 一定是在一个完整统一逻辑方框之下的`
  }

  return template
})

const modeOptions = [
  { title: '三张牌', value: 'three' },
  { title: '五张牌', value: 'five' },
  { title: '九张牌', value: 'nine' }
]

//根据筛选条件和搜索词过滤后的历史记录
const filteredHistory = computed(() => {
  let result = history.value

  if (filterMode.value) {
    result = result.filter(h => h.mode === filterMode.value)
  }

  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase()
    result = result.filter(h =>
      h.question.toLowerCase().includes(keyword) ||
      h.notes?.toLowerCase().includes(keyword)
    )
  }

  return result
})

//统计数据：总次数、本月次数、最爱牌阵
const stats = computed(() => {
  const total = history.value.length
  const now = new Date()
  const thisMonth = history.value.filter(h => {
    const d = new Date(h.createdAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const modeCount: Record<string, number> = { three: 0, five: 0, nine: 0 }
  history.value.forEach(h => {
    if (h.mode) {
      modeCount[h.mode] = (modeCount[h.mode] || 0) + 1
    }
  })
  const favoriteMode = Object.entries(modeCount).sort((a, b) => b[1] - a[1])[0]
  const modeLabels: Record<string, string> = { three: '三张牌', five: '五张牌', nine: '九张牌' }

  return {
    total,
    thisMonth,
    favoriteMode: favoriteMode && favoriteMode[1] > 0 ? modeLabels[favoriteMode[0]] : '-'
  }
})

//判断备注是否被修改过
const notesChanged = computed(() => editNotes.value !== originalNotes.value)

//从 IndexedDB 加载所有历史记录，显示加载状态/错误提示
const loadHistory = async () => {
  try {
    debugInfo.value = '正在加载数据...'
    history.value = await getAllHistory()
    debugInfo.value = `加载完成，共 ${history.value.length} 条记录`
    console.log('历史记录加载完成:', history.value)
  } catch (err) {
    debugInfo.value = `加载失败: ${err}`
    showMessage('加载历史记录失败', 'error')
    console.error('加载历史记录失败:', err)
  }
}

//刷新数据，重新调用 loadHistory()
const refreshData = async () => {
  await loadHistory()
}

//删除单条历史记录，需用户确认
const deleteItem = async (id?: number) => {
  if (!id) return
  if (!confirm('确定删除这条记录？')) return
  try {
    await deleteHistory(id)
    history.value = history.value.filter(h => h.id !== id)
    showMessage('已删除')
  } catch (err) {
    showMessage('删除失败', 'error')
  }
}

//打开"清空所有记录"确认弹窗
const confirmClear = () => {
  showClearConfirm.value = true
}

//执行清空操作，删除所有历史记录
const doClear = async () => {
  try {
    await clearAllHistory()
    history.value = []
    showClearConfirm.value = false
    showMessage('历史记录已清空')
  } catch (err) {
    showMessage('清空失败', 'error')
  }
}

//打开详情弹窗，显示选中记录的完整信息
const viewDetail = (item: HistoryRecord) => {
  selectedReading.value = item
  editNotes.value = item.notes || ''
  originalNotes.value = item.notes || ''
  detailDialog.value = true
}

//保存用户编辑的备注到数据库
const saveNotes = async () => {
  if (!selectedReading.value?.id) return
  try {
    await updateHistory(selectedReading.value.id, { notes: editNotes.value })
    originalNotes.value = editNotes.value

    // 修复：添加空值检查
    const idx = history.value.findIndex(h => h.id === selectedReading.value!.id)
    if (idx !== -1 && history.value[idx]) {
      history.value[idx]!.notes = editNotes.value
    }
    showMessage('备注已保存')
  } catch (err) {
    showMessage('保存失败', 'error')
  }
}

//导出历史数据为 JSON 文件下载
const exportData = async () => {
  try {
    const data = await exportHistory()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lenormand-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showMessage('备份已下载')
  } catch (err) {
    showMessage('导出失败', 'error')
  }
}

//从 JSON 文件导入历史记录，合并到现有数据
const doImport = async () => {
  if (!importFile.value?.[0]) return
  try {
    const text = await importFile.value[0].text()
    await importHistory(text)
    await loadHistory()
    showImportDialog.value = false
    importFile.value = null
    showMessage('导入成功')
  } catch (err) {
    showMessage('导入失败，请检查文件格式', 'error')
  }
}

// 文件选择后的处理
const onFileSelected = () => {
  // 可以在这里添加文件验证逻辑
}

// 关闭导入弹窗并重置表单
const closeImportDialog = () => {
  showImportDialog.value = false
  importFile.value = null
  importPanel.value = []
  // 重置手动输入表单
  manualRecord.value = {
    question: '',
    mode: 'three',
    date: new Date().toISOString().slice(0, 16),
    querentGender: '',
    queriedGender: '',
    cards: [],
    notes: ''
  }
}

// 保存手动输入的记录
const saveManualRecord = async () => {
  if (!canSaveManual.value) return

  try {
    // 构建记录数据（不包含 id 和 createdAt，由数据库自动生成）
    const record = {
      question: manualRecord.value.question,
      mode: manualRecord.value.mode,
      cards: manualRecord.value.cards.filter(c => c).map(c => ({
        number: c.number,
        name: c.name,
        image: c.image,
        meaning: c.meaning
      })),
      querentGender: manualRecord.value.querentGender || undefined,
      queriedGender: manualRecord.value.queriedGender || undefined,
      notes: manualRecord.value.notes || undefined
    }

    // 使用导入函数来保存（复用现有逻辑）
    const { saveHistory } = await import('@/db/history-db')
    await saveHistory(record)

    // 刷新列表
    await loadHistory()

    // 重置表单
    closeImportDialog()

    showMessage('记录已保存')
  } catch (err) {
    showMessage('保存失败', 'error')
  }
}

// 复制手动输入的解析模板
const copyManualTemplate = () => {
  navigator.clipboard.writeText(manualTemplateText.value)
  showMessage('已复制到剪贴板')
}

//用历史记录的问题重新占卜，跳转到抽牌页
const reuseQuestion = (record: HistoryRecord) => {
  emit('replay', record.question, record.mode)
  detailDialog.value = false
}

//返回首页
const goBack = () => {
  emit('back')
}

//复制当前记录的解析模板到剪贴板
const copyToClipboard = () => {
  if (!selectedReading.value) return
  const cardNames = selectedReading.value.cards.map(c => c.name).join('、')
  const meanings = selectedReading.value.cards.map((c, i) => `第${i + 1}张${c.name}(${c.meaning})`).join('；')

  let text = `雷诺曼问题"${selectedReading.value.question}"，抽到的${selectedReading.value.mode === 'nine' ? '九' : selectedReading.value.mode === 'five' ? '五' : '三'}张雷诺曼卡牌为：${cardNames}。

`
  text += `${selectedReading.value.mode === 'nine' ? '九' : selectedReading.value.mode === 'five' ? '五' : '三'}张牌意按顺序分别为：${meanings}。

`

  // 添加解读方法
  if (selectedReading.value.mode === 'three') {
    text += `解读方法:以第二张牌为核心来讲 只看我写的意思 不要参考其他意思。解牌思路：起牌 核心点 收牌点 从因—>果

第一步 先解2
第二步 解12
第三步 解23
第四步 3反映1

注意雷诺曼是拼读结构 比如小猫 在窝里 玩耍 抽到的是狗 棺材 鱼 可以分别对应小猫 在窝里 玩耍 12连起来 小猫在窝里 23连起来在窝里玩耍 13小猫在玩耍`
  } else if (selectedReading.value.mode === 'five') {
    text += `五张牌解读方法：
1️⃣ 先解3
2️⃣ 像解三张牌一样 先解读234
3️⃣ 解读123
4️⃣ 解读345
5️⃣ 5是1的镜像

‼️这里给出解三张牌的方法：

以第二张牌为核心来讲 只看我写的意思 不要参考其他意思。解牌思路：起牌 核心点 收牌点 从因—>果

1️⃣ 先解2
2️⃣ 解12
3️⃣ 解23
4️⃣ 3是1的镜像

注意雷诺曼横向是拼读结构 比如小猫 在窝里 玩耍 抽到的是狗 棺材 鱼 可以分别对应小猫 在窝里 玩耍 12连起来 小猫在窝里 23连起来在窝里玩耍 13小猫在玩耍`
  } else if (selectedReading.value.mode === 'nine') {
    text += `【九宫格解牌方法】
解读的时候只看我写的意思 不要参考其他意思

‼️从左上角到右下角 横向依次给牌编号为
1 2 3
4 5 6
7 8 9

‼️这里给出解三张牌的方法：
以第二张牌为核心来讲 只看我写的意思 不要参考其他意思。解牌思路：起牌 核心点 收牌点 从因—>果
1️⃣ 先解2
2️⃣ 解12
3️⃣ 解23
4️⃣ 3是1的镜像

注意雷诺曼横向是拼读结构 比如小猫 在窝里 玩耍 抽到的是狗 棺材 鱼 可以分别对应小猫 在窝里 玩耍 12连起来 小猫在窝里 23连起来在窝里玩耍 13小猫在玩耍
竖向是形容一件事 不含时间流逝 就是形容这个状态

解九宫格一共分为九个步骤：
1️⃣先解5号牌，因为5号牌是核心以及基本的概括
2️⃣ 解4，5，6号牌
3️⃣解2，5，8号牌 牌阵里位子越高相当于纬度越高（1，2，3号），位子越低相当于纬度越低（7，8，9号） 越高可以看成不可控的层面，越低可以看成可控层面。2号牌和8号牌相当于是5号牌的补充。2号牌从更大的维度（潜意识或者外部环境）来补充5号牌的讯息，通过上面的讯息我们用8号牌来推为什么有这样的结果 以及为什么有这样的行动细节。 也就是说，以5号为中心，横向的时间流和纵向的维度分别解说
4️⃣解完中心十字
5️⃣123，789综合解（两个横三）这个没有前后顺序 说的就是一件事 这个事发生的状态
6️⃣147，369综合解（两个纵三）这个没有前后顺序 说的就是一件事 这个事发生的状态
7️⃣1，3，7，9 看四角牌的骑士位（骑士位就是走日字 比如1号牌的骑士位就是6，8号；3号牌的骑士位就是4，8号；7号牌的骑士位就是2，6号；9号牌的骑士位就是2，4号。）可以把骑士位看成是四角牌的补牌（比如6，8号牌是1号牌的补牌 更深入的解释了1号牌的意思 其他三张以此类推）。
8️⃣（步骤8️⃣作为补充）大v。两组：解1 8 3号牌，7 2 9号牌作为补充 且整体逻辑符合牌面逻辑 这个技术更多的用途在于2号8号牌的关系上 或者2号8号牌更深度的解读。 补充：第一：菱形格。解2 4 8 6号牌。第二：大x。解 1 5 9号牌，3 5 7号牌。看到的是排面背后更外层的逻辑。相对于解答问题上来讲 大x给的意义不是那么贴题 但是更深入的分析事件背景给到的讯息的话是可以用大x的
9️⃣盘逻辑。用上面方法获取到的信息 盘出一个完整逻辑 包括在解其中某一个步骤的时候能解出多种可能性 这个时候就要在盘逻辑的时候用其他信息 盘出哪个意思合逻辑 哪个意思不合逻辑 把不合理逻辑排除 如果牌解的是透的就会发现 每一个技术下面的牌面给的意思都不违反核心逻辑 一定是在一个完整统一逻辑方框之下的`
  }

  navigator.clipboard.writeText(text)
  showMessage('已复制到剪贴板')
}

//显示底部提示消息
const showMessage = (text: string, color: 'success' | 'error' = 'success') => {
  snackbar.value = { show: true, text, color }
}

//格式化日期（简写：月日 时:分）
const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

//格式化日期（完整）
const formatDateFull = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

//获取牌阵图标（3/5/9）
const getModeIcon = (mode: string) => {
  const icons: Record<string, string> = { three: '3', five: '5', nine: '9' }
  return icons[mode] || '?'
}

//获取牌阵颜色（绿/橙/红）
const getModeColor = (mode: string) => {
  const colors: Record<string, string> = { three: 'success', five: 'warning', nine: 'error' }
  return colors[mode] || 'grey'
}

//获取牌阵中文名
const getModeLabel = (mode: string) => {
  const labels: Record<string, string> = { three: '三张牌', five: '五张牌', nine: '九张牌' }
  return labels[mode] || mode
}

//执行搜索，重置到第一页
const doSearch = () => {
  page.value = 1
}

watch([filterMode, searchQuery], () => {
  page.value = 1
})

// 监听模式变化，初始化卡牌数组
watch(() => manualRecord.value.mode, (newMode) => {
  const counts: Record<string, number> = { three: 3, five: 5, nine: 9 }
  const count = counts[newMode] || 3
  // 重置卡牌数组，保持已有选择或初始化为空
  manualRecord.value.cards = new Array(count).fill(null)
}, { immediate: true })

onMounted(() => {
  console.log('History 组件挂载')
  loadHistory()
})
</script>

<style scoped>
.history-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.history-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.history-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
}

.cards-display {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.display-nine {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: 480px;
  margin: 0 auto;
  gap: 12px;
}

.result-card {
  transition: transform 0.3s;
}

.result-card:hover {
  transform: scale(1.05);
}

.gap-2 {
  gap: 8px;
}
</style>
