import React, { useEffect, useRef, useState } from "react";
import { pages, stageButtons } from "./data/stages.js";
import {
  createInitialState,
  goBack,
  openPage,
  openStage
} from "./navigation.js";

const STAGES = ["pre", "intra", "post"];
const SECONDARY_BACKGROUND = "/assets/medical/secondary-background.jpg";
const HOME_ASSETS = {
  background: "/assets/medical/home-background.jpg",
  pre: "/assets/medical/home-pre.png",
  intra: "/assets/medical/home-intra.png",
  post: "/assets/medical/home-post.png",
  leftIntegration: "/assets/medical/home-left-integration.png",
  rightIntegration: "/assets/medical/home-right-integration.png"
};
const CRITICAL_IMAGE_ASSETS = [
  ...Object.values(HOME_ASSETS),
  SECONDARY_BACKGROUND,
  "/assets/medical/pre-overview.jpg",
  "/assets/medical/intra-overview.jpg",
  "/assets/medical/post-overview.jpg",
  ...Object.values(stageButtons).flatMap((button) => [button.idle, button.active])
];
const DETAIL_IMAGE_ASSETS = Object.values(pages)
  .flatMap((page) => (page.image ? [page.image] : []))
  .filter((src) => !CRITICAL_IMAGE_ASSETS.includes(src));

function areaStyle(area) {
  return {
    left: `${area.left}%`,
    top: `${area.top}%`,
    width: `${area.width}%`,
    height: `${area.height}%`
  };
}

function decodeImage(image, onReady) {
  const decoding = typeof image.decode === "function" ? image.decode() : Promise.resolve();
  decoding.catch(() => undefined).then(onReady);
}

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => decodeImage(image, resolve);
    image.onerror = resolve;
    image.src = src;
  });
}

function VideoSurface({ page, onReady, onError }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    video.currentTime = 0;
    const playback = video.play();
    playback?.catch(() => {
      // 正式视频尚未放入时保持纯黑画面，返回操作仍然有效。
    });

    return () => video.pause();
  }, [page.video]);

  return (
    <div className="video-surface">
      <video
        ref={videoRef}
        className="video-player"
        src={page.video}
        autoPlay
        playsInline
        preload="auto"
        aria-label={page.label}
        onCanPlay={onReady}
        onError={onError}
      />
    </div>
  );
}

function HomeSurface({ onReady, onError }) {
  const readyImages = useRef(new Set());
  const hasReportedReady = useRef(false);

  function markReady(name, image) {
    decodeImage(image, () => {
      readyImages.current.add(name);
      if (
        readyImages.current.size === Object.keys(HOME_ASSETS).length &&
        !hasReportedReady.current
      ) {
        hasReportedReady.current = true;
        onReady?.();
      }
    });
  }

  function renderImage(name, className, alt) {
    return (
      <img
        className={className}
        src={HOME_ASSETS[name]}
        alt={alt}
        draggable="false"
        onLoad={(event) => markReady(name, event.currentTarget)}
        onError={onError}
      />
    );
  }

  return (
    <div className="home-page">
      {renderImage("background", "home-background", "")}
      {renderImage("pre", "home-scene home-scene-pre", "术前")}
      {renderImage("intra", "home-scene home-scene-intra", "术中")}
      {renderImage("post", "home-scene home-scene-post", "术后")}
      {renderImage(
        "leftIntegration",
        "home-integration home-integration-left",
        "机器人功能整合"
      )}
      {renderImage(
        "rightIntegration",
        "home-integration home-integration-right",
        "用户界面整合"
      )}
      <div className="home-timeline" aria-hidden="true">
        <span className="home-timeline-marker home-timeline-marker-pre" />
        <span className="home-timeline-marker home-timeline-marker-intra" />
        <span className="home-timeline-marker home-timeline-marker-post" />
      </div>
      <div className="home-stage-copy home-stage-copy-pre">
        <strong>术前</strong>
        <div className="home-stage-pills">
          <span>技能培训</span>
          <span>手术规划</span>
        </div>
      </div>
      <div className="home-stage-copy home-stage-copy-intra">
        <strong>术中</strong>
        <div className="home-stage-pills">
          <span>远程教学</span>
          <span>术中导航</span>
        </div>
      </div>
      <div className="home-stage-copy home-stage-copy-post">
        <strong>术后</strong>
        <div className="home-stage-pills">
          <span>手术复盘</span>
          <span>临床研究</span>
        </div>
      </div>
      <svg
        className="home-orbit"
        viewBox="0 0 4000 2250"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          id="home-orbit-path"
          className="home-orbit-motion-path"
          d="M 890 470 H 3190 C 3410 470 3550 540 3680 715 L 3680 1210 C 3560 1380 3410 1455 3190 1455 H 890 C 670 1455 530 1380 420 1210 L 420 715 C 530 540 670 470 890 470 Z"
        />
        <path
          className="home-orbit-path"
          d="M 420 715 C 530 540 670 470 890 470 H 3190 C 3410 470 3550 540 3680 715 M 3680 1210 C 3560 1380 3410 1455 3190 1455 H 890 C 670 1455 530 1380 420 1210"
        />
        <g className="home-orbit-static-arrow">
          <path d="M 3050 448 L 3110 470 L 3050 492 Z" />
        </g>
        <g className="home-orbit-arrow">
          <path d="M -30 -22 L 30 0 L -30 22 Z" />
          <animateMotion dur="16s" repeatCount="indefinite" rotate="auto">
            <mpath href="#home-orbit-path" />
          </animateMotion>
        </g>
      </svg>
    </div>
  );
}

function CompositeSurface({ page, onReady, onError }) {
  const readyImages = useRef(new Set());
  const hasReportedReady = useRef(false);

  function markReady(name, image) {
    decodeImage(image, () => {
      readyImages.current.add(name);
      if (readyImages.current.size === 2 && !hasReportedReady.current) {
        hasReportedReady.current = true;
        onReady?.();
      }
    });
  }

  return (
    <div className="composite-page">
      <img
        className="secondary-background"
        src={SECONDARY_BACKGROUND}
        alt=""
        draggable="false"
        onLoad={(event) => markReady("background", event.currentTarget)}
        onError={onError}
      />
      <div className="scene-frame">
        <img
          className="scene-content"
          src={page.image}
          alt={page.label}
          draggable="false"
          onLoad={(event) => markReady("scene", event.currentTarget)}
          onError={onError}
        />
      </div>
    </div>
  );
}

function PageSurface({ page, onReady, onError }) {
  if (page.kind === "home") {
    return <HomeSurface onReady={onReady} onError={onError} />;
  }

  if (page.kind === "video") {
    return <VideoSurface page={page} onReady={onReady} onError={onError} />;
  }

  if (page.kind === "composite") {
    return <CompositeSurface page={page} onReady={onReady} onError={onError} />;
  }

  return (
    <img
      className="full-page-image"
      src={page.image}
      alt={page.label}
      draggable="false"
      onLoad={(event) => decodeImage(event.currentTarget, onReady)}
      onError={onError}
    />
  );
}

function StageSelector({ currentStage, disabled = false, mode, onSelect }) {
  return (
    <div className="stage-selector" aria-label="术前术中术后切换">
      {STAGES.map((stage) => {
        const button = stageButtons[stage];
        const image = currentStage === stage ? button.active : button.idle;

        return (
          <button
            key={stage}
            type="button"
            className={`stage-button ${mode === "baked" ? "is-baked" : ""}`}
            style={areaStyle(button.area)}
            aria-label={`切换到${button.label}`}
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              if (!disabled) onSelect(stage);
            }}
          >
            {mode === "rendered" ? (
              <img src={image} alt="" draggable="false" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function VisualScene({ className = "", navigation, onError, onReady, onSelectStage }) {
  const page = pages[navigation.current];
  const isInactive =
    className.includes("transition-cover") || className.includes("retained-scene");

  return (
    <div className={`visual-scene ${className}`} aria-hidden={isInactive || undefined}>
      <PageSurface page={page} onReady={onReady} onError={onError} />
      {page.stage && page.kind !== "video" ? (
        <StageSelector
          currentStage={page.stage}
          disabled={isInactive}
          mode={page.buttons}
          onSelect={onSelectStage}
        />
      ) : null}
    </div>
  );
}

function HotspotLayer({ hotspots, onActivate }) {
  return (
    <div className="hotspot-layer">
      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          type="button"
          className="interaction-hotspot"
          style={areaStyle(hotspot.area)}
          aria-label={hotspot.label}
          onClick={(event) => {
            event.stopPropagation();
            onActivate(hotspot);
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState(() => ({
    navigation: createInitialState(),
    outgoing: null,
    retained: null,
    transitionId: 0
  }));
  const navigation = view.navigation;
  const outgoing = view.outgoing;
  const retained = view.retained;
  const page = pages[navigation.current];

  useEffect(() => {
    let cancelled = false;

    Promise.all(CRITICAL_IMAGE_ASSETS.map(preloadImage)).then(() => {
      if (!cancelled) DETAIL_IMAGE_ASSETS.forEach(preloadImage);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!outgoing) return undefined;

    const timeout = window.setTimeout(() => {
      setView((current) => {
        if (current.outgoing?.id !== outgoing.id) return current;
        return {
          ...current,
          navigation: current.outgoing.navigation,
          outgoing: null
        };
      });
    }, 8000);

    return () => window.clearTimeout(timeout);
  }, [outgoing]);

  function startTransition(getNextNavigation) {
    setView((current) => {
      if (current.outgoing) return current;

      const nextNavigation = getNextNavigation(current.navigation);
      if (nextNavigation.current === current.navigation.current) return current;

      if (
        current.retained &&
        pages[current.navigation.current].kind === "video" &&
        nextNavigation.current === current.retained.current
      ) {
        return {
          ...current,
          navigation: current.retained,
          outgoing: null,
          retained: null
        };
      }

      const transitionId = current.transitionId + 1;
      return {
        navigation: nextNavigation,
        outgoing: { id: transitionId, navigation: current.navigation },
        retained: null,
        transitionId
      };
    });
  }

  function finishTransition(transitionId) {
    setView((current) => {
      if (current.outgoing?.id !== transitionId) return current;
      return {
        ...current,
        retained:
          pages[current.navigation.current].kind === "video"
            ? current.outgoing.navigation
            : null,
        outgoing: null
      };
    });
  }

  function cancelTransition(transitionId) {
    setView((current) => {
      if (current.outgoing?.id !== transitionId) return current;
      return {
        ...current,
        navigation: current.outgoing.navigation,
        outgoing: null
      };
    });
  }

  function handleHotspot(hotspot) {
    startTransition((current) =>
      hotspot.action === "stage"
        ? openStage(current, hotspot.target)
        : openPage(current, hotspot.target)
    );
  }

  function handleSurfaceClick() {
    if (navigation.current === "home") return;
    if (page.kind === "video" || page.returnOnSurface) {
      startTransition((current) => goBack(current));
    }
  }

  return (
    <main className="viewport" aria-label="医疗数字化互动展示">
      <section
        className="design-stage"
        data-page={navigation.current}
        data-stage={navigation.stage ?? "home"}
        aria-label={page.label}
        aria-busy={outgoing ? "true" : "false"}
        onClick={handleSurfaceClick}
      >
        <VisualScene
          key={`scene-${navigation.current}`}
          className={outgoing ? "is-loading" : ""}
          navigation={navigation}
          onReady={
            outgoing ? () => finishTransition(outgoing.id) : undefined
          }
          onError={
            outgoing ? () => cancelTransition(outgoing.id) : undefined
          }
          onSelectStage={(stage) =>
            startTransition((current) => openStage(current, stage))
          }
        />
        {outgoing ? (
          <VisualScene
            key={`scene-${outgoing.navigation.current}`}
            className="transition-cover"
            navigation={outgoing.navigation}
            onSelectStage={() => undefined}
          />
        ) : null}
        {retained && !outgoing ? (
          <VisualScene
            key={`scene-${retained.current}`}
            className="retained-scene"
            navigation={retained}
            onSelectStage={() => undefined}
          />
        ) : null}
        {!outgoing && page.kind !== "video" ? (
          <HotspotLayer
            hotspots={page.hotspots}
            onActivate={handleHotspot}
          />
        ) : null}
      </section>
    </main>
  );
}
