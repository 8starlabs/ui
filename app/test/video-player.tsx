"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { VideoProvider, useVideo } from "./video-context";
import { Maximize2, Minimize2, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

// -----------------------------------------------------------------------------
// VideoRoot: Handles the Provider and the Inactivity Timeout Logic
// -----------------------------------------------------------------------------

export interface VideoRootProps extends React.ComponentPropsWithoutRef<"div"> {}

export function VideoRoot({
  children,
  className = "",
  ...props
}: VideoRootProps) {
  return (
    <VideoProvider>
      <VideoContainer className={className} {...props}>
        {children}
      </VideoContainer>
    </VideoProvider>
  );
}

// Internal wrapper to access context for mouse events
function VideoContainer({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { setShowControls } = useVideo();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Hide controls after 2.5 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2500);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowControls(false);
  };

  return (
    <div
      className={`relative overflow-hidden bg-black ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
// VideoViewport: The actual HTML5 Video Tag
// -----------------------------------------------------------------------------

export interface VideoViewportProps
  extends React.ComponentPropsWithoutRef<"video"> {}

export function VideoViewport({
  src,
  className = "",
  ...props
}: VideoViewportProps) {
  const {
    videoRef,
    setIsPlaying,
    setVideoProgress,
    setVideoDuration,
    isPlaying
  } = useVideo();
  const rafRef = useRef<number | null>(null);

  const syncDuration = useCallback(
    (videoEl: HTMLVideoElement) => {
      if (videoEl && videoEl.duration) {
        setVideoDuration(videoEl.duration);
      }
    },
    [setVideoDuration]
  );

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (videoElement.readyState >= 1) {
      syncDuration(videoElement);
    }
  }, [src, videoRef, syncDuration]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateLoop = () => {
      if (videoElement) {
        setVideoProgress(videoElement.currentTime);
        // Recursively poll on the browser's next animation frame repaint paint timeline
        rafRef.current = requestAnimationFrame(updateLoop);
      }
    };

    rafRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, setVideoProgress, videoRef]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={`w-full h-full object-cover ${className}`}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onLoadedMetadata={(e) => syncDuration(e.currentTarget)}
      onClick={() => {
        if (videoRef.current?.paused) videoRef.current.play();
        else videoRef.current?.pause();
      }}
      {...props}
    />
  );
}

// -----------------------------------------------------------------------------
// VideoControls: The disappearing overlay wrapper
// -----------------------------------------------------------------------------

export interface VideoControlsProps
  extends React.ComponentPropsWithoutRef<"div"> {}

export function VideoControls({
  children,
  className = "",
  ...props
}: VideoControlsProps): React.ReactElement {
  const { showControls } = useVideo();

  return (
    <div
      id="video-controls"
      className={cn(
        "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity videoDuration-300",
        showControls ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
// VideoSoundControl: Controls volume and mute
// -----------------------------------------------------------------------------

export interface VideoSoundControlProps
  extends React.ComponentPropsWithoutRef<"button"> {}

export function VideoSoundControl({
  className = "",
  ...props
}: VideoSoundControlProps) {
  const { videoRef, toggleMute, setVolume } = useVideo();

  const [volume, setVolumeState] = useState(100);

  useEffect(() => {
    if (!videoRef.current) return;
    setVolumeState(Math.round(videoRef.current.volume * 100));
  }, [videoRef]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    setVolumeState(next);
    setVolume(next / 100);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={toggleMute}
        className="text-white text-xs"
        {...props}
      >
        Mute
      </button>
      <input
        aria-label="Volume"
        type="range"
        min={0}
        max={100}
        step={1}
        value={volume}
        onChange={handleVolumeChange}
        className="h-20 w-2"
        style={{ writingMode: "vertical-rl" }}
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// UI Primitives: Play Button, Progress, Fullscreen (Examples)
// -----------------------------------------------------------------------------
export interface VideoPlayTriggerProps
  extends React.ComponentPropsWithoutRef<"button"> {}

export function VideoPlayTrigger({
  className = "",
  ...props
}: VideoPlayTriggerProps): React.ReactElement {
  const { isPlaying, togglePlay } = useVideo();

  return (
    <button
      onClick={togglePlay}
      className={`text-white hover:cursor-pointer ${className}`}
      {...props}
    >
      {isPlaying ? (
        <Pause fill="white" size={18} />
      ) : (
        <Play fill="white" size={18} />
      )}
    </button>
  );
}

export interface VideoFullscreenTriggerProps
  extends React.ComponentPropsWithoutRef<"button"> {}

export function VideoFullscreenTrigger({
  className = "",
  ...props
}: VideoFullscreenTriggerProps): React.ReactElement {
  const { toggleFullscreen, isFullscreen } = useVideo();

  return (
    <button
      onClick={toggleFullscreen}
      className={`text-white p-2 hover:cursor-pointer ${className}`}
      {...props}
    >
      {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
    </button>
  );
}

export interface VideoProgressBarProps
  extends React.ComponentPropsWithoutRef<"div"> {}

export function VideoProgressBar({
  className = "",
  ...props
}: VideoProgressBarProps): React.ReactElement {
  const { videoProgress, videoDuration, videoRef } = useVideo();

  return (
    <div
      className={`flex-1 ${className} flex items-center justify-center gap-2`}
    >
      <span className="text-white text-sm -translate-y-[0.7px]">
        {formatTime(videoProgress)}
      </span>
      <VideoSeekSlider {...props} />
      <span className="text-white text-sm -translate-y-[0.7px]">
        {formatTime(videoDuration)}
      </span>
    </div>
  );
}

function VideoSeekSlider({
  className = "",
  ...props
}: React.ComponentPropsWithoutRef<"div">): React.ReactElement {
  const wasPlayingRef = useRef<boolean>(false);

  const { videoDuration, videoProgress, videoRef } = useVideo();

  const frac = videoDuration > 0 ? videoProgress / videoDuration : 0;

  const containerRef = useRef<HTMLDivElement | null>(null);
  // x: pixels from left edge of slider container
  const [hover, setHover] = useState<{ x: number; time: number } | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleSeekVideo = useCallback(
    (newFrac: number) => {
      if (!videoRef.current || videoDuration === 0) return;
      const newTime = newFrac * videoDuration;
      videoRef.current.currentTime = newTime;
    },
    [videoDuration, videoRef]
  );

  const getXOffsetandFraction = useCallback(
    (clientX: number): { x: number; frac: number } | undefined => {
      if (!containerRef.current || videoDuration === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const frac = rect.width ? x / rect.width : 0;
      return { x, frac };
    },
    [videoDuration]
  );

  const updateHoverFromClientX = useCallback(
    (clientX: number) => {
      const val = getXOffsetandFraction(clientX);
      if (!val) return;
      setHover({ x: val.x, time: val.frac * videoDuration });
    },
    [videoDuration, getXOffsetandFraction]
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    updateHoverFromClientX(event.clientX);
    setIsHovering(true);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const val = getXOffsetandFraction(event.clientX);
    if (!val) return;
    setHover({ x: val.x, time: val.frac * videoDuration });
    setIsHovering(true);
    setIsDragging(true);
    if (!videoRef.current) return;
    wasPlayingRef.current = !videoRef.current.paused;
    videoRef.current.pause();
    handleSeekVideo(val.frac);
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsHovering(false);
    }
  };

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      updateHoverFromClientX(event.clientX);
      const val = getXOffsetandFraction(event.clientX);
      if (!val) return;
      handleSeekVideo(val.frac);
    },
    [updateHoverFromClientX, getXOffsetandFraction, handleSeekVideo]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setIsHovering(false);
    if (!videoRef.current) return;
    if (wasPlayingRef.current) {
      videoRef.current.play();
    }
    wasPlayingRef.current = false;
  }, [videoRef]);

  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [
    isDragging,
    videoDuration,
    updateHoverFromClientX,
    handleSeekVideo,
    getXOffsetandFraction,
    handlePointerMove,
    handlePointerUp
  ]);

  return (
    <div
      id="video-progress-bar"
      ref={containerRef}
      className={cn("relative flex-1 h-1 translate-y-[0.4px]", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      {...props}
    >
      <div
        id="video-progress-bar-bg"
        className="relative h-full w-full rounded-full bg-neutral-600"
      />
      <div
        id="video-progress-bar-fill"
        className="pointer-events-none absolute left-0 top-0 h-full rounded-full bg-white"
        style={{ width: `${frac * 100}%` }}
      />

      {hover && (
        <div
          id="video-progress-bar-hover-time"
          className={cn(
            "pointer-events-none absolute -top-13 z-10 rounded text-sm text-white transition-opacity videoDuration-200 flex flex-col items-center gap-[3px]",
            isHovering ? "opacity-100" : "opacity-0"
          )}
          style={{ left: hover.x, transform: "translateX(-50%)" }}
        >
          <div className="flex flex-row items-center gap-1">
            <span>{formatTime(hover.time)}</span>
            <span className="opacity-50 whitespace-nowrap">{`/ ${formatTime(videoDuration)}`}</span>
          </div>
          <div>|</div>
        </div>
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
