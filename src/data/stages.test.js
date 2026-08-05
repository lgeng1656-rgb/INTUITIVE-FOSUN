import test from "node:test";
import assert from "node:assert/strict";
import { pages, stageButtons } from "./stages.js";

const videoBaseUrl =
  "https://intuitive-fosun-videos-1454170689.cos.ap-guangzhou.myqcloud.com";

test("首页阶段画面和文字区域进入三个阶段放大页", () => {
  assert.deepEqual(
    pages.home.hotspots
      .filter(({ action }) => action === "stage")
      .map(({ id, target, area }) => ({ id, target, area })),
    [
      {
        id: "home-pre",
        target: "pre",
        area: { left: 19.38, top: 23.46, width: 18.31, height: 35.5 }
      },
      {
        id: "home-intra",
        target: "intra",
        area: { left: 40.42, top: 23.46, width: 18.31, height: 35.5 }
      },
      {
        id: "home-post",
        target: "post",
        area: { left: 62.01, top: 23.46, width: 18.31, height: 35.5 }
      }
    ]
  );
});

test("首页保留左右两个整合入口", () => {
  const integrations = pages.home.hotspots
    .filter(({ id }) => id.includes("integration"))
    .map(({ id, target }) => ({ id, target }));

  assert.deepEqual(integrations, [
    {
      id: "home-robot-integration",
      target: "video-robot-integration"
    },
    {
      id: "home-ui-integration",
      target: "video-ui-integration"
    }
  ]);
});

test("阶段放大页使用新版暗亮画面并按左右两半进入对应三级页", () => {
  assert.deepEqual(
    ["pre", "intra", "post"].map((stage) => {
      const page = pages[`${stage}-overview`];
      return {
        stage,
        kind: page.kind,
        returnOnSurface: page.returnOnSurface,
        idleImage: page.idleImage,
        image: page.image,
        targets: page.hotspots.map(({ target }) => target),
        areas: page.hotspots.map(({ area }) => area),
        returnButton: page.returnButton
      };
    }),
    [
      {
        stage: "pre",
        kind: "stage-overview",
        returnOnSurface: false,
        idleImage: "/assets/medical/stage-pre-idle-20260730.webp",
        image: "/assets/medical/stage-pre-active-20260730.webp",
        targets: ["video-skills-training", "video-surgery-planning"],
        areas: [
          { left: 0, top: 0, width: 50, height: 100 },
          { left: 50, top: 0, width: 50, height: 100 }
        ],
        returnButton: { left: 1.5, top: 85.5, width: 7, height: 13.5 }
      },
      {
        stage: "intra",
        kind: "stage-overview",
        returnOnSurface: false,
        idleImage: "/assets/medical/stage-intra-idle-20260730.webp",
        image: "/assets/medical/stage-intra-active-20260730.webp",
        targets: ["video-intraoperative-assistance", "video-remote-teaching"],
        areas: [
          { left: 0, top: 0, width: 50, height: 100 },
          { left: 50, top: 0, width: 50, height: 100 }
        ],
        returnButton: { left: 1.5, top: 85.5, width: 7, height: 13.5 }
      },
      {
        stage: "post",
        kind: "stage-overview",
        returnOnSurface: false,
        idleImage: "/assets/medical/stage-post-idle-20260730.webp",
        image: "/assets/medical/stage-post-active-20260730.webp",
        targets: ["video-surgery-review", "video-quality-control"],
        areas: [
          { left: 0, top: 0, width: 50, height: 100 },
          { left: 50, top: 0, width: 50, height: 100 }
        ],
        returnButton: { left: 1.5, top: 85.5, width: 7, height: 13.5 }
      }
    ]
  );
});

test("阶段放大页叠加七个新版点击图标并保留原呼吸灯画面", () => {
  assert.deepEqual(
    ["pre", "intra", "post"].map((stage) => ({
      stage,
      icons: pages[`${stage}-overview`].icons
    })),
    [
      {
        stage: "pre",
        icons: [
          {
            src: "/assets/medical/click-pre-left-top.png",
            area: { left: 39.85, top: 40.93, width: 6.51, height: 11.57 }
          },
          {
            src: "/assets/medical/click-pre-left-bottom.png",
            area: { left: 8.85, top: 66.85, width: 6.51, height: 11.57 }
          },
          {
            src: "/assets/medical/click-pre-right.png",
            area: { left: 59.75, top: 50.37, width: 6.51, height: 11.57 }
          }
        ]
      },
      {
        stage: "intra",
        icons: [
          {
            src: "/assets/medical/click-intra-left.png",
            area: { left: 33.85, top: 40.37, width: 6.51, height: 11.57 }
          },
          {
            src: "/assets/medical/click-intra-right.png",
            area: { left: 85.85, top: 13.89, width: 6.51, height: 11.57 }
          }
        ]
      },
      {
        stage: "post",
        icons: [
          {
            src: "/assets/medical/click-post-left.png",
            area: { left: 25.35, top: 45.93, width: 6.51, height: 11.57 }
          },
          {
            src: "/assets/medical/click-post-right.png",
            area: { left: 91.35, top: 43.15, width: 6.51, height: 11.57 }
          }
        ]
      }
    ]
  );
});

test("六个阶段三级页和临床应用整合页使用整图背景与右侧视频", () => {
  const expected = {
    "video-skills-training": "/assets/medical/detail-pre-skills-20260730.webp",
    "video-surgery-planning": "/assets/medical/detail-pre-planning-20260729.webp",
    "video-intraoperative-assistance": "/assets/medical/detail-intra-assistance-20260729.webp",
    "video-remote-teaching": "/assets/medical/detail-intra-remote-20260729.webp",
    "video-surgery-review": "/assets/medical/detail-post-review-20260729.webp",
    "video-quality-control": "/assets/medical/detail-post-quality-20260730.webp",
    "video-robot-integration": "/assets/medical/detail-clinical-integration-20260730.webp"
  };

  for (const [id, background] of Object.entries(expected)) {
    assert.equal(pages[id].kind, "embedded-video");
    assert.equal(pages[id].background, background);
    assert.equal(pages[id].returnOnSurface, false);
    assert.deepEqual(pages[id].mediaArea, {
      left: 31,
      top: 15.5,
      width: 68,
      height: 68.5
    });
    assert.match(pages[id].video, /^https:\/\/intuitive-fosun-videos-/);
  }
});

test("阶段三级页保持指定腾讯 COS 视频映射", () => {
  assert.deepEqual(
    {
      skills: pages["video-skills-training"].video,
      planning: pages["video-surgery-planning"].video,
      assistance: pages["video-intraoperative-assistance"].video,
      teaching: pages["video-remote-teaching"].video,
      review: pages["video-surgery-review"].video,
      quality: pages["video-quality-control"].video
    },
    {
      skills: `${videoBaseUrl}/%E6%8A%80%E8%83%BD%E5%9F%B9%E8%AE%AD0730.mp4`,
      planning: `${videoBaseUrl}/%E6%89%8B%E6%9C%AF%E8%A7%84%E5%88%92%E6%96%B0.mp4`,
      assistance: `${videoBaseUrl}/2%E8%BE%85%E5%8A%A9%E5%86%B3%E7%AD%96.mp4`,
      teaching: `${videoBaseUrl}/2%E8%BF%9C%E7%A8%8B%E6%95%99%E5%AD%A6.mp4`,
      review: `${videoBaseUrl}/3%E6%89%8B%E6%9C%AF%E5%A4%8D%E7%9B%980727.mp4`,
      quality: `${videoBaseUrl}/3%E8%B4%A8%E6%8E%A7%E7%AE%A1%E7%90%860730%E6%9B%B4%E6%96%B0.mp4`
    }
  );
});

test("首页只保留一个技能培训视频入口", () => {
  const skillHotspots = pages.home.hotspots.filter(({ id }) =>
    id.startsWith("home-skills-training")
  );

  assert.deepEqual(
    skillHotspots.map(({ id, target }) => ({ id, target })),
    [
      {
        id: "home-skills-training",
        target: "video-skills-training"
      }
    ]
  );
  assert.equal(pages["video-skills-training-secondary"], undefined);
});

test("临床应用功能整合进入二级页面并使用指定视频", () => {
  assert.equal(pages["video-robot-integration"].kind, "embedded-video");
  assert.equal(
    pages["video-robot-integration"].video,
    `${videoBaseUrl}/%E4%B8%B4%E5%BA%8A%E5%BA%94%E7%94%A8%E5%8A%9F%E8%83%BD%E6%95%B4%E5%90%88.mp4`
  );
});

test("首页右侧用户界面整合入口使用指定视频", () => {
  assert.equal(
    pages["video-ui-integration"].video,
    `${videoBaseUrl}/%E5%8F%B3%E8%BE%B9%E7%94%A8%E6%88%B7%E7%95%8C%E9%9D%A2%E6%95%B4%E5%90%88.m4v`
  );
});

test("三个旧阶段按钮素材仍被保留用于兼容现有页面", () => {
  for (const stage of ["pre", "intra", "post"]) {
    assert.match(stageButtons[stage].idle, /^\/assets\/medical\//);
    assert.match(stageButtons[stage].active, /^\/assets\/medical\//);
  }
});

test("阶段二级页面只能通过左下角按钮返回首页", () => {
  for (const stage of ["pre", "intra", "post"]) {
    const page = pages[`${stage}-overview`];
    assert.equal(page.returnOnSurface, false);
    assert.deepEqual(page.returnButton, {
      left: 1.5,
      top: 85.5,
      width: 7,
      height: 13.5
    });
  }
});

test("所有三级页面只能通过左下角按钮返回上一级", () => {
  const tertiaryPages = Object.entries(pages)
    .filter(([id, page]) => id !== "home" && page.kind !== "stage-overview")
    .map(([, page]) => page);

  assert.ok(tertiaryPages.length > 0);
  assert.ok(tertiaryPages.every((page) => page.returnOnSurface === false));
});
