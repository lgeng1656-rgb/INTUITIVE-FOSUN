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

const ORBIT_WIDTH = 4000;
const ORBIT_DURATION = 16000;
const ORBIT_BASE_LINE_WIDTH = 3.4;
const ORBIT_LINE_WIDTH = 4.2;
const ORBIT_TRAIL_LENGTH = 420;
const ORBIT_LEAD_GAP = 58;
const ORBIT_ACTIVE_GLOW = 10;
const ORBIT_BAND_HEIGHT = 300;
const ORBIT_TOP_OFFSET = 420;
const ORBIT_BOTTOM_OFFSET = 1140;
const ORBIT_SEGMENT_ORDER = ["top", "right", "bottom", "left"];

function cubicPoint(start, control1, control2, end, progress) {
  const inverse = 1 - progress;
  return {
    x:
      inverse ** 3 * start.x +
      3 * inverse ** 2 * progress * control1.x +
      3 * inverse * progress ** 2 * control2.x +
      progress ** 3 * end.x,
    y:
      inverse ** 3 * start.y +
      3 * inverse ** 2 * progress * control1.y +
      3 * inverse * progress ** 2 * control2.y +
      progress ** 3 * end.y
  };
}

function buildOrbitPolyline(direction) {
  const points = [];

  function appendCurve(start, control1, control2, end, includeStart = true) {
    for (let step = includeStart ? 0 : 1; step <= 40; step += 1) {
      points.push(cubicPoint(start, control1, control2, end, step / 40));
    }
  }

  if (direction === "top") {
    appendCurve(
      { x: 420, y: 655 },
      { x: 530, y: 510 },
      { x: 670, y: 440 },
      { x: 875, y: 440 }
    );
    points.push({ x: 3125, y: 440 });
    appendCurve(
      { x: 3125, y: 440 },
      { x: 3330, y: 440 },
      { x: 3470, y: 510 },
      { x: 3580, y: 655 },
      false
    );
  } else if (direction === "right") {
    appendCurve(
      { x: 3580, y: 1150 },
      { x: 3470, y: 1295 },
      { x: 3330, y: 1362 },
      { x: 3125, y: 1362 }
    );
  } else if (direction === "bottom") {
    points.push({ x: 3125, y: 1362 }, { x: 875, y: 1362 });
  } else {
    appendCurve(
      { x: 875, y: 1362 },
      { x: 670, y: 1362 },
      { x: 530, y: 1295 },
      { x: 420, y: 1150 }
    );
  }

  let distance = 0;
  return points.map((point, index) => {
    if (index > 0) {
      distance += Math.hypot(point.x - points[index - 1].x, point.y - points[index - 1].y);
    }
    return { ...point, distance };
  });
}

let orbitStartDistance = 0;
const ORBIT_PATHS = ORBIT_SEGMENT_ORDER.map((name) => {
  const polyline = buildOrbitPolyline(name);
  const length = polyline.at(-1).distance;
  const path = {
    name,
    polyline,
    length,
    startDistance: orbitStartDistance,
    offset: name === "top" ? ORBIT_TOP_OFFSET : ORBIT_BOTTOM_OFFSET,
    band: name === "top" ? "top" : "bottom"
  };
  orbitStartDistance += length;
  return path;
});
const ORBIT_TOTAL_LENGTH = orbitStartDistance;

function getActiveOrbitPath(distance) {
  return (
    ORBIT_PATHS.find((path) => distance < path.startDistance + path.length) ??
    ORBIT_PATHS.at(-1)
  );
}

function pointAtDistance(polyline, targetDistance) {
  const total = polyline.at(-1).distance;
  const distance = Math.min(total, Math.max(0, targetDistance));
  let index = 1;
  while (index < polyline.length && polyline[index].distance < distance) index += 1;
  const current = polyline[Math.min(index, polyline.length - 1)];
  const previous = polyline[Math.max(0, index - 1)];
  const span = current.distance - previous.distance || 1;
  const progress = (distance - previous.distance) / span;
  return {
    x: previous.x + (current.x - previous.x) * progress,
    y: previous.y + (current.y - previous.y) * progress
  };
}

function strokeOrbitRange(context, polyline, startDistance, endDistance) {
  const start = pointAtDistance(polyline, startDistance);
  context.beginPath();
  context.moveTo(start.x, start.y);
  polyline.forEach((point) => {
    if (point.distance > startDistance && point.distance < endDistance) {
      context.lineTo(point.x, point.y);
    }
  });
  const end = pointAtDistance(polyline, endDistance);
  context.lineTo(end.x, end.y);
  context.stroke();
}

function drawBasePath(context, polyline) {
  context.save();
  context.strokeStyle = "rgba(255, 255, 255, 0.78)";
  context.lineWidth = ORBIT_BASE_LINE_WIDTH;
  context.lineCap = "round";
  context.lineJoin = "round";
  strokeOrbitRange(context, polyline, 0, polyline.at(-1).distance);
  context.restore();
}

function eraseLeadGap(context, polyline, headDistance) {
  const total = polyline.at(-1).distance;
  const gapStart = Math.min(total, headDistance + 24);
  const gapEnd = Math.min(total, gapStart + ORBIT_LEAD_GAP);

  context.save();
  context.globalCompositeOperation = "destination-out";
  context.strokeStyle = "#000";
  context.lineWidth = 16;
  context.lineCap = "round";
  strokeOrbitRange(context, polyline, gapStart, gapEnd);
  context.restore();
}

function drawMovingSegment(context, polyline, requestedHeadDistance) {
  const total = polyline.at(-1).distance;
  const headDistance = Math.min(total, Math.max(0, requestedHeadDistance));
  const tailDistance = headDistance - ORBIT_TRAIL_LENGTH;

  context.save();
  context.strokeStyle = "#fff";
  context.fillStyle = "#fff";
  context.lineWidth = ORBIT_LINE_WIDTH;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.shadowColor = "rgba(255, 255, 255, 0.72)";
  context.shadowBlur = ORBIT_ACTIVE_GLOW;

  strokeOrbitRange(context, polyline, Math.max(0, tailDistance), headDistance);

  const head = pointAtDistance(polyline, headDistance);
  const tangentStart = pointAtDistance(polyline, Math.max(0, headDistance - 28));
  const tangentEnd = pointAtDistance(polyline, Math.min(total, headDistance + 28));
  const angle = Math.atan2(
    tangentEnd.y - tangentStart.y,
    tangentEnd.x - tangentStart.x
  );
  context.save();
  context.translate(head.x, head.y);
  context.rotate(angle);
  context.beginPath();
  context.moveTo(27, 0);
  context.lineTo(-21, -14);
  context.lineTo(-21, 14);
  context.closePath();
  context.fill();
  context.restore();
  context.restore();
}

function HomeOrbitCanvas() {
  const topCanvasRef = useRef(null);
  const bottomCanvasRef = useRef(null);

  useEffect(() => {
    const topContext = topCanvasRef.current?.getContext("2d");
    const bottomContext = bottomCanvasRef.current?.getContext("2d");
    if (!topContext || !bottomContext) return undefined;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let startTime;

    function clearBands() {
      topContext.clearRect(0, 0, ORBIT_WIDTH, ORBIT_BAND_HEIGHT);
      bottomContext.clearRect(0, 0, ORBIT_WIDTH, ORBIT_BAND_HEIGHT);
    }

    function eraseOrbitPosition(distance) {
      const path = getActiveOrbitPath(distance);
      const headDistance = distance - path.startDistance;
      const context = path.band === "top" ? topContext : bottomContext;
      context.save();
      context.translate(0, -path.offset);
      eraseLeadGap(context, path.polyline, headDistance);
      context.restore();
    }

    function drawOrbitPosition(distance) {
      const path = getActiveOrbitPath(distance);
      const headDistance = distance - path.startDistance;
      const context = path.band === "top" ? topContext : bottomContext;
      context.save();
      context.translate(0, -path.offset);
      drawMovingSegment(context, path.polyline, headDistance);
      context.restore();
    }

    function drawAllBasePaths() {
      ORBIT_PATHS.forEach((path) => {
        const context = path.band === "top" ? topContext : bottomContext;
        context.save();
        context.translate(0, -path.offset);
        drawBasePath(context, path.polyline);
        context.restore();
      });
    }

    function drawFrame(timestamp) {
      clearBands();
      drawAllBasePaths();
      if (reducedMotion) {
        return;
      }

      startTime ??= timestamp;
      const phase = ((timestamp - startTime) % ORBIT_DURATION) / ORBIT_DURATION;
      const travelDistance = phase * ORBIT_TOTAL_LENGTH;
      const oppositeDistance = (travelDistance + ORBIT_TOTAL_LENGTH / 2) % ORBIT_TOTAL_LENGTH;
      const orbitPositions = [travelDistance, oppositeDistance];
      orbitPositions.forEach(eraseOrbitPosition);
      orbitPositions.forEach(drawOrbitPosition);
      animationFrame = window.requestAnimationFrame(drawFrame);
    }

    animationFrame = window.requestAnimationFrame(drawFrame);
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <>
      <canvas
        ref={topCanvasRef}
        className="home-orbit home-orbit-top"
        width={ORBIT_WIDTH}
        height={ORBIT_BAND_HEIGHT}
        aria-hidden="true"
      />
      <canvas
        ref={bottomCanvasRef}
        className="home-orbit home-orbit-bottom"
        width={ORBIT_WIDTH}
        height={ORBIT_BAND_HEIGHT}
        aria-hidden="true"
      />
    </>
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
      <HomeOrbitCanvas />
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
