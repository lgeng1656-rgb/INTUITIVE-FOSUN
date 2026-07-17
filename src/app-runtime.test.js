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
  assert.match(source, /className="home-orbit"/);
  assert.match(source, /<animateMotion/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /\.home-orbit-arrow/);
});

test("首页保留阶段时间轴、标题和六个分类标签", async () => {
  const source = await readFile(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(source, /className="home-timeline"/);
  for (const copy of [
    "术前",
    "技能培训",
    "手术规划",
    "术中",
    "远程教学",
    "术中导航",
    "术后",
    "手术复盘",
    "临床研究"
  ]) {
    assert.match(source, new RegExp(`>${copy}<`));
  }
});
