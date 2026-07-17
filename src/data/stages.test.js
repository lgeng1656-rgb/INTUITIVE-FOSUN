import test from "node:test";
import assert from "node:assert/strict";
import { pages, stageButtons } from "./stages.js";

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
    Object.fromEntries(
      pages.home.hotspots.map(({ id, action, target }) => {
        assert.equal(action, "page");
        return [id, target];
      })
    ),
    expectedHomeVideoTargets
  );
});

test("首页八个入口目标都是独立腾讯云视频页面", () => {
  for (const target of Object.values(expectedHomeVideoTargets)) {
    assert.equal(pages[target].kind, "video");
    assert.match(
      pages[target].video,
      /^https:\/\/intuitive-fosun-videos-1454170689\.cos\.ap-guangzhou\.myqcloud\.com\//
    );
  }
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
      "https://intuitive-fosun-videos-1454170689.cos.ap-guangzhou.myqcloud.com/planning.mp4",
      "https://intuitive-fosun-videos-1454170689.cos.ap-guangzhou.myqcloud.com/navigation.mp4",
      "https://intuitive-fosun-videos-1454170689.cos.ap-guangzhou.myqcloud.com/review.mp4",
      "https://intuitive-fosun-videos-1454170689.cos.ap-guangzhou.myqcloud.com/analysis.mp4"
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
