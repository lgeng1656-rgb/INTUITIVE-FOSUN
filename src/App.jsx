import React, { useEffect, useRef, useState } from "react";
import { pages, stageButtons } from "./data/stages.js";
import {
  createInitialState,
  goBack,
  openPage,
  openStage
} from "./navigation.js";

const STAGES = ["pre", "intra", "post"];

function areaStyle(area) {
  return {
    left: `${area.left}%`,
    top: `${area.top}%`,
    width: `${area.width}%`,
    height: `${area.height}%`
  };
}

function VideoSurface({ page }) {
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
        preload="metadata"
        aria-label={page.label}
      />
    </div>
  );
}

function PageSurface({ page }) {
  if (page.kind === "video") {
    return <VideoSurface page={page} />;
  }

  if (page.kind === "composite") {
    return (
      <div className="composite-page">
        <img
          className="secondary-background"
          src="/assets/medical/secondary-background.jpg"
          alt=""
          draggable="false"
        />
        <div className="scene-frame">
          <img
            className="scene-content"
            src={page.image}
            alt={page.label}
            draggable="false"
          />
        </div>
      </div>
    );
  }

  return (
    <img
      className="full-page-image"
      src={page.image}
      alt={page.label}
      draggable="false"
    />
  );
}

function StageSelector({ currentStage, mode, onSelect }) {
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
            onClick={(event) => {
              event.stopPropagation();
              onSelect(stage);
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
  const [navigation, setNavigation] = useState(createInitialState);
  const page = pages[navigation.current];

  function handleHotspot(hotspot) {
    setNavigation((current) =>
      hotspot.action === "stage"
        ? openStage(current, hotspot.target)
        : openPage(current, hotspot.target)
    );
  }

  function handleSurfaceClick() {
    if (navigation.current === "home") return;
    if (page.kind === "video" || page.returnOnSurface) {
      setNavigation((current) => goBack(current));
    }
  }

  return (
    <main className="viewport" aria-label="医疗数字化互动展示">
      <section
        className="design-stage"
        data-page={navigation.current}
        data-stage={navigation.stage ?? "home"}
        aria-label={page.label}
        onClick={handleSurfaceClick}
      >
        <PageSurface page={page} />
        {page.kind !== "video" ? (
          <HotspotLayer
            hotspots={page.hotspots}
            onActivate={handleHotspot}
          />
        ) : null}
        {page.stage && page.kind !== "video" ? (
          <StageSelector
            currentStage={page.stage}
            mode={page.buttons}
            onSelect={(stage) =>
              setNavigation((current) => openStage(current, stage))
            }
          />
        ) : null}
      </section>
    </main>
  );
}
