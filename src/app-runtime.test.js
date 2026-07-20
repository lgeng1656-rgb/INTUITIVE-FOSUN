import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("App JSX显式提供当前Vite配置所需的React运行时", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");
  assert.match(source, /^import React, \{/m);
});

test("页面切换保留旧画面直到目标图片或视频可以显示", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /transition-cover/);
  assert.match(source, /onReady/);
  assert.match(source, /onCanPlay/);
  assert.match(source, /preload="auto"/);
});

test("阶段入口使用手动播放的视频介绍页并允许点击空白返回", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(source, /function VideoIntroSurface/);
  assert.match(source, /className="video-intro-page"/);
  assert.match(source, /className="video-intro-copy"/);
  assert.match(source, />此处有内容此处有内容此处有内容。</);
  assert.match(source, /controls/);
  assert.match(source, /preload="metadata"/);
  assert.match(source, /onClick=\{\(event\) => event\.stopPropagation\(\)\}/);
  assert.match(styles, /\.video-intro-media\s*\{/);
  assert.match(styles, /\.video-intro-title\s*\{/);
  assert.match(styles, /text-indent:\s*2em/);
  assert.match(styles, /text-align:\s*left/);
});

test("视频播放期间保留上一级场景并优先预加载三个阶段总览", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /retained-scene/);
  assert.match(source, /retained/);
  assert.match(source, /CRITICAL_IMAGE_ASSETS/);
  assert.match(source, /pre-overview\.jpg/);
  assert.match(source, /intra-overview\.jpg/);
  assert.match(source, /post-overview\.jpg/);
});

test("首页提前连接广州 COS 以减少首次视频播放等待", async () => {
  const source = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(
    source,
    /rel="preconnect" href="https:\/\/intuitive-fosun-videos-1454170689\.cos\.ap-guangzhou\.myqcloud\.com"/
  );
});

test("首页使用独立组合图层和环形路径", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");
  const styles = await readFile(
    new URL("./styles.css", import.meta.url),
    "utf8"
  );

  assert.match(source, /function HomeSurface/);
  assert.match(source, /function HomeOrbitCanvas/);
  assert.match(source, /className="home-orbit home-orbit-top"/);
  assert.match(source, /className="home-orbit home-orbit-bottom"/);
  assert.match(source, /<canvas/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});

test("上下两段亮线与各自箭头沿开放轨迹同步运动", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");
  const styles = await readFile(
    new URL("./styles.css", import.meta.url),
    "utf8"
  );

  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /drawMovingSegment/);
  assert.match(source, /buildOrbitPolyline/);
  assert.match(source, /const ORBIT_LINE_WIDTH = ORBIT_BASE_LINE_WIDTH/);
  assert.match(source, /const ORBIT_DURATION = 16000/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(styles, /\.home-orbit/);
});

test("orbit animation cycles bright segments through four icon-safe paths", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /const ORBIT_SEGMENT_ORDER = \["top", "right", "bottom", "left"\]/);
  assert.match(source, /const ORBIT_TRAIL_LENGTH = 420/);
  assert.match(source, /const ORBIT_ACTIVE_GLOW = 10/);
  assert.match(source, /function getActiveOrbitPath/);
  assert.match(source, /const path = getActiveOrbitPath/);
  assert.doesNotMatch(source, /drawMovingSegment\(bottomContext, BOTTOM_ORBIT/);
});

test("two bright arrows stay half an orbit apart", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /const oppositeDistance = \(travelDistance \+ ORBIT_TOTAL_LENGTH \/ 2\) % ORBIT_TOTAL_LENGTH/);
  assert.match(source, /const orbitPositions = \[travelDistance, oppositeDistance\]/);
  assert.match(source, /orbitPositions\.map\(getLeadGap\)\.forEach/);
  assert.match(source, /drawAllBasePaths\(gapsByPath\)/);
  assert.match(source, /orbitPositions\.forEach\(drawOrbitPosition\)/);
  assert.match(source, /const ORBIT_ACTIVE_GLOW = 10/);
  assert.match(source, /shadowColor = "rgba\(255, 255, 255, 0\.72\)"/);
});

test("all four orbit paths stay visible behind the moving highlight", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /const ORBIT_BASE_LINE_WIDTH = 3\.4/);
  assert.match(source, /function drawBasePath/);
  assert.match(
    source,
    /function drawBasePath[\s\S]*context\.strokeStyle = "#fff";[\s\S]*context\.shadowBlur = ORBIT_ACTIVE_GLOW;/
  );
  assert.match(source, /function drawAllBasePaths/);
  assert.match(source, /ORBIT_PATHS\.forEach/);
});

test("moving arrow keeps a transparent break immediately ahead", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(source, /const ORBIT_LEAD_GAP = 58/);
  assert.match(source, /const ORBIT_TOP_OFFSET = 420/);
  assert.match(source, /\{ x: 420, y: 655 \}/);
  assert.match(source, /\{ x: 875, y: 440 \}/);
  assert.match(source, /\{ x: 3125, y: 440 \}/);
  assert.match(source, /\{ x: 3580, y: 655 \}/);
  assert.match(source, /\{ x: 3580, y: 1150 \}/);
  assert.match(source, /\{ x: 3125, y: 1362 \}/);
  assert.match(source, /\{ x: 875, y: 1362 \}/);
  assert.match(source, /\{ x: 420, y: 1150 \}/);
  assert.match(source, /function getLeadGap/);
  assert.match(source, /drawBasePath\(context, path\.polyline, gapsByPath\.get\(path\.name\) \?\? \[\]\)/);
  assert.doesNotMatch(source, /globalCompositeOperation = "destination-out"/);
  assert.doesNotMatch(source, /function eraseLeadGap/);
  assert.match(styles, /\.home-orbit-top\s*\{[^}]*top:\s*18\.6667%/s);
});

test("moving trail matches the base line and arrow fill has no rectangular shadow", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /const ORBIT_LINE_WIDTH = ORBIT_BASE_LINE_WIDTH/);
  assert.match(
    source,
    /context\.translate\(head\.x, head\.y\);[\s\S]*context\.shadowColor = "transparent";[\s\S]*context\.shadowBlur = 0;[\s\S]*context\.fill\(\);/
  );
});

test("right integration uses the native 4000px reference position", async () => {
  const styles = await readFile(new URL("./styles.css", import.meta.url), "utf8");
  const stages = await readFile(new URL("./data/stages.js", import.meta.url), "utf8");

  assert.match(styles, /\.home-integration-right\s*\{[^}]*left:\s*87\.35%/s);
  assert.match(stages, /area:\s*area\(86\.75,\s*33\.74,\s*7\.2,\s*17\)/);
});

test("upper homepage layout follows the supplied screenshot coordinates", async () => {
  const styles = await readFile(new URL("./styles.css", import.meta.url), "utf8");
  const stages = await readFile(new URL("./data/stages.js", import.meta.url), "utf8");

  assert.match(styles, /\.home-scene\s*\{[^}]*top:\s*23\.46%[^}]*width:\s*18\.31%[^}]*height:\s*18\.91%/s);
  assert.match(styles, /\.home-scene-pre\s*\{[^}]*left:\s*19\.38%/s);
  assert.match(styles, /\.home-scene-intra\s*\{[^}]*left:\s*40\.42%/s);
  assert.match(styles, /\.home-scene-post\s*\{[^}]*left:\s*62\.01%/s);
  assert.match(styles, /\.home-integration\s*\{[^}]*top:\s*33\.89%/s);
  assert.match(styles, /\.home-integration-left\s*\{[^}]*left:\s*6\.26%/s);
  assert.match(styles, /\.home-timeline\s*\{[^}]*left:\s*19\.38%[^}]*top:\s*45\.18%[^}]*width:\s*61\.25%/s);
  assert.match(styles, /\.home-stage-copy\s*\{[^}]*top:\s*47\.45%[^}]*width:\s*18\.31%/s);
  assert.match(stages, /area:\s*area\(19\.38,\s*23\.46,\s*9\.155,\s*18\.91\)/);
  assert.match(stages, /area:\s*area\(71\.165,\s*23\.46,\s*9\.155,\s*18\.91\)/);
  assert.match(stages, /area:\s*area\(5\.86,\s*33\.74,\s*7\.5,\s*17\)/);
});

test("首页保留阶段时间轴、标题和六个分类标签", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /className="home-timeline"/);
  for (const copy of [
    "术前",
    "技能培训",
    "手术规划",
    "术中",
    "术中决策",
    "远程教学",
    "术后",
    "质控管理",
    "手术复盘"
  ]) {
    assert.match(source, new RegExp(`>${copy}<`));
  }
});

test("bottom glass container breathes slowly without moving its content", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("./styles.css", import.meta.url), "utf8");

  assert.match(source, /className="home-bottom-breath"/);
  assert.match(styles, /\.home-bottom-breath\s*\{[\s\S]*animation:\s*home-bottom-breathe 5s ease-in-out infinite;/);
  assert.match(styles, /@keyframes home-bottom-breathe/);
  assert.match(styles, /opacity:\s*0\.35/);
  assert.match(styles, /opacity:\s*0\.7/);
  const animationStart = styles.indexOf("@keyframes home-bottom-breathe");
  const animationEnd = styles.indexOf(".home-scene", animationStart);
  const animationBlock = styles.slice(animationStart, animationEnd);
  assert.doesNotMatch(animationBlock, /transform:/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce[\s\S]*\.home-bottom-breath[\s\S]*animation:\s*none/);
});
