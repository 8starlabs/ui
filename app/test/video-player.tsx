"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { VideoProvider, useVideo } from "./video-context";
import { Slider } from "@/registry/8starlabs-ui/ui/slider";
import { Pause, Play } from "lucide-react";

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
  const { videoRef, setIsPlaying, setProgress, setDuration, isPlaying } =
    useVideo();
  const rafRef = useRef<number | null>(null);

  const syncDuration = useCallback(
    (videoEl: HTMLVideoElement) => {
      if (videoEl && videoEl.duration) {
        setDuration(videoEl.duration);
      }
    },
    [setDuration]
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
        setProgress(videoElement.currentTime);
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
  }, [isPlaying, setProgress, videoRef]);

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
      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
        showControls ? "opacity-100" : "opacity-0 pointer-events-none"
      } ${className}`}
      {...props}
    >
      {children}
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
      className={`text-white p-2 ${className}`}
      {...props}
    >
      {isPlaying ? <Pause /> : <Play />}
    </button>
  );
}

export interface VideoFullscreenTriggerProps
  extends React.ComponentPropsWithoutRef<"button"> {}

export function VideoFullscreenTrigger({
  className = "",
  ...props
}: VideoFullscreenTriggerProps): React.ReactElement {
  const { toggleFullscreen } = useVideo();

  return (
    <button
      onClick={toggleFullscreen}
      className={`text-white p-2 ${className}`}
      {...props}
    >
      Fullscreen
    </button>
  );
}

export interface VideoProgressBarProps
  extends React.ComponentPropsWithoutRef<typeof Slider> {}

export function VideoProgressBar({
  className = "",
  ...props
}: VideoProgressBarProps): React.ReactElement {
  const { progress, duration, videoRef } = useVideo();

  const percentage = duration > 0 ? (progress / duration) * 100 : 0;

  const handleValueChange = (v: number[]) => {
    if (!videoRef.current || duration === 0) return;
    const newTime = (v[0] / 100) * duration;
    videoRef.current.currentTime = newTime;
  };

  return (
    <div className={`flex-1 ${className} flex items-center gap-2`}>
      <span className="text-white text-sm">{formatTime(progress)}</span>
      <VideoSeekSlider
        percentage={percentage}
        duration={duration}
        onValueChange={handleValueChange}
        {...props}
      />
      <span className="text-white text-sm">{formatTime(duration)}</span>
    </div>
  );
}

interface VideoSeekSliderProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Slider>,
    "value" | "defaultValue"
  > {
  percentage: number;
  duration: number;
}

function VideoSeekSlider({
  percentage,
  onValueChange,
  duration,
  className = "",
  ...props
}: VideoSeekSliderProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<{ x: number; time: number } | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || duration === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    const percent = rect.width ? x / rect.width : 0;
    setHover({ x, time: percent * duration });
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Slider
        value={[percentage]}
        onValueChange={onValueChange}
        className={`w-full ${className}`}
        {...props}
      />
      {hover && (
        <div
          className={`pointer-events-none absolute -top-7 z-10 rounded bg-black/80 px-2 py-0.5 text-xs text-white transition-opacity duration-200 ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
          style={{ left: hover.x, transform: "translateX(-50%)" }}
        >
          {formatTime(hover.time)}
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
