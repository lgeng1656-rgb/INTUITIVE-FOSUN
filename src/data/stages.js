const area = (left, top, width, height) => ({ left, top, width, height });
const videoBaseUrl =
  "https://intuitive-fosun-videos-1454170689.cos.ap-guangzhou.myqcloud.com";

export const stageButtons = {
  pre: {
    label: "术前",
    idle: "/assets/medical/pre.png",
    active: "/assets/medical/pre-active.png",
    area: area(16.4, 84.5, 15.9, 7.9)
  },
  intra: {
    label: "术中",
    idle: "/assets/medical/intra.png",
    active: "/assets/medical/intra-active.png",
    area: area(41.8, 84.5, 15.9, 7.9)
  },
  post: {
    label: "术后",
    idle: "/assets/medical/post.png",
    active: "/assets/medical/post-active.png",
    area: area(67.8, 84.5, 15.9, 7.9)
  }
};

export const pages = {
  home: {
    kind: "home",
    label: "数字化互动首页",
    returnOnSurface: false,
    hotspots: [
      {
        id: "home-robot-integration",
        label: "播放机器人功能整合视频",
        action: "page",
        target: "video-robot-integration",
        area: area(7.1, 34.5, 7.5, 17)
      },
      {
        id: "home-ui-integration",
        label: "播放用户界面整合视频",
        action: "page",
        target: "video-ui-integration",
        area: area(92.8, 34.5, 7.2, 17)
      },
      {
        id: "home-skills-training",
        label: "播放技能培训视频",
        action: "page",
        target: "video-skills-training",
        area: area(20.625, 25, 9.8175, 20.28)
      },
      {
        id: "home-surgery-planning",
        label: "播放手术规划视频",
        action: "page",
        target: "video-surgery-planning",
        area: area(30.4425, 25, 9.8175, 20.28)
      },
      {
        id: "home-intraoperative-assistance",
        label: "播放术中辅助视频",
        action: "page",
        target: "video-intraoperative-assistance",
        area: area(43.02, 25, 9.8175, 20.28)
      },
      {
        id: "home-remote-teaching",
        label: "播放远程教学视频",
        action: "page",
        target: "video-remote-teaching",
        area: area(52.8375, 25, 9.8175, 20.28)
      },
      {
        id: "home-quality-control",
        label: "播放质控管理视频",
        action: "page",
        target: "video-quality-control",
        area: area(66.04, 25, 9.8175, 20.28)
      },
      {
        id: "home-surgery-review",
        label: "播放手术复盘视频",
        action: "page",
        target: "video-surgery-review",
        area: area(75.8575, 25, 9.8175, 20.28)
      }
    ]
  },
  "pre-overview": {
    kind: "full-image",
    label: "术前全场景",
    stage: "pre",
    image: "/assets/medical/pre-overview.jpg",
    buttons: "baked",
    returnOnSurface: true,
    hotspots: [
      {
        id: "pre-training",
        label: "进入技能培训场景",
        action: "page",
        target: "pre-training",
        area: area(25.5, 27, 29, 48)
      },
      {
        id: "pre-planning",
        label: "进入手术规划场景",
        action: "page",
        target: "pre-planning",
        area: area(55, 25, 29, 47)
      }
    ]
  },
  "pre-training": {
    kind: "full-image",
    label: "技能培训场景",
    stage: "pre",
    image: "/assets/medical/pre-training.jpg",
    buttons: "baked",
    returnOnSurface: true,
    hotspots: []
  },
  "pre-planning": {
    kind: "full-image",
    label: "手术规划场景",
    stage: "pre",
    image: "/assets/medical/pre-planning.jpg",
    buttons: "baked",
    returnOnSurface: true,
    hotspots: [
      {
        id: "planning-video",
        label: "播放推想手术规划视频",
        action: "page",
        target: "video-planning",
        area: area(50.5, 37.5, 31.5, 19)
      }
    ]
  },
  "intra-overview": {
    kind: "composite",
    label: "术中全场景",
    stage: "intra",
    image: "/assets/medical/intra-overview.jpg",
    buttons: "rendered",
    returnOnSurface: true,
    hotspots: [
      {
        id: "navigation-video",
        label: "播放术中导航视频",
        action: "page",
        target: "video-navigation",
        area: area(19, 20, 22, 31)
      },
      {
        id: "intra-remote",
        label: "进入远程教学场景",
        action: "page",
        target: "intra-remote",
        area: area(46, 49, 24, 28)
      }
    ]
  },
  "intra-remote": {
    kind: "composite",
    label: "远程教学场景",
    stage: "intra",
    image: "/assets/medical/intra-remote.jpg",
    buttons: "rendered",
    returnOnSurface: true,
    hotspots: []
  },
  "post-overview": {
    kind: "composite",
    label: "术后全场景",
    stage: "post",
    image: "/assets/medical/post-overview.jpg",
    buttons: "rendered",
    returnOnSurface: true,
    hotspots: [
      {
        id: "review-video",
        label: "播放手术复盘视频",
        action: "page",
        target: "video-review",
        area: area(25, 22, 29, 31)
      },
      {
        id: "analysis-video",
        label: "播放质控管理数据分析视频",
        action: "page",
        target: "video-analysis",
        area: area(47, 48, 30, 27)
      }
    ]
  },
  "video-planning": {
    kind: "video",
    label: "推想手术规划视频",
    stage: "pre",
    video: `${videoBaseUrl}/planning.mp4`
  },
  "video-navigation": {
    kind: "video",
    label: "睿术术中导航视频",
    stage: "intra",
    video: `${videoBaseUrl}/navigation.mp4`
  },
  "video-review": {
    kind: "video",
    label: "睿术手术复盘视频",
    stage: "post",
    video: `${videoBaseUrl}/review.mp4`
  },
  "video-analysis": {
    kind: "video",
    label: "睿术数据分析视频",
    stage: "post",
    video: `${videoBaseUrl}/analysis.mp4`
  },
  "video-robot-integration": {
    kind: "video",
    label: "机器人功能整合视频",
    video: `${videoBaseUrl}/planning.mp4`
  },
  "video-ui-integration": {
    kind: "video",
    label: "用户界面整合视频",
    video: `${videoBaseUrl}/planning.mp4`
  },
  "video-skills-training": {
    kind: "video",
    label: "技能培训视频",
    video: `${videoBaseUrl}/planning.mp4`
  },
  "video-surgery-planning": {
    kind: "video",
    label: "手术规划视频",
    video: `${videoBaseUrl}/planning.mp4`
  },
  "video-intraoperative-assistance": {
    kind: "video",
    label: "术中辅助视频",
    video: `${videoBaseUrl}/planning.mp4`
  },
  "video-remote-teaching": {
    kind: "video",
    label: "远程教学视频",
    video: `${videoBaseUrl}/planning.mp4`
  },
  "video-quality-control": {
    kind: "video",
    label: "质控管理视频",
    video: `${videoBaseUrl}/planning.mp4`
  },
  "video-surgery-review": {
    kind: "video",
    label: "手术复盘视频",
    video: `${videoBaseUrl}/planning.mp4`
  }
};
