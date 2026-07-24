import test from "node:test";
import assert from "node:assert/strict";
import { pages, stageButtons } from "./stages.js";

const videoBaseUrl =
  "https://intuitive-fosun-videos-1454170689.cos.ap-guangzhou.myqcloud.com";

const expectedHomeTargets = {
  "home-robot-integration": "video-robot-integration",
  "home-ui-integration": "video-ui-integration",
  "home-skills-training": "video-skills-training",
  "home-skills-training-secondary": "video-skills-training-secondary",
  "home-surgery-planning": "video-surgery-planning",
  "home-intraoperative-assistance": "video-intraoperative-assistance",
  "home-remote-teaching": "video-remote-teaching",
  "home-quality-control": "video-quality-control",
  "home-surgery-review": "video-surgery-review"
};

const bakedIntroBackgrounds = {
  "video-skills-training": "/assets/medical/secondary-pre-skills.jpg",
  "video-skills-training-secondary": "/assets/medical/secondary-pre-skills.jpg",
  "video-surgery-planning": "/assets/medical/secondary-pre-planning.jpg",
  "video-intraoperative-assistance": "/assets/medical/secondary-intra-assistance.jpg",
  "video-remote-teaching": "/assets/medical/secondary-intra-remote.jpg",
  "video-quality-control": "/assets/medical/secondary-post-quality.jpg"
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

test("surgery planning intro uses the copy baked into its background", () => {
  assert.equal(pages["video-surgery-planning"].copy, undefined);
  assert.equal(pages["video-surgery-planning"].contentBaked, true);
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

test("术前左侧两个屏幕进入独立的技能培训页并播放各自视频", () => {
  const targets = [
    expectedHomeTargets["home-skills-training"],
    expectedHomeTargets["home-skills-training-secondary"]
  ];

  assert.notEqual(targets[0], targets[1]);
  assert.deepEqual(
    targets.map((target) => ({
      kind: pages[target].kind,
      label: pages[target].label,
      video: pages[target].video
    })),
    [
      {
        kind: "video-intro",
        label: "术前-技能培训",
        video: `${videoBaseUrl}/%E6%B5%8B%E8%AF%95.mp4`
      },
      {
        kind: "video-intro",
        label: "术前-技能培训",
        video: `${videoBaseUrl}/planning.mp4`
      }
    ]
  );

  const hotspots = pages.home.hotspots.filter(({ id }) =>
    ["home-skills-training", "home-skills-training-secondary"].includes(id)
  );
  assert.deepEqual(
    hotspots.map(({ area }) => area),
    [
      { left: 24.91, top: 25.18, width: 3.86, height: 6.36 },
      { left: 21.75, top: 32.25, width: 3.46, height: 4.46 }
    ]
  );
});

test("五类更新后的二级页使用文字已烘焙的独立背景", () => {
  for (const [target, background] of Object.entries(bakedIntroBackgrounds)) {
    assert.equal(pages[target].background, background);
    assert.equal(pages[target].contentBaked, true);
  }

  assert.equal(pages["video-surgery-review"].contentBaked, undefined);
});

test("左右整合入口保持全屏自动播放，阶段入口进入手动视频介绍页", () => {
  for (const target of ["video-robot-integration", "video-ui-integration"]) {
    assert.equal(pages[target].kind, "video");
  }

  for (const target of Object.values(expectedHomeTargets).slice(2)) {
    assert.equal(pages[target].kind, "video-intro");
    assert.equal(pages[target].returnOnSurface, true);
    if (pages[target].contentBaked) {
      assert.equal(pages[target].titleImage, undefined);
    } else {
      assert.match(pages[target].titleImage, /^\/assets\/medical\/video-intro-/);
    }
  }
});

test("机器人功能整合使用指定的新版 COS 视频", () => {
  assert.equal(
    pages["video-robot-integration"].video,
    `${videoBaseUrl}/%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%8A%9F%E8%83%BD%E6%95%B4%E5%90%88.mp4`
  );
  assert.equal(pages["video-ui-integration"].video, `${videoBaseUrl}/planning.mp4`);
});

test("六个视频介绍页使用腾讯云视频", () => {
  assert.deepEqual(
    {
      planning: pages["video-surgery-planning"].video,
      assistance: pages["video-intraoperative-assistance"].video,
      teaching: pages["video-remote-teaching"].video,
      review: pages["video-surgery-review"].video
    },
    {
      planning: `${videoBaseUrl}/%E6%89%8B%E6%9C%AF%E8%A7%84%E5%88%92%E6%96%B0.mp4`,
      assistance: `${videoBaseUrl}/2%E8%BE%85%E5%8A%A9%E5%86%B3%E7%AD%96.mp4`,
      teaching: `${videoBaseUrl}/2%E8%BF%9C%E7%A8%8B%E6%95%99%E5%AD%A6.mp4`,
      review: `${videoBaseUrl}/3%E6%89%8B%E6%9C%AF%E5%A4%8D%E7%9B%98.mp4`
    }
  );
  assert.equal(
    pages["video-skills-training"].video,
    `${videoBaseUrl}/%E6%B5%8B%E8%AF%95.mp4`
  );
  assert.equal(
    pages["video-quality-control"].video,
    `${videoBaseUrl}/3%E8%B4%A8%E6%8E%A7%E7%AE%A1%E7%90%86.mp4`
  );
  assert.equal(pages["video-skills-training"].cover, undefined);
  assert.equal(pages["video-quality-control"].cover, undefined);
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
