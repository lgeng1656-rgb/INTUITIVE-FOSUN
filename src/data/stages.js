const area = (left, top, width, height) => ({ left, top, width, height });
const videoBaseUrl =
  "https://intuitive-fosun-videos-1454170689.cos.ap-guangzhou.myqcloud.com";
const videoIntroBackground = "/assets/medical/video-intro-background.jpg";

const videoIntroPage = ({ label, titleImage, video, cover, copy }) => ({
  kind: "video-intro",
  label,
  background: videoIntroBackground,
  titleImage,
  video,
  cover,
  copy,
  returnOnSurface: true,
  hotspots: []
});

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
        area: area(5.86, 33.74, 7.5, 17)
      },
      {
        id: "home-ui-integration",
        label: "播放用户界面整合视频",
        action: "page",
        target: "video-ui-integration",
        area: area(86.75, 33.74, 7.2, 17)
      },
      {
        id: "home-skills-training",
        label: "播放技能培训视频",
        action: "page",
        target: "video-skills-training",
        area: area(19.38, 23.46, 9.155, 18.91)
      },
      {
        id: "home-surgery-planning",
        label: "播放手术规划视频",
        action: "page",
        target: "video-surgery-planning",
        area: area(28.535, 23.46, 9.155, 18.91)
      },
      {
        id: "home-intraoperative-assistance",
        label: "播放术中辅助视频",
        action: "page",
        target: "video-intraoperative-assistance",
        area: area(40.42, 23.46, 9.155, 18.91)
      },
      {
        id: "home-remote-teaching",
        label: "播放远程教学视频",
        action: "page",
        target: "video-remote-teaching",
        area: area(49.575, 23.46, 9.155, 18.91)
      },
      {
        id: "home-surgery-review",
        label: "播放手术复盘视频",
        action: "page",
        target: "video-surgery-review",
        area: area(62.01, 23.46, 9.155, 18.91)
      },
      {
        id: "home-quality-control",
        label: "播放质控管理视频",
        action: "page",
        target: "video-quality-control",
        area: area(71.165, 23.46, 9.155, 18.91)
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
    ...videoIntroPage({
      label: "术前-技能培训",
      titleImage: "/assets/medical/video-intro-title-skills-training.png",
      cover: "/assets/medical/video-intro-cover-skills-training.png"
    })
  },
  "video-surgery-planning": {
    ...videoIntroPage({
      label: "术前-手术规划",
      titleImage: "/assets/medical/video-intro-title-surgery-planning.png",
      video: `${videoBaseUrl}/%E6%89%8B%E6%9C%AF%E8%A7%84%E5%88%92%E6%96%B0.mp4`,
      copy: [
        "覆盖胸、肝、肾 三大领域",
        "AI自动精准重建，看清每一个患者的解剖差异",
        "5分钟快速交付",
        "院内部署，数据直连CT或PACS",
        "图文报告一键归档"
      ]
    })
  },
  "video-intraoperative-assistance": {
    ...videoIntroPage({
      label: "术中-辅助决策",
      titleImage: "/assets/medical/video-intro-title-intraoperative-assistance.png",
      video: `${videoBaseUrl}/2%E6%9C%AF%E4%B8%AD%E8%BE%85%E5%8A%A9.mp4`
    })
  },
  "video-remote-teaching": {
    ...videoIntroPage({
      label: "术中-远程教学",
      titleImage: "/assets/medical/video-intro-title-remote-teaching.png",
      video: `${videoBaseUrl}/2%E8%BF%9C%E7%A8%8B%E6%95%99%E5%AD%A6.mp4`
    })
  },
  "video-quality-control": {
    ...videoIntroPage({
      label: "术后-质控管理",
      titleImage: "/assets/medical/video-intro-title-quality-control.png",
      cover: "/assets/medical/video-intro-cover-quality-control.png"
    })
  },
  "video-surgery-review": {
    ...videoIntroPage({
      label: "术后-手术复盘",
      titleImage: "/assets/medical/video-intro-title-surgery-review.png",
      video: `${videoBaseUrl}/3%E6%89%8B%E6%9C%AF%E5%A4%8D%E7%9B%98.mp4`
    })
  }
};
