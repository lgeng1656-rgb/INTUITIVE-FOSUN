import test from "node:test";
import assert from "node:assert/strict";
import { pages, stageButtons } from "./stages.js";

test("首页只有术前术中术后三个场景入口", () => {
  assert.deepEqual(
    pages.home.hotspots.map(({ action, target }) => [action, target]),
    [
      ["stage", "pre"],
      ["stage", "intra"],
      ["stage", "post"]
    ]
  );
});

test("术前流程映射到技能培训、手术规划和规划视频", () => {
  assert.deepEqual(
    pages["pre-overview"].hotspots.map(({ target }) => target),
    ["pre-training", "pre-planning"]
  );
  assert.equal(
    pages["pre-planning"].hotspots[0].target,
    "video-planning"
  );
});

test("术中和术后入口映射到流程图指定内容", () => {
  assert.deepEqual(
    pages["intra-overview"].hotspots.map(({ target }) => target),
    ["video-navigation", "intra-remote"]
  );
  assert.deepEqual(
    pages["post-overview"].hotspots.map(({ target }) => target),
    ["video-review", "video-analysis"]
  );
});

test("三个阶段按钮都有点亮和未点亮素材", () => {
  for (const stage of ["pre", "intra", "post"]) {
    assert.match(stageButtons[stage].idle, /^\/assets\/medical\//);
    assert.match(stageButtons[stage].active, /^\/assets\/medical\//);
  }
});

test("四个视频入口使用固定 MP4 文件名", () => {
  assert.deepEqual(
    [
      pages["video-planning"].video,
      pages["video-navigation"].video,
      pages["video-review"].video,
      pages["video-analysis"].video
    ],
    [
      "/videos/planning.mp4",
      "/videos/navigation.mp4",
      "/videos/review.mp4",
      "/videos/analysis.mp4"
    ]
  );
});

test("除首页外的每个图片页面都能点击空白区域返回上一页", () => {
  const imagePages = Object.entries(pages)
    .filter(([id, page]) => id !== "home" && page.kind !== "video")
    .map(([, page]) => page);

  assert.ok(imagePages.length > 0);
  assert.ok(imagePages.every((page) => page.returnOnSurface === true));
});
