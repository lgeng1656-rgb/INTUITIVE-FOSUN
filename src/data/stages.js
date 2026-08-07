const area = (left, top, width, height) => ({ left, top, width, height });
const videoBaseUrl =
  "https://intuitive-fosun-videos-1454170689.cos.ap-guangzhou.myqcloud.com";
const videoIntroBackground = "/assets/medical/video-intro-background.webp";

const videoIntroPage = ({
  label,
  titleImage,
  video,
  cover,
  copy,
  background = videoIntroBackground,
  contentBaked
}) => ({
  kind: "video-intro",
  label,
  background,
  titleImage,
  video,
  cover,
  copy,
  contentBaked,
  returnOnSurface: true,
  hotspots: []
});

const embeddedVideoPage = ({ label, background, video }) => ({
  kind: "embedded-video",
  label,
  background,
  video,
  mediaArea: area(31, 15.5, 68, 68.5),
  returnOnSurface: false,
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
        area: area(24.91, 25.18, 3.86, 6.36)
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
      },
      {
        id: "home-pre",
        label: "进入术前",
        action: "stage",
        target: "pre",
        area: area(19.38, 23.46, 18.31, 35.5)
      },
      {
        id: "home-intra",
        label: "进入术中",
        action: "stage",
        target: "intra",
        area: area(40.42, 23.46, 18.31, 35.5)
      },
      {
        id: "home-post",
        label: "进入术后",
        action: "stage",
        target: "post",
        area: area(62.01, 23.46, 18.31, 35.5)
      }
    ]
  },
  "pre-overview": {
    kind: "stage-overview",
    label: "术前全场景",
    stage: "pre",
    idleImage: "/assets/medical/stage-pre-idle-20260730.webp",
    image: "/assets/medical/stage-pre-active-20260730.webp",
    returnButton: area(1.5, 85.5, 7, 13.5),
    returnButtonBaked: true,
    icons: [
      {
        src: "/assets/medical/click-pre-left-top.png",
        area: area(39.85, 40.93, 6.51, 11.57)
      },
      {
        src: "/assets/medical/click-pre-left-bottom.png",
        area: area(8.85, 66.85, 6.51, 11.57)
      },
      {
        src: "/assets/medical/click-pre-right.png",
        area: area(59.75, 50.37, 6.51, 11.57)
      }
    ],
    returnOnSurface: false,
    hotspots: [
      {
        id: "pre-training",
        label: "进入技能培训场景",
        action: "page",
        target: "video-skills-training",
        area: area(0, 0, 50, 100)
      },
      {
        id: "pre-planning",
        label: "进入手术规划场景",
        action: "page",
        target: "video-surgery-planning",
        area: area(50, 0, 50, 100)
      }
    ]
  },
  "pre-training": {
    kind: "full-image",
    label: "技能培训场景",
    stage: "pre",
    image: "/assets/medical/pre-training.webp",
    buttons: "baked",
    returnOnSurface: false,
    hotspots: []
  },
  "pre-planning": {
    kind: "full-image",
    label: "手术规划场景",
    stage: "pre",
    image: "/assets/medical/pre-planning.webp",
    buttons: "baked",
    returnOnSurface: false,
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
    kind: "stage-overview",
    label: "术中全场景",
    stage: "intra",
    idleImage: "/assets/medical/stage-intra-idle-20260730.webp",
    image: "/assets/medical/stage-intra-active-20260730.webp",
    returnButton: area(1.5, 85.5, 7, 13.5),
    returnButtonBaked: true,
    icons: [
      {
        src: "/assets/medical/click-intra-left.png",
        area: area(33.85, 40.37, 6.51, 11.57)
      },
      {
        src: "/assets/medical/click-intra-right.png",
        area: area(85.85, 13.89, 6.51, 11.57)
      }
    ],
    returnOnSurface: false,
    hotspots: [
      {
        id: "navigation-video",
        label: "播放术中导航视频",
        action: "page",
        target: "video-intraoperative-assistance",
        area: area(0, 0, 50, 100)
      },
      {
        id: "intra-remote",
        label: "进入远程教学场景",
        action: "page",
        target: "video-remote-teaching",
        area: area(50, 0, 50, 100)
      }
    ]
  },
  "intra-remote": {
    kind: "composite",
    label: "远程教学场景",
    stage: "intra",
    image: "/assets/medical/intra-remote.webp",
    buttons: "rendered",
    returnOnSurface: false,
    hotspots: []
  },
  "post-overview": {
    kind: "stage-overview",
    label: "术后全场景",
    stage: "post",
    idleImage: "/assets/medical/stage-post-idle-20260730.webp",
    image: "/assets/medical/stage-post-active-20260730.webp",
    returnButton: area(1.5, 85.5, 7, 13.5),
    returnButtonBaked: true,
    icons: [
      {
        src: "/assets/medical/click-post-left.png",
        area: area(25.35, 45.93, 6.51, 11.57)
      },
      {
        src: "/assets/medical/click-post-right.png",
        area: area(91.35, 43.15, 6.51, 11.57)
      }
    ],
    returnOnSurface: false,
    hotspots: [
      {
        id: "review-video",
        label: "播放手术复盘视频",
        action: "page",
        target: "video-surgery-review",
        area: area(0, 0, 50, 100)
      },
      {
        id: "analysis-video",
        label: "播放质控管理数据分析视频",
        action: "page",
        target: "video-quality-control",
        area: area(50, 0, 50, 100)
      }
    ]
  },
  "video-planning": {
    kind: "video",
    label: "推想手术规划视频",
    stage: "pre",
    returnOnSurface: false,
    video: `${videoBaseUrl}/planning.mp4`
  },
  "video-navigation": {
    kind: "video",
    label: "睿术术中导航视频",
    stage: "intra",
    returnOnSurface: false,
    video: `${videoBaseUrl}/navigation.mp4`
  },
  "video-review": {
    kind: "video",
    label: "睿术手术复盘视频",
    stage: "post",
    returnOnSurface: false,
    video: `${videoBaseUrl}/review.mp4`
  },
  "video-analysis": {
    kind: "video",
    label: "睿术数据分析视频",
    stage: "post",
    returnOnSurface: false,
    video: `${videoBaseUrl}/analysis.mp4`
  },
  "video-robot-integration": {
    kind: "video",
    label: "机器人功能整合视频",
    video: `${videoBaseUrl}/%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%8A%9F%E8%83%BD%E6%95%B4%E5%90%88.mp4`
  },
  "video-ui-integration": {
    kind: "video",
    label: "用户界面整合视频",
    returnOnSurface: false,
    loop: true,
    video: `${videoBaseUrl}/%E7%94%A8%E6%88%B7%E7%95%8C%E9%9D%A2%E6%95%B4%E5%90%880807.mp4`
  },
  "video-skills-training": {
    ...videoIntroPage({
      label: "术前-技能培训",
      video: `${videoBaseUrl}/%E6%8A%80%E8%83%BD%E5%9F%B9%E8%AE%AD1.mp4`,
      background: "/assets/medical/secondary-pre-skills.webp",
      contentBaked: true
    })
  },
  "video-surgery-planning": {
    ...videoIntroPage({
      label: "术前-手术规划",
      video: `${videoBaseUrl}/%E6%89%8B%E6%9C%AF%E8%A7%84%E5%88%92%E6%96%B0.mp4`,
      background: "/assets/medical/secondary-pre-planning.webp",
      contentBaked: true
    })
  },
  "video-intraoperative-assistance": {
    ...videoIntroPage({
      label: "术中-辅助决策",
      video: `${videoBaseUrl}/2%E8%BE%85%E5%8A%A9%E5%86%B3%E7%AD%96.mp4`,
      background: "/assets/medical/secondary-intra-assistance.webp",
      contentBaked: true
    })
  },
  "video-remote-teaching": {
    ...videoIntroPage({
      label: "术中-远程教学",
      video: `${videoBaseUrl}/2%E8%BF%9C%E7%A8%8B%E6%95%99%E5%AD%A6.mp4`,
      background: "/assets/medical/secondary-intra-remote.webp",
      contentBaked: true
    })
  },
  "video-quality-control": {
    ...videoIntroPage({
      label: "术后-质控管理",
      titleImage: "/assets/medical/video-intro-title-quality-control.png",
      copy: ["此处有内容"]
    })
  },
  "video-surgery-review": {
    ...videoIntroPage({
      label: "术后-手术复盘",
      video: `${videoBaseUrl}/3%E6%89%8B%E6%9C%AF%E5%A4%8D%E7%9B%980727.mp4`,
      background: "/assets/medical/secondary-post-review-20260727.webp",
      contentBaked: true
    })
  }
};

Object.assign(pages, {
  "video-robot-integration": embeddedVideoPage({
    label: "临床应用功能整合",
    background: "/assets/medical/detail-clinical-integration-20260730.webp",
    video: `${videoBaseUrl}/%E4%B8%B4%E5%BA%8A%E5%BA%94%E7%94%A8%E5%8A%9F%E8%83%BD%E6%95%B4%E5%90%88.mp4`
  }),
  "video-skills-training": embeddedVideoPage({
    label: "术前-技能培训",
    background: "/assets/medical/detail-pre-skills-20260730.webp",
    video: `${videoBaseUrl}/%E6%8A%80%E8%83%BD%E5%9F%B9%E8%AE%AD0730.mp4`
  }),
  "video-surgery-planning": embeddedVideoPage({
    label: "术前-手术规划",
    background: "/assets/medical/detail-pre-planning-20260729.webp",
    video: `${videoBaseUrl}/%E6%89%8B%E6%9C%AF%E8%A7%84%E5%88%92%E6%96%B0.mp4`
  }),
  "video-intraoperative-assistance": embeddedVideoPage({
    label: "术中-辅助决策",
    background: "/assets/medical/detail-intra-assistance-20260729.webp",
    video: `${videoBaseUrl}/2%E8%BE%85%E5%8A%A9%E5%86%B3%E7%AD%96.mp4`
  }),
  "video-remote-teaching": embeddedVideoPage({
    label: "术中-远程教学",
    background: "/assets/medical/detail-intra-remote-20260729.webp",
    video: `${videoBaseUrl}/2%E8%BF%9C%E7%A8%8B%E6%95%99%E5%AD%A6.mp4`
  }),
  "video-surgery-review": embeddedVideoPage({
    label: "术后-手术复盘",
    background: "/assets/medical/detail-post-review-20260729.webp",
    video: `${videoBaseUrl}/3%E6%89%8B%E6%9C%AF%E5%A4%8D%E7%9B%980727.mp4`
  }),
  "video-quality-control": embeddedVideoPage({
    label: "术后-质控管理",
    background: "/assets/medical/detail-post-quality-20260730.webp",
    video: `${videoBaseUrl}/3%E8%B4%A8%E6%8E%A7%E7%AE%A1%E7%90%860730%E6%9B%B4%E6%96%B0.mp4`
  })
});
