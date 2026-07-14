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
const CRITICAL_IMAGE_ASSETS = [
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
