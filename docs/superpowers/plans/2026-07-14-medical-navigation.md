# 医疗互动跳转网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 React/Vite 项目中实现严格匹配用户示意图的 1920×1080 本地医疗互动跳转网站，并为稍后提供的四段 MP4 视频预留固定入口。

**Architecture:** 页面采用固定 1920×1080 舞台并等比例缩放。可见内容全部来自用户提供的原始图片；React 通过透明百分比热区和纯函数导航状态机处理进入下一级、返回上一层及术前/术中/术后切换。术前已有三张完整二级画面直接使用，术中和术后使用通用背景、原始场景图和按钮图片组合。

**Tech Stack:** React 19、Vite 6、CSS、Node.js 内置测试运行器。

## Global Constraints

- 页面设计坐标固定为 1920×1080，任意视口只能等比例缩放，不得拉伸或裁切。
- 首页说明文字不可点击；只有三块场景画面可进入阶段页。
- 可见画面不得新增返回按钮、提示文字、播放器控制条、边框或悬停装饰。
- 正式视频未提供时，视频页必须为无文字纯黑画面，点击仍能返回上一页。
- 不删除原项目和 G 盘源素材；不引入额外 UI 框架。
- 当前仓库没有 Git 作者身份，执行期间不创建提交。

---

### Task 1: 导航状态机与测试

**Files:**
- Create: `src/navigation.test.js`
- Create: `src/navigation.js`
- Modify: `package.json`

**Interfaces:**
- Produces: `createInitialState(): NavigationState`
- Produces: `openStage(state, stage): NavigationState`
- Produces: `openPage(state, pageId): NavigationState`
- Produces: `goBack(state): NavigationState`
- `NavigationState` shape: `{ current: string, stage: "pre" | "intra" | "post" | null, history: string[] }`

- [ ] **Step 1: Add the failing navigation tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createInitialState, goBack, openPage, openStage } from "./navigation.js";

test("首页进入术前全场景", () => {
  assert.deepEqual(openStage(createInitialState(), "pre"), {
    current: "pre-overview",
    stage: "pre",
    history: ["home"]
  });
});

test("进入详情后按层级返回", () => {
  const overview = openStage(createInitialState(), "pre");
  const planning = openPage(overview, "pre-planning");
  const video = openPage(planning, "video-planning");
  assert.equal(goBack(video).current, "pre-planning");
  assert.equal(goBack(goBack(video)).current, "pre-overview");
});

test("阶段按钮清空旧详情历史并切换阶段", () => {
  const planning = openPage(openStage(createInitialState(), "pre"), "pre-planning");
  assert.deepEqual(openStage(planning, "post"), {
    current: "post-overview",
    stage: "post",
    history: ["home"]
  });
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node --test src/navigation.test.js`

Expected: FAIL because `src/navigation.js` does not exist.

- [ ] **Step 3: Implement the minimal navigation module**

```js
export function createInitialState() {
  return { current: "home", stage: null, history: [] };
}

export function openStage(_state, stage) {
  return { current: `${stage}-overview`, stage, history: ["home"] };
}

export function openPage(state, pageId) {
  return { ...state, current: pageId, history: [...state.history, state.current] };
}

export function goBack(state) {
  if (state.history.length === 0) return state;
  const history = state.history.slice(0, -1);
  const current = state.history.at(-1);
  return {
    current,
    stage: current === "home" ? null : state.stage,
    history
  };
}
```

- [ ] **Step 4: Add `"test": "node --test"` to package scripts and verify GREEN**

Run: `npm.cmd test`

Expected: all navigation tests pass with zero failures.

---

### Task 2: 素材、页面配置和互动舞台

**Files:**
- Create: `public/assets/medical/home.jpg`
- Create: `public/assets/medical/secondary-background.jpg`
- Create: `public/assets/medical/pre-overview.jpg`
- Create: `public/assets/medical/pre-training.jpg`
- Create: `public/assets/medical/pre-planning.jpg`
- Create: `public/assets/medical/intra-overview.jpg`
- Create: `public/assets/medical/intra-remote.jpg`
- Create: `public/assets/medical/post-overview.jpg`
- Create: `public/assets/medical/pre.png`
- Create: `public/assets/medical/pre-active.png`
- Create: `public/assets/medical/intra.png`
- Create: `public/assets/medical/intra-active.png`
- Create: `public/assets/medical/post.png`
- Create: `public/assets/medical/post-active.png`
- Create: `public/videos/.gitkeep`
- Modify: `src/data/stages.js`
- Modify: `src/App.jsx`
- Modify: `src/styles.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: navigation functions from Task 1.
- Produces: `pages` configuration keyed by page id, each with `kind`, `stage`, `image`, `hotspots` and optional `video`.
- Produces: `MedicalStage`, a 1920×1080 scene that supports transparent hotspots and staged navigation.

- [ ] **Step 1: Copy the approved source images with ASCII filenames**

Use PowerShell `Copy-Item -LiteralPath` from the supplied G drive directory into `public/assets/medical`. Do not alter the source files.

- [ ] **Step 2: Replace the corrupted `stages.js` with the exact page map**

The map must contain these routes:

```js
export const stageOverview = {
  pre: "pre-overview",
  intra: "intra-overview",
  post: "post-overview"
};

export const pages = {
  home: { kind: "full-image", image: "/assets/medical/home.jpg" },
  "pre-overview": { kind: "full-image", stage: "pre", image: "/assets/medical/pre-overview.jpg" },
  "pre-training": { kind: "full-image", stage: "pre", image: "/assets/medical/pre-training.jpg" },
  "pre-planning": { kind: "full-image", stage: "pre", image: "/assets/medical/pre-planning.jpg" },
  "intra-overview": { kind: "composite", stage: "intra", image: "/assets/medical/intra-overview.jpg" },
  "intra-remote": { kind: "composite", stage: "intra", image: "/assets/medical/intra-remote.jpg" },
  "post-overview": { kind: "composite", stage: "post", image: "/assets/medical/post-overview.jpg" },
  "video-planning": { kind: "video", stage: "pre", video: "/videos/planning.mp4" },
  "video-navigation": { kind: "video", stage: "intra", video: "/videos/navigation.mp4" },
  "video-review": { kind: "video", stage: "post", video: "/videos/review.mp4" },
  "video-analysis": { kind: "video", stage: "post", video: "/videos/analysis.mp4" }
};
```

Each image page must define percentage hotspots matching its baked text. Stage pages must also define button hotspots at the positions measured from `二级界面A.jpg`.

- [ ] **Step 3: Implement the React stage from the tested navigation functions**

`App.jsx` must render only:

```jsx
<div className="viewport">
  <div className="design-stage" data-page={state.current}>
    <PageSurface page={pages[state.current]} />
    <HotspotLayer page={pages[state.current]} />
  </div>
</div>
```

Hotspot handlers must call `event.stopPropagation()`. Page-level clicks call `goBack` only when the current page is not `home` and not an overview page. Video playback failures caused by missing files must leave the black surface usable and must not add visible error text.

- [ ] **Step 4: Implement strict 1920×1080 styling**

Use `aspect-ratio: 16 / 9`, `width: min(100vw, calc(100vh * 16 / 9))`, `height: min(100vh, calc(100vw * 9 / 16))`, black viewport bars, and absolutely positioned percentage hotspots. Composite pages use the common background, central white rounded frame, scene image with `object-fit: cover`, and the supplied button PNGs at the reference coordinates.

- [ ] **Step 5: Fix the Chinese document title and build**

Run: `npm.cmd run build`

Expected: Vite exits with code 0 and writes the production bundle to `dist`.

---

### Task 3: Browser interaction and visual fidelity QA

**Files:**
- Modify if QA finds a mismatch: `src/data/stages.js`, `src/App.jsx`, `src/styles.css`
- Temporary screenshots: outside the repository.

**Interfaces:**
- Consumes: working local app from Task 2.
- Produces: verified interaction paths and visual comparison evidence.

- [ ] **Step 1: Start the exact local server**

Run: `npm.cmd run dev -- --host 127.0.0.1`

Expected: Vite reports a local URL on `http://127.0.0.1:5173/` or the next available port.

- [ ] **Step 2: Verify the native desktop screen**

Using the in-app Browser, set the viewport to 1920×1080, open the local URL, confirm the title, DOM content, absence of framework overlays, and absence of relevant console errors. Capture the homepage and at least one page from each stage.

- [ ] **Step 3: Exercise every route**

Verify:

```text
home -> pre overview -> training -> back
home -> pre overview -> planning -> planning video -> back -> back
home -> intra overview -> remote -> back
home -> intra overview -> navigation video -> back
home -> post overview -> review video -> back
home -> post overview -> analysis video -> back
pre/intra/post bottom-button switching
```

- [ ] **Step 4: Compare against the supplied references**

Use `view_image` on the accepted references and the latest browser screenshot. Check at least: 16:9 framing, central frame geometry, scene crop, three button coordinates, active button image, background, lack of invented copy, and hotspot invisibility. Fix all material drift and repeat the checks.

- [ ] **Step 5: Run fresh completion verification**

Run:

```powershell
npm.cmd test
npm.cmd run build
```

Expected: zero test failures and a successful Vite production build.
