# 拼豆艺术馆 (Pingo Art) - 技术文档

## 1. 项目简介
“拼豆艺术馆”是一款基于 AI 驱动的拼豆（Perler Beads）像素画创作工具。它旨在帮助拼豆爱好者快速将创意转化为可制作的像素图纸，支持 AI 关键词生成、照片一键转像素以及手动编辑功能。

*   **项目名称**: 拼豆艺术馆 (Pingo Art)
*   **核心目标**: 简化拼豆图纸创作流程，提供 AI 灵感支持。

---

## 2. 核心功能
*   **AI 创意生成**: 输入关键词（如“可爱的猫咪”），AI 自动生成适合拼豆制作的像素画。
*   **AI 照片转换**: 上传本地照片，AI 将其简化并转换为像素风格。
*   **专业画布编辑**: 支持 10x10 到 120x120 的灵活网格，提供画笔、橡皮擦、一键清空等工具。
*   **像素灵感宇宙**: 内置多种风格的灵感库（Dotown、Lo-Fi、精细像素等），支持一键提取到画布。
*   **图纸导出与分享**: 支持将作品导出为高分辨率 PNG 图片，并支持一键复制分享链接。

---

## 3. 技术栈
*   **前端框架**: React 19 (TypeScript)
*   **构建工具**: Vite 6
*   **样式处理**: Tailwind CSS (原子化 CSS)
*   **AI 模型**: Google Gemini 2.5 Flash Image (用于图像生成与转换)
*   **图形渲染**: HTML5 Canvas (用于高性能像素网格渲染)
*   **图标库**: Lucide React / Material Symbols

---

## 4. 项目结构说明
```text
/
├── src/
│   ├── App.tsx             # 应用主入口，负责状态管理与整体布局
│   ├── components/         # UI 组件库
│   │   ├── BeadCanvas.tsx  # 核心画布组件（Canvas 渲染与交互逻辑）
│   │   ├── Toast.tsx       # 全局提示组件
│   │   └── ...
│   ├── services/           # 业务逻辑服务
│   │   ├── aiService.ts    # 封装 Gemini AI 图像处理与像素化逻辑
│   │   └── geminiService.ts# 基础 AI 接口配置
│   ├── types.ts            # 全局 TypeScript 类型定义
│   └── index.css           # 全局样式（包含 Tailwind 配置）
├── index.html              # 基础 HTML 模版
└── package.json            # 项目依赖与脚本配置
```

---

## 5. 核心逻辑实现

### 5.1 图像像素化 (Image to Grid)
在 `services/aiService.ts` 中，我们通过 Canvas 的 `getImageData` 方法读取图片像素信息，并将其映射到指定大小的二维数组（Grid）中。
*   **处理逻辑**: 自动过滤纯白背景和透明像素，将其视为空白拼豆位。
*   **颜色转换**: 将 RGB 颜色值转换为标准的 Hex 格式，以便在画布中渲染。

### 5.2 画布渲染优化
`BeadCanvas.tsx` 使用了原生 Canvas API 而非 DOM 节点来渲染数千个拼豆点，这极大地提升了在大网格（如 120x120）下的操作流畅度。
*   **ForwardRef**: 通过 `useImperativeHandle` 暴露 `getCanvas` 方法，使得父组件可以轻松获取画布内容进行导出。

---

## 6. 本地开发指南

### 前置要求
*   已安装 Node.js (建议 v18+)
*   拥有有效的 Gemini API Key

### 启动步骤
1.  **克隆/下载项目代码**。
2.  **安装依赖**:
    ```bash
    npm install
    ```
3.  **配置环境变量**:
    在根目录创建 `.env.local` 文件并添加：
    ```env
    GEMINI_API_KEY=你的API密钥
    ```
4.  **启动开发服务器**:
    ```bash
    npm run dev
    ```
5.  **访问应用**: 在浏览器打开 `http://localhost:3000`。

---

## 7. 注意事项
*   **API 限制**: AI 生成功能依赖于 Gemini API，请确保网络环境可以正常访问。
*   **浏览器兼容性**: 建议使用最新版本的 Chrome、Edge 或 Safari 浏览器以获得最佳体验。
