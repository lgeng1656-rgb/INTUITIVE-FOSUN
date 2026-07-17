# 医疗数字化互动一级页面更新 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将一级页面更新为确认的新版设计，实现匀速环形箭头、八个直达全屏视频入口和点击视频返回首页。

**Architecture:** 保留现有 React/Vite、百分比热区、导航状态机和全屏视频组件。首页新增专用组合组件：静态背景承载标题及底部产品区，三张左右分区场景图和两个侧边图标作为独立图层，SVG 负责环形路径动画；页面配置继续集中在 `src/data/stages.js`，八个视频页各自保留腾讯云 COS URL。

**Tech Stack:** React 19、Vite 6、CSS/SVG Motion Path、Node.js 内置测试运行器、腾讯云 COS 公网视频 URL。

## Global Constraints

- 固定 16:9 舞台，任意视口只等比例缩放，不拉伸、不裁切。
- 严格使用 GG 提供的设计素材，不增加可见按钮、提示文字或播放器控制条。
- 只有环形箭头运动，下方产品展示矩形和其余一级页面内容保持静止。
- 八个入口全部直接播放全屏视频，点击视频画面返回一级页面。
- 八个入口暂时共用一个简短示例视频，但必须保留八个独立 COS 地址配置项。
- 不删除旧素材和旧路由，不引入新的 UI 框架或运行时依赖。
- 不把腾讯云 SecretId、SecretKey、签名密钥或其他敏感信息写入前端。

---

### Task 1: 首页视频入口配置与导航测试

**Files:**
- Modify: `src/data/stages.test.js`
- Modify: `src/data/stages.js`

**Interfaces:**
- Consumes: `pages` 页面配置和现有 `openPage(state, pageId)`。
- Produces: `home.hotspots` 中八个 `action: "page"` 入口，以及八个 `kind: "video"` 页面。

- [ ] **Step 1: 写入失败测试**

在 `src/data/stages.test.js` 增加测试，要求首页入口标识和目标严格等于：

```js
const expectedHomeVideoTargets = {
  "home-robot-integration": "video-robot-integration",
  "home-ui-integration": "video-ui-integration",
  "home-skills-training": "video-skills-training",
  "home-surgery-planning": "video-surgery-planning",
  "home-intraoperative-assistance": "video-intraoperative-assistance",
  "home-remote-teaching": "video-remote-teaching",
  "home-quality-control": "video-quality-control",
  "home-surgery-review": "video-surgery-review"
};

test("新版首页提供八个直达视频入口", () => {
  assert.deepEqual(
    Object.fromEntries(pages.home.hotspots.map(({ id, target }) => [id, target])),
    expectedHomeVideoTargets
  );
});

test("首页八个入口目标都是独立腾讯云视频页面", () => {
  for (const target of Object.values(expectedHomeVideoTargets)) {
    assert.equal(pages[target].kind, "video");
    assert.match(pages[target].video, /^https:\/\/intuitive-fosun-videos-1454170689\.cos\.ap-guangzhou\.myqcloud\.com\//);
  }
});
```

- [ ] **Step 2: 运行测试并确认 RED**

Run: `npm.cmd test -- src/data/stages.test.js`

Expected: FAIL，因为现有首页只有三个阶段入口，且缺少新的八个视频页面。

- [ ] **Step 3: 最小实现配置**

将 `pages.home.hotspots` 替换为八个 `action: "page"` 热区，并增加对应视频页面：

```js
"video-robot-integration": {
  kind: "video",
  label: "机器人功能整合视频",
  video: `${videoBaseUrl}/demo.mp4`
}
```

其余七个页面使用各自独立键和标签，第一版同样使用 `${videoBaseUrl}/demo.mp4`。热区坐标以设计稿 4000×2250 的元素边界转换为百分比，场景图左右两半不得互相重叠。

- [ ] **Step 4: 运行测试并确认 GREEN**

Run: `npm.cmd test -- src/data/stages.test.js`

Expected: 新增配置测试通过，现有页面配置测试仍通过。

---

### Task 2: 新版首页素材与组合组件

**Files:**
- Create: `public/assets/medical/home-background.jpg`
- Create: `public/assets/medical/home-pre.png`
- Create: `public/assets/medical/home-intra.png`
- Create: `public/assets/medical/home-post.png`
- Create: `public/assets/medical/home-left-integration.png`
- Create: `public/assets/medical/home-right-integration.png`
- Modify: `src/app-runtime.test.js`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `pages.home` 和六个百分比定位的图片资源。
- Produces: `HomeSurface({ page, onReady, onError })`，完成首页图层和资源加载就绪通知。

- [ ] **Step 1: 复制用户确认的原始素材**

使用 `Copy-Item -LiteralPath` 将以下文件复制为 ASCII 文件名，不修改 G 盘源文件：

```text
数字化互动2607161.jpg -> public/assets/medical/home-background.jpg
1.png -> public/assets/medical/home-pre.png
2.png -> public/assets/medical/home-intra.png
3.png -> public/assets/medical/home-post.png
左边机器.png -> public/assets/medical/home-left-integration.png
右边手机.png -> public/assets/medical/home-right-integration.png
```

- [ ] **Step 2: 写入失败的源码结构测试**

在 `src/app-runtime.test.js` 增加：

```js
test("首页使用独立组合图层和环形路径", () => {
  const source = readFileSync(new URL("./App.jsx", import.meta.url), "utf8");
  assert.match(source, /function HomeSurface/);
  assert.match(source, /className="home-orbit"/);
  assert.match(source, /<animateMotion/);
  assert.match(source, /prefers-reduced-motion/);
});
```

- [ ] **Step 3: 运行测试并确认 RED**

Run: `npm.cmd test -- src/app-runtime.test.js`

Expected: FAIL，因为 `HomeSurface` 和 `home-orbit` 尚不存在。

- [ ] **Step 4: 实现首页组合组件**

在 `src/App.jsx` 中增加资源清单和 `HomeSurface`。结构固定为：

```jsx
<div className="home-page">
  <img className="home-background" src={HOME_ASSETS.background} alt="" />
  <img className="home-scene home-scene-pre" src={HOME_ASSETS.pre} alt="术前" />
  <img className="home-scene home-scene-intra" src={HOME_ASSETS.intra} alt="术中" />
  <img className="home-scene home-scene-post" src={HOME_ASSETS.post} alt="术后" />
  <img className="home-integration home-integration-left" src={HOME_ASSETS.leftIntegration} alt="机器人功能整合" />
  <img className="home-integration home-integration-right" src={HOME_ASSETS.rightIntegration} alt="用户界面整合" />
  <svg className="home-orbit" viewBox="0 0 4000 2250" aria-hidden="true">
    <path id="home-orbit-path" className="home-orbit-path" d="..." />
    <g className="home-orbit-arrow">
      <path d="M -18 -11 L 18 0 L -18 11 Z" />
      <animateMotion dur="16s" repeatCount="indefinite" rotate="auto">
        <mpath href="#home-orbit-path" />
      </animateMotion>
    </g>
  </svg>
</div>
```

`PageSurface` 在 `page.kind === "home"` 时渲染 `HomeSurface`。组件必须等到六张图片全部加载后才调用 `onReady`，保证页面切换无缺图闪烁。

- [ ] **Step 5: 运行测试并确认 GREEN**

Run: `npm.cmd test -- src/app-runtime.test.js`

Expected: 新增结构测试和现有运行时测试全部通过。

---

### Task 3: 首页布局、动画与无障碍降级

**Files:**
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: Task 2 的 `home-*` 类名和 4000×2250 SVG 坐标。
- Produces: 与设计稿一致的百分比定位、匀速循环箭头和 `prefers-reduced-motion` 静止状态。

- [ ] **Step 1: 添加布局样式**

首页根层、背景、场景图、侧边图标和 SVG 均使用绝对定位：

```css
.home-page,
.home-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.home-scene,
.home-integration,
.home-orbit {
  position: absolute;
  display: block;
  pointer-events: none;
}
```

场景图和图标位置通过 4000×2250 设计稿测量转换为百分比；背景保持 `object-fit: fill`，所有独立素材保持自身比例。

- [ ] **Step 2: 添加匀速路径动画样式**

```css
.home-orbit-arrow {
  animation-timing-function: linear;
}

@media (prefers-reduced-motion: reduce) {
  .home-orbit-arrow animateMotion {
    display: none;
  }
}
```

SVG 的 `animateMotion` 使用固定 `dur="16s"`、`repeatCount="indefinite"`，路径为闭合圆角环，确保速度沿整条路径连续。

- [ ] **Step 3: 运行完整测试和构建**

Run: `npm.cmd test`

Expected: 0 个失败。

Run: `npm.cmd run build`

Expected: Vite 退出码为 0，并更新 `dist`。

---

### Task 4: 浏览器交互与视觉忠实度验证

**Files:**
- Modify if needed: `src/data/stages.js`
- Modify if needed: `src/App.jsx`
- Modify if needed: `src/styles.css`
- Temporary screenshots: repository outside directory only

**Interfaces:**
- Consumes: 已构建的本地页面。
- Produces: 1920×1080 桌面截图、一个较小视口截图、八入口交互证据和视觉差异清单。

- [ ] **Step 1: 启动本地开发服务器**

Run: `npm.cmd run dev -- --host 127.0.0.1`

Expected: Vite 输出可访问的 `http://127.0.0.1:<port>/`。

- [ ] **Step 2: 使用内置浏览器检查页面健康状态**

验证 URL、页面标题、非空 DOM、无框架错误覆盖层、控制台无相关错误，并截取首屏。

- [ ] **Step 3: 验证八条交互路径**

逐一验证：

```text
home -> 机器人功能整合视频 -> 点击返回 home
home -> 用户界面整合视频 -> 点击返回 home
home -> 技能培训视频 -> 点击返回 home
home -> 手术规划视频 -> 点击返回 home
home -> 术中辅助视频 -> 点击返回 home
home -> 远程教学视频 -> 点击返回 home
home -> 质控管理视频 -> 点击返回 home
home -> 手术复盘视频 -> 点击返回 home
```

确认底部产品展示矩形无点击行为，视频没有原生控制条。

- [ ] **Step 4: 对比参考设计并修复差异**

在同一轮 QA 中使用 `view_image` 检查：

```text
参考：G:\2026年工作目录\72直观复星术前术中术后页面\术前术中术后\一级页面\数字化互动260716.jpg
实现：浏览器最新 1920×1080 截图
```

至少核对标题、三组场景位置与尺寸、两侧图标、圆角环形路径、底部矩形、文字内容、渐变色、黑边适配和动画。任何可修复偏差都必须修复并重新截图。

- [ ] **Step 5: 最终新鲜验证**

Run: `npm.cmd test`

Expected: 0 个失败。

Run: `npm.cmd run build`

Expected: Vite 退出码为 0。
