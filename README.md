# 🔮 雷诺曼占卜 (Lenormand Divination)

一个基于 Vue 3 + Vite + Vuetify 构建的交互式雷诺曼卡牌占卜应用，支持多种牌阵、自定义牌意与 AI 解析模板生成。

## ✨ 功能特性

### 🃏 三种经典牌阵
- **三张牌** — 起因-核心-结果，快速解读问题本质
- **五张牌** — 时间线发展，看清事情来龙去脉  
- **九张牌（九宫格）** — 3×3 方阵，深度剖析问题全貌

### 🎴 交互式抽牌体验
- 36 张卡牌扇形排列，点击选择
- 动态揭晓动画，位置标签清晰标注
- 支持性别牌（男人/女人）自动检测与信息补充

### 📚 牌意系统
- **牌意速查** — 36 张卡牌完整释义，支持分类筛选与搜索
- **牌意管理** — 自定义编辑每张卡牌的核心意思与补充释义
- **导入/导出** — JSON 格式备份与分享牌意数据

### 📜 历史记录
- 自动保存每次占卜记录到本地 IndexedDB
- 支持按牌阵筛选、按问题搜索
- 可添加备注、重新占卜、导出备份
- 手动添加历史记录功能

### 🤖 AI 解析助手
- 自动生成结构化解析模板
- 包含完整牌阵解读方法与逻辑
- 一键复制到剪贴板，方便粘贴给 AI 分析

### 🎨 其他特性
- 🌓 白天/黑夜主题切换
- 📱 响应式布局，支持移动端
- 💾 所有数据本地存储，隐私安全

## 🚀 在线体验

👉 **[点击访问](https://extrons.github.io/Lenormand_Ai_Assisted/ )**

> 部署在 GitHub Pages，数据存储于浏览器本地，换设备需重新导入备份。

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| [Vue 3](https://vuejs.org/) | 前端框架（Composition API） |
| [Vite](https://vitejs.dev/) | 构建工具 |
| [Vuetify 3](https://vuetifyjs.com/) | UI 组件库 |
| [Vue Router](https://router.vuejs.org/) | 路由管理（Hash 模式） |
| [Pinia](https://pinia.vuejs.org/) | 状态管理 |
| [idb](https://github.com/jakearchibald/idb) | IndexedDB 封装 |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |

## 📦 本地运行

```bash
# 克隆仓库
git clone https://github.com/extrons/Lenormand-forGithub.git
cd Lenormand-forGithub

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 🗂️ 项目结构

```
Lenormand-forGithub/
├── public/
│   └── cards/              # 36张雷诺曼卡牌图片
├── src/
│   ├── components/         # Vue 组件
│   │   ├── card.vue        # 主抽牌界面
│   │   ├── QuestionInput.vue
│   │   ├── AiDialog.vue    # AI解析弹窗
│   │   ├── History.vue     # 历史记录
│   │   ├── CardReference.vue   # 牌意速查
│   │   ├── CardMeaningEditor.vue
│   │   ├── SpreadPreview.vue   # 牌阵预览
│   │   ├── Welcome.vue
│   │   └── ...
│   ├── views/
│   │   └── MeaningManager.vue  # 牌意管理页
│   ├── db/
│   │   └── history-db.ts   # IndexedDB 历史记录存储
│   ├── router/
│   │   └── index.ts        # 路由配置
│   ├── card-meanings.ts    # 卡牌数据接口
│   ├── card-meanings-editable.ts  # 可编辑牌意逻辑
│   └── main.ts             # 应用入口
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions 自动部署
├── vite.config.ts
├── package.json
└── README.md
```

## 📖 使用指南

### 开始占卜
1. 首页选择牌阵（3/5/9 张牌）
2. 输入你的问题
3. 从 36 张卡牌中按顺序选择指定数量
4. 等待卡牌揭晓，查看位置含义
5. 点击 **AI解析** 生成解读模板

### 牌意管理
1. 侧边栏进入 **牌意管理**
2. 点击卡牌右上角的 ✏️ 编辑
3. 修改核心意思或补充释义
4. 点击 ✅ 保存
5. 使用顶部按钮导出 JSON 备份

### 历史记录
- 每次占卜自动保存
- 支持添加备注、重新占卜、删除单条
- 可导出 JSON 备份或导入恢复

## 🔄 数据备份与迁移

所有数据存储在浏览器本地（localStorage + IndexedDB）：

| 数据类型 | 存储方式 | 备份方法 |
|---------|---------|---------|
| 自定义牌意 | localStorage | 牌意管理页 → 导出 JSON |
| 历史记录 | IndexedDB | 历史记录页 → 导出 |
| 主题设置 | localStorage | 随浏览器同步 |

> ⚠️ 清除浏览器数据会导致丢失，建议定期导出备份。

## 🌐 部署

本项目使用 GitHub Actions 自动部署到 GitHub Pages：

1. 推送代码到 `main` 分支
2. Actions 自动构建并部署到 `gh-pages` 分支
3. 访问 `https://extrons.github.io/Lenormand-forGithub/`

详见 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

## 📄 开源协议

[MIT License](LICENSE)

## 🙏 致谢

- 雷诺曼卡牌体系源于 19 世纪法国占卜师 Marie Anne Lenormand
- 牌意参考现代雷诺曼解读体系

---

Made with 💜 by extrons
