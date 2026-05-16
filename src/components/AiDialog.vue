<template>
  <v-dialog v-model="dialog" :width="props.mode === 'nine' ? 800 : 700">
    <v-card>
      <v-card-title class="text-h5 bg-primary text-white">
        点击页面最下方按钮复制文字 去找ai解答
      </v-card-title>

      <v-card-text class="pa-4">
        <!-- 问题 -->
        <div class="mb-4">
          <div class="text-subtitle-2 text-grey">您的问题：</div>
          <div class="text-body-1">{{ question }}</div>
        </div>

        <!-- 性别信息 -->
        <div v-if="hasGenderCard && (querentGender || queriedGender)" class="mb-4">
          <div class="text-subtitle-2 text-grey">性别信息：</div>
          <v-chip v-if="querentGender" class="mr-2" color="info" size="small">
            提问者：{{ querentGender }}
          </v-chip>
          <v-chip v-if="queriedGender" color="info" size="small">
            被提问者：{{ queriedGender }}
          </v-chip>
        </div>

        <v-divider class="mb-4"></v-divider>

        <!-- 抽到的卡牌 - 带图片和完整解析 -->
        <div class="mb-4">
          <div class="text-subtitle-2 text-grey mb-3">抽到的卡牌（按选择顺序）：</div>

          <!-- 三张牌 - 横向排列 -->
          <div v-if="props.mode === 'three'" class="cards-display three-layout">
            <div
              v-for="(card, i) in cards"
              :key="i"
              class="card-display-item"
            >
              <div class="card-position">第{{ i + 1 }}张</div>
              <div class="card-image-wrapper">
                <img :src="card.image" :alt="card.name" class="card-image" />
              </div>
              <div class="card-info">
                <div class="card-name">{{ card.name }}</div>
                <div class="card-meaning-full">{{ card.meaning }}</div>
              </div>
            </div>
          </div>

          <!-- 五张牌 - 横向排列 -->
          <div v-else-if="props.mode === 'five'" class="cards-display five-layout">
            <div
              v-for="(card, i) in cards"
              :key="i"
              class="card-display-item small"
            >
              <div class="card-position">第{{ i + 1 }}张</div>
              <div class="card-image-wrapper small">
                <img :src="card.image" :alt="card.name" class="card-image" />
              </div>
              <div class="card-info">
                <div class="card-name">{{ card.name }}</div>
                <div class="card-meaning-full small">{{ card.meaning }}</div>
              </div>
            </div>
          </div>

          <!-- 九张牌 - 3×3排列，缩小尺寸 -->
          <div v-else class="cards-display nine-layout">
            <div class="nine-grid">
              <div
                v-for="(card, i) in cards"
                :key="i"
                class="card-display-item nine-item"
                :class="{ 'center-card': i === 4 }"
              >
                <div class="card-position nine-pos">第{{ i + 1 }}张</div>
                <div class="card-image-wrapper nine">
                  <img :src="card.image" :alt="card.name" class="card-image" />
                </div>
                <div class="card-info">
                  <div class="card-name nine-name">{{ card.name }}</div>
                  <div class="card-meaning-full nine">{{ card.meaning }}</div>
                </div>
                <div v-if="i === 4" class="center-badge">核心</div>
              </div>
            </div>
          </div>
        </div>

        <v-divider class="mb-4"></v-divider>

        <!-- AI解析内容 -->
        <div class="text-subtitle-1 mb-2">模板：</div>
        <v-textarea
          v-model="contentA"
          readonly
          variant="outlined"
          :rows="props.mode === 'nine' ? 4 : 3"
          class="mb-4"
        ></v-textarea>

        <v-btn
          color="success"
          block
          prepend-icon="mdi-content-copy"
          :text="copied ? '已复制！' : '复制到剪贴板'"
          @click="copyToClipboard"
        ></v-btn>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="关闭" @click="dialog = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

type DrawMode = 'three' | 'five' | 'nine'

interface Card {
  number: number
  name: string
  image: string
  meaning: string
}

const props = defineProps<{
  modelValue: boolean
  question: string
  cards: Card[]
  querentGender?: string
  queriedGender?: string
  hasGenderCard?: boolean
  mode: DrawMode
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dialog = ref(props.modelValue)
const copied = ref(false)

const contentA = computed(() => {
  const cardNames = props.cards.map(c => c.name).join('、')
  const meanings = props.cards.map((c, i) => `第${i + 1}张${c.name}(${c.meaning})`).join('；')

  let template = ''

  if (props.mode === 'three') {
    template = `雷诺曼问题"${props.question}"，抽到的三张雷诺曼卡牌为：${cardNames}。

三张牌意按顺序分别为：${meanings}。

解读方法:以第二张牌为核心来讲 只看我写的意思 不要参考其他意思。解牌思路：起牌 核心点 收牌点 从因—>果

第一步 先解2
第二步 解12
第三步 解23
第四步 3反映1

注意雷诺曼是拼读结构 比如小猫 在窝里 玩耍 抽到的是狗 棺材 鱼 可以分别对应小猫 在窝里 玩耍 12连起来 小猫在窝里 23连起来在窝里玩耍 13小猫在玩耍`
  } else if (props.mode === 'five') {
    template = `雷诺曼问题"${props.question}"，抽到的五张雷诺曼卡牌为（按选择顺序横向排列）：${cardNames}。

五张牌意按顺序分别为：${meanings}。

五张牌解读方法：
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
    const gridNames = [
      [props.cards[0]?.name, props.cards[1]?.name, props.cards[2]?.name],
      [props.cards[3]?.name, props.cards[4]?.name, props.cards[5]?.name],
      [props.cards[6]?.name, props.cards[7]?.name, props.cards[8]?.name]
    ]
    const gridDisplay = gridNames.map((row, i) => `第${i+1}行：${row.join(' | ')}`).join('\n')

    const cardList = props.cards.map((c, i) => `${i + 1}号牌${c.name}(${c.meaning})`).join('\n')

    template = `雷诺曼问题"${props.question}"，抽到的九张雷诺曼卡牌为3×3方阵排列：

${gridDisplay}

九张牌详细信息：
${cardList}

【九宫格解牌方法】
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

  if (props.hasGenderCard && (props.querentGender || props.queriedGender)) {
    const genderText = `\n\n性别信息：提问者性别：${props.querentGender || '未指定'}，被提问者性别：${props.queriedGender || '未指定'}。请结合性别信息进行解读。`
    template += genderText
  }

  return template
})

watch(() => props.modelValue, (val) => {
  dialog.value = val
})

watch(dialog, (val) => {
  emit('update:modelValue', val)
  if (!val) copied.value = false
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(contentA.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    alert('复制失败，请手动复制')
  }
}
</script>

<style scoped>
/* 卡牌展示区域 */
.cards-display {
  margin-bottom: 20px;
}

/* 三张牌布局 - 横向排列 */
.three-layout {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.three-layout .card-display-item {
  width: 220px;
}

/* 五张牌布局 - 横向排列 */
.five-layout {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.five-layout .card-display-item.small {
  width: 140px;
}

/* 九张牌布局 - 3×3网格，缩小尺寸 */
.nine-layout {
  display: flex;
  justify-content: center;
}

.nine-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 8px;
  max-width: 600px;
}

/* 九张牌单项样式 - 缩小 */
.nine-item {
  width: 180px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.nine-item.center-card {
  border-color: #667eea;
  background: #f0f4ff;
  border-width: 2px;
}

.center-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #667eea;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: bold;
}

/* 九张牌位置文字 */
.nine-pos {
  font-size: 11px;
  margin-bottom: 5px;
}

/* 九张牌图片 - 缩小 */
.card-image-wrapper.nine {
  width: 100%;
  height: 90px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

/* 九张牌名字 - 缩小 */
.nine-name {
  font-size: 13px;
  margin-bottom: 4px;
}

/* 九张牌解析 - 缩小 */
.card-meaning-full.nine {
  font-size: 10px;
  line-height: 1.4;
  max-height: 85px;
  overflow-y: auto;
  padding-right: 3px;
  white-space: pre-line;
  color: #555;
}

/* 卡牌项通用样式 */
.card-display-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-position {
  font-size: 14px;
  color: #667eea;
  font-weight: bold;
  margin-bottom: 10px;
}

/* 图片容器 */
.card-image-wrapper {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.card-image-wrapper.small {
  height: 120px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;
}

/* 九张牌图片显示下半部分 */
.nine-item .card-image {
  object-position: center 75%;
}

/* 卡牌信息 */
.card-info {
  width: 100%;
}

.card-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 8px;
}

/* 完整牌意 */
.card-meaning-full {
  font-size: 13px;
  color: #555;
  line-height: 1.6;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 5px;
  white-space: pre-line;
}

.card-meaning-full.small {
  font-size: 11px;
  max-height: 120px;
}

.card-meaning-full::-webkit-scrollbar {
  width: 3px;
}

.card-meaning-full::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}
</style>
