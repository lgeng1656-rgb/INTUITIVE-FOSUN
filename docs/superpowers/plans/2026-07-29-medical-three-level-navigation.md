# Medical Three-Level Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 更新医疗互动首页并实现术前、术中、术后三层导航及临床应用功能整合页。

**Architecture:** 继续使用 `pages` 数据表声明页面、热区、背景和视频，由现有导航状态机维护历史栈。新增阶段放大页和可复用的背景嵌入视频页面渲染，CSS 负责定位与呼吸灯，不改动环形 Canvas 动画。

**Tech Stack:** React 19、Vite 6、Node.js test runner、CSS

## Global Constraints

- 固定 16:9 舞台，不拉伸页面层级逻辑。
- 保留现有未提交改动和环形动画。
- 不引入依赖，不写入 API Key、Token 或密码。
- 源素材只复制，不覆盖或删除 G 盘文件。

---

### Task 1: 新素材与导航数据

**Files:**
- Create: `public/assets/medical/home-20260729.jpg`
- Create: `public/assets/medical/stage-pre-active-20260729.jpg`
- Create: `public/assets/medical/stage-intra-active-20260729.jpg`
- Create: `public/assets/medical/stage-post-active-20260729.jpg`
- Create: `public/assets/medical/detail-*.jpg`
- Modify: `src/data/stages.js`
- Test: `src/data/stages.test.js`

**Interfaces:**
- Consumes: 现有 `area()`、`videoIntroPage()` 和 COS 视频 URL。
- Produces: 首页到阶段页、阶段页到三级页的 `hotspots` 映射。

- [ ] 写入覆盖首页、阶段页、三级页和返回层级的失败测试。
- [ ] 运行 `npm.cmd test`，确认新断言失败。
- [ ] 复制素材并最小修改 `pages` 数据配置。
- [ ] 再次运行 `npm.cmd test`，确认数据与导航测试通过。

### Task 2: 页面渲染与呼吸效果

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`
- Test: `src/app-runtime.test.js`

**Interfaces:**
- Consumes: `page.kind`、`page.background`、`page.video`、`page.mediaArea`、`page.breathAreas`。
- Produces: `embedded-video` 页面和阶段页呼吸灯覆盖层。

- [ ] 增加渲染结构与样式存在性测试并确认失败。
- [ ] 添加可复用背景视频组件和呼吸灯层。
- [ ] 保证视频区域阻止冒泡，背景点击沿现有历史栈返回。
- [ ] 运行全部测试并修正回归。

### Task 3: 构建与本地验收

**Files:**
- Modify only if verification reveals a scoped defect.

**Interfaces:**
- Consumes: 完成后的 Vite 应用。
- Produces: 本地预览地址和浏览器验收结果。

- [ ] 运行 `npm.cmd test`，预期全部通过。
- [ ] 运行 `npm.cmd run build`，预期生成 `dist` 且无错误。
- [ ] 启动本地开发服务器并检查首页、三阶段、六个三级页和临床应用整合页。
- [ ] 汇报新增、修改、删除文件和本地预览地址。
