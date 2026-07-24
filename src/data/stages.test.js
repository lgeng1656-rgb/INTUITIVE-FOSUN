import test from "node:test";
import assert from "node:assert/strict";
import { pages, stageButtons } from "./stages.js";

const videoBaseUrl =
  "https://intuitive-fosun-videos-1454170689.cos.ap-guangzhou.myqcloud.com";

const expectedHomeTargets = {
  "home-robot-integration": "video-robot-integration",
  "home-ui-integration": "video-ui-integration",
  "home-skills-training": "video-skills-training",
  "home-surgery-planning": "video-surgery-planning",
  "home-intraoperative-assistance": "video-intraoperative-assistance",
  "home-remote-teaching": "video-remote-teaching",
  "home-quality-control": "video-quality-control",
  "home-surgery-review": "video-surgery-review"
};

test("updated homepage navigation keeps the requested copy, order, and targets", () => {
  assert.equal(
    pages["video-surgery-planning"].video,
    `${videoBaseUrl}/%E6%89%8B%E6%9C%AF%E8%A7%84%E5%88%92%E6%96%B0.mp4`
  );
  assert.equal(pages["video-intraoperative-assistance"].label, "术中-辅助决策");

  const postHotspots = pages.home.hotspots.filter(({ id }) =>
    ["home-surgery-review", "home-quality-control"].includes(id)
  );
  assert.deepEqual(
    postHotspots.map(({ id, target, area }) => ({ id, target, left: area.left })),
    [
      {
        id: "home-surgery-review",
        target: "video-surgery-review",
        left: 62.01
      },
      {
        id: "home-quality-control",
        target: "video-quality-control",
        left: 71.165
      }
    ]
  );
});

test("surgery planning intro uses the supplied five-line copy only", () => {
  assert.deepEqual(pages["video-surgery-planning"].copy, [
    "覆盖胸、肝、肾 三大领域",
    "AI自动精准重建，看清每一个患者的解剖差异",
    "5分钟快速交付",
    "院内部署，数据直连CT或PACS",
    "图文报告一键归档"
  ]);
  assert.equal(pages["video-intraoperative-assistance"].copy, undefined);
});

test("首页提供两个整合视频入口和六个视频介绍入口", () => {
  assert.deepEqual(
    Object.fromEntries(
      pages.home.hotspots.map(({ id, action, target }) => {
        assert.equal(action, "page");
        return [id, target];
      })
    ),
    expectedHomeTargets
  );
});

test("左右整合入口保持全屏自动播放，六个阶段入口进入手动视频介绍页", () => {
  for (const target of ["video-robot-integration", "video-ui-integration"]) {
    assert.equal(pages[target].kind, "video");
  }

  for (const target of Object.values(expectedHomeTargets).slice(2)) {
    assert.equal(pages[target].kind, "video-intro");
    assert.equal(pages[target].returnOnSurface, true);
    assert.match(pages[target].titleImage, /^\/assets\/medical\/video-intro-/);
  }
});

test("机器人功能整合使用指定的新版 COS 视频", () => {
  assert.equal(
    pages["video-robot-integration"].video,
    `${videoBaseUrl}/%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%8A%9F%E8%83%BD%E6%95%B4%E5%90%88.mp4`
  );
  assert.equal(pages["video-ui-integration"].video, `${videoBaseUrl}/planning.mp4`);
});

test("四个视频介绍页使用更新后的腾讯云视频，两个待定项目使用封面图片", () => {
  assert.deepEqual(
    {
      planning: pages["video-surgery-planning"].video,
      assistance: pages["video-intraoperative-assistance"].video,
      teaching: pages["video-remote-teaching"].video,
      review: pages["video-surgery-review"].video
    },
    {
      planning: `${videoBaseUrl}/%E6%89%8B%E6%9C%AF%E8%A7%84%E5%88%92%E6%96%B0.mp4`,
      assistance: `${videoBaseUrl}/2%E6%9C%AF%E4%B8%AD%E8%BE%85%E5%8A%A9.mp4`,
      teaching: `${videoBaseUrl}/2%E8%BF%9C%E7%A8%8B%E6%95%99%E5%AD%A6.mp4`,
      review: `${videoBaseUrl}/3%E6%89%8B%E6%9C%AF%E5%A4%8D%E7%9B%98.mp4`
    }
  );
  assert.equal(pages["video-skills-training"].video, undefined);
  assert.equal(pages["video-quality-control"].video, undefined);
  assert.match(pages["video-skills-training"].cover, /skills-training/);
  assert.match(pages["video-quality-control"].cover, /quality-control/);
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
