const area = (left, top, width, height) => ({ left, top, width, height });

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
    kind: "full-image",
    label: "数字化互动首页",
    image: "/assets/medical/home.jpg",
    returnOnSurface: false,
    hotspots: [
      {
        id: "home-pre",
        label: "进入术前全场景",
        action: "stage",
        target: "pre",
        area: area(8.3, 27.8, 25.1, 26)
      },
      {
        id: "home-intra",
        label: "进入术中全场景",
        action: "stage",
        target: "intra",
        area: area(37, 28, 25.1, 26)
      },
      {
        id: "home-post",
        label: "进入术后全场景",
        action: "stage",
        target: "post",
        area: area(66.4, 27.8, 25, 26)
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
    video: "/videos/planning.mp4"
  },
  "video-navigation": {
    kind: "video",
    label: "睿术术中导航视频",
    stage: "intra",
    video: "/videos/navigation.mp4"
  },
  "video-review": {
    kind: "video",
    label: "睿术手术复盘视频",
    stage: "post",
    video: "/videos/review.mp4"
  },
  "video-analysis": {
    kind: "video",
    label: "睿术数据分析视频",
    stage: "post",
    video: "/videos/analysis.mp4"
  }
};
