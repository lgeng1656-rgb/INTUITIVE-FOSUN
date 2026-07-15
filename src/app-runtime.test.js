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
