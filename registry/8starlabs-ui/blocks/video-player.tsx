"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Maximize2,
  Minimize2,
  Loader2,
  Pause,
  PictureInPicture2,
  Play,
  RotateCcw,
  RotateCw,
  Volume,
  Volume1,
  Volume2,
  VolumeOff
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/8starlabs-ui/blocks/button";

interface VideoContextType {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isPlaying: boolean;
  isBuffering: boolean;
  hasError: boolean;
  videoProgress: number;
  videoDuration: number;
  showControls: boolean;
  controlsTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  isFullscreen: boolean;
  isMouseOverControls: boolean;
  isPip: boolean;
  isVolumeControlOpen: boolean;
  attemptTogglePlay: () => void;
  toggleFullscreen: () => void;
  setIsPlaying: (playing: boolean) => void;
  setIsBuffering: (buffering: boolean) => void;
  setHasError: (hasError: boolean) => void;
  setVideoProgress: (progress: number) => void;
  setVideoDuration: (videoDuration: number) => void;
  setShowControls: (show: boolean) => void;
  showControlsTemporarily: () => void;
  setVolume: (x: number) => void;
  setIsMouseOverControls: (x: boolean) => void;
  toggleMute: (x: boolean) => void;
  togglePip: () => void;
  setIsVolumeControlOpen: (x: boolean) => void;
}

const VideoContext = createContext<VideoContextType | null>(null);

// Reads the shared video context and guards against using controls outside VideoRoot.
export function useVideo(): VideoContextType {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideo must be used within a VideoRoot");
  }
  return context;
}

export function VideoProvider({
  children
}: {
  children: React.ReactNode;
}): React.ReactElement {
  // Shared video element ref and UI state consumed by viewport and control components.
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastVolumeRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMouseOverControls, setIsMouseOverControls] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [isVolumeControlOpen, setIsVolumeControlOpen] = useState(false);

  // Attempts to toggle playback, ignoring clicks while buffering or in an error state.
  const attemptTogglePlay = async () => {
    if (isBuffering || hasError) return;
    if (videoRef.current) {
      if (videoRef.current.paused) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.warn(
            "Video playback failed. This is usually caused by an invalid/expired video URL or missing browser codecs:",
            error
          );
        }
      } else {
        videoRef.current.pause();
      }
    }
    setIsVolumeControlOpen(false);
  };

  // Toggles fullscreen on the video wrapper
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch((err) => console.error(err));
      } else {
        document.exitFullscreen();
      }
    }
    setIsVolumeControlOpen(false);
  };

  // Writes the volume value directly to the underlying video element.
  const setVolume = (volume: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = volume;
    if (volume > 0) {
      lastVolumeRef.current = null;
    }
  };

  // Writes the muted state directly to the underlying video element.
  const toggleMute = (muted: boolean) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (muted) {
      lastVolumeRef.current = videoElement.volume;
      videoElement.muted = true;
      setVolume(0);
      return;
    }

    videoElement.muted = false;
    if (lastVolumeRef.current !== null) {
      setVolume(lastVolumeRef.current);
      lastVolumeRef.current = null;
    }
  };

  // Shows controls and refreshes the shared auto-hide timer.
  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

    if (!isMouseOverControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  // Enters or exits browser picture-in-picture mode when supported.
  const togglePip = async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Some browsers or browser settings do not expose the PiP API.
    if (!document.pictureInPictureEnabled) {
      console.warn("Picture-in-Picture is not supported by this browser.");
      return;
    }

    try {
      if (document.pictureInPictureElement === videoElement) {
        // If this video is already in PiP, exit it.
        await document.exitPictureInPicture();
      } else {
        // Otherwise, request the video to enter PiP mode.
        await videoElement.requestPictureInPicture();
      }
      setIsPip(!isPip);
    } catch (error) {
      console.error("Failed to toggle Picture-in-Picture mode:", error);
    } finally {
      setIsVolumeControlOpen(false);
    }
  };

  // Mirrors the browser fullscreen state back into React state.
  const handleFullscreenChange = () => {
    const container = containerRef.current;
    setIsFullscreen(!!container && document.fullscreenElement === container);
    setIsVolumeControlOpen(false);
  };

  // Registers the fullscreen listener and syncs immediately for initial state.
  useEffect(() => {
    handleFullscreenChange();
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <VideoContext.Provider
      value={{
        videoRef,
        containerRef,
        isPlaying,
        isBuffering,
        hasError,
        videoProgress,
        videoDuration,
        showControls,
        controlsTimeoutRef,
        isFullscreen,
        isMouseOverControls,
        isPip,
        isVolumeControlOpen,
        attemptTogglePlay,
        toggleFullscreen,
        setIsPlaying,
        setIsBuffering,
        setHasError,
        setVideoProgress,
        setVideoDuration,
        setShowControls,
        showControlsTemporarily,
        setVolume,
        toggleMute,
        setIsMouseOverControls,
        togglePip,
        setIsVolumeControlOpen
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// VideoRoot: Handles the Provider and the Inactivity Timeout Logic
// -----------------------------------------------------------------------------

export interface VideoRootProps extends React.ComponentPropsWithoutRef<"div"> {}

export default function VideoRoot({
  children,
  className = "",
  ...props
}: VideoRootProps) {
  // Composes provider state with the interactive container shell.
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
  const {
    containerRef,
    controlsTimeoutRef,
    setShowControls,
    showControlsTemporarily
  } = useVideo();

  // Shows controls on movement and schedules auto-hide when the controls are not hovered.
  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  // Clears pending auto-hide and hides controls when leaving the video area.
  const handleMouseLeave = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    setShowControls(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-video w-full overflow-hidden bg-black [container-type:inline-size]",
        className
      )}
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

const videoViewportVariants = cva("h-full w-full", {
  variants: {
    fit: {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
      none: "object-none",
      scaleDown: "object-scale-down"
    }
  },
  defaultVariants: {
    fit: "cover"
  }
});

const centerControlIconClassName = "h-[min(60px,16cqw)] w-[min(60px,16cqw)]";

export interface VideoViewportProps
  extends Omit<React.ComponentPropsWithoutRef<"video">, "controls">,
    VariantProps<typeof videoViewportVariants> {}

export function VideoViewport({
  src,
  fit,
  className = "",
  ...props
}: VideoViewportProps) {
  const {
    videoRef,
    setIsPlaying,
    setIsBuffering,
    setHasError,
    setVideoProgress,
    setVideoDuration,
    videoDuration,
    isPlaying,
    isBuffering,
    hasError,
    setIsVolumeControlOpen,
    showControlsTemporarily,
    showControls,
    attemptTogglePlay
  } = useVideo();
  const rafRef = useRef<number | null>(null);
  const lastSyncedProgressRef = useRef(0);
  const shouldResumeAfterBufferRef = useRef(false);

  // Copies duration metadata from the video element into shared context.
  const syncDuration = useCallback(
    (videoEl: HTMLVideoElement) => {
      if (videoEl && videoEl.duration) {
        setVideoDuration(videoEl.duration);
      }
    },
    [setVideoDuration]
  );

  // Syncs duration when the source changes and metadata is already available.
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (videoElement.readyState >= 1) {
      syncDuration(videoElement);
    }
  }, [src, videoRef, syncDuration]);

  // Polls currentTime on animation frames so progress UI stays smooth.
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !isPlaying) return;

    const updateLoop = () => {
      const currentTime = videoElement.currentTime;
      if (Math.abs(currentTime - lastSyncedProgressRef.current) >= 0.05) {
        lastSyncedProgressRef.current = currentTime;
        setVideoProgress(currentTime);
      }
      // Continue polling on the browser's next repaint.
      rafRef.current = requestAnimationFrame(updateLoop);
    };

    rafRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, setVideoProgress, videoRef]);

  // Marks buffering and remembers that playback should resume afterward.
  const handleBufferingStart = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    shouldResumeAfterBufferRef.current = true;
    setIsBuffering(true);
  }, [videoRef, setIsBuffering]);

  // Clears buffering and resumes playback if buffering interrupted active playback.
  const handleBufferingEnd = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (shouldResumeAfterBufferRef.current) {
      shouldResumeAfterBufferRef.current = false;
      videoElement.play().catch((error) => {
        console.warn("Video playback could not resume after buffering:", error);
      });
    }
    setIsBuffering(false);
  }, [videoRef, setIsBuffering]);

  // Resets the error state and asks the video element to reload the current source.
  const handleRetry = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    setHasError(false);
    setIsBuffering(true);
    shouldResumeAfterBufferRef.current = false;
    videoElement.load();
  };

  // Skips within the loaded media bounds and keeps shared progress in sync.
  const skipVideoBy = useCallback(
    (seconds: number) => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const nextTime = Math.min(
        Math.max(videoElement.currentTime + seconds, 0),
        videoDuration
      );
      videoElement.currentTime = nextTime;
      setVideoProgress(nextTime);
    },
    [videoDuration, videoRef, setVideoProgress]
  );

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        src={src}
        className={cn(videoViewportVariants({ fit }), className)}
        // Fires when .play() succeeds and the video transitions to active playback.
        onPlay={() => {
          setIsPlaying(true);
          setIsVolumeControlOpen(false);
        }}
        // Fires when playback is halted by user action or the media element.
        onPause={() => {
          const currentTime = videoRef.current?.currentTime ?? 0;
          setIsPlaying(false);
          lastSyncedProgressRef.current = currentTime;
          setVideoProgress(currentTime);
          setIsVolumeControlOpen(false);
        }}
        // Fires when the browser starts resolving or loading the media source.
        onLoadStart={() => setIsBuffering(true)}
        // Fires when duration, dimensions, and track metadata are available.
        onLoadedMetadata={(e) => syncDuration(e.currentTarget)}
        // Fires when the first frame is downloaded and decoded.
        onLoadedData={handleBufferingEnd}
        // Fires when the browser believes playback can begin.
        onCanPlay={handleBufferingEnd}
        // Fires when the browser estimates playback can continue without buffering.
        onCanPlayThrough={handleBufferingEnd}
        // Fires when playback stalls because the next frame is unavailable.
        onWaiting={handleBufferingStart}
        // Fires when the browser is fetching but the server stops sending data.
        onStalled={handleBufferingStart}
        // Handles fatal media failures like CORS, 403s, or unsupported codecs.
        onError={(e) => {
          setIsBuffering(false);
          setIsPlaying(false);
          setHasError(true);
          shouldResumeAfterBufferRef.current = false;
          console.error("Video element failed to stream source asset:", e);
        }}
        // Disables native controls so this component owns the full UI.
        controls={false}
        {...props}
      />

      <div
        className={
          "absolute inset-0 flex items-center justify-center p-[min(1rem,3cqw)]"
        }
        onPointerDown={showControlsTemporarily}
      >
        <div className="flex items-center gap-[min(0.75rem,2.5cqw)]">
          {!isBuffering && showControls && (
            <button
              className={cn(
                "flex aspect-square items-center justify-center rounded-xl bg-white/10 p-[min(0.75rem,2.5cqw)] backdrop-blur-xs transition-[opacity,transform] duration-300 hover:cursor-pointer"
              )}
              onPointerUp={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                skipVideoBy(-10);
              }}
            >
              <RotateCcw className="h-[min(34px,9cqw)] w-[min(34px,9cqw)] text-white/60" />
            </button>
          )}

          {showControls && (
            <div
              className={cn(
                "flex aspect-square items-center justify-center rounded-2xl bg-white/10 p-[min(1rem,3cqw)] backdrop-blur-xs transition-[opacity,transform] duration-300",
                !isBuffering && "hover:cursor-pointer"
              )}
              onClick={attemptTogglePlay}
            >
              {isBuffering ? (
                <Loader2
                  className={cn("animate-spin", centerControlIconClassName)}
                  color="rgba(255, 255, 255, 0.78)"
                />
              ) : isPlaying ? (
                <Pause
                  className={cn(centerControlIconClassName, "text-white/60")}
                  fill="currentColor"
                  strokeWidth={0}
                />
              ) : (
                <Play
                  className={cn(centerControlIconClassName, "text-white/60")}
                  fill="currentColor"
                  strokeWidth={0}
                />
              )}
            </div>
          )}

          {!isBuffering && showControls && (
            <button
              className={cn(
                "flex aspect-square items-center justify-center rounded-xl bg-white/10 p-[min(0.75rem,2.5cqw)] backdrop-blur-xs transition-[opacity,transform] duration-300 hover:cursor-pointer"
              )}
              onPointerUp={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                skipVideoBy(10);
              }}
            >
              <RotateCw className="h-[min(34px,9cqw)] w-[min(34px,9cqw)] text-white/60" />
            </button>
          )}
        </div>
      </div>

      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col gap-2 items-center justify-center bg-black/80 text-center cursor-default select-none">
          <AlertCircle className="mx-auto text-red-300" size={20} />
          <p className="text-sm text-white font-medium">Video failed to load</p>
          <p className="text-sm text-white/70">
            The video source could not be found or the browser could not play
            it.
          </p>
          <Button variant="secondary" size="sm" onClick={handleRetry}>
            Retry
          </Button>
        </div>
      )}
    </div>
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
  const { showControls, setIsMouseOverControls } = useVideo();

  // Tracks hover state so the container does not auto-hide controls mid-interaction.
  return (
    <div
      onMouseEnter={() => setIsMouseOverControls(true)}
      onMouseLeave={() => setIsMouseOverControls(false)}
      id="video-controls"
      className={cn(
        "absolute bottom-0 left-0 right-0 px-3 pb-3 pt-3 transition-opacity duration-300",
        "bg-gradient-to-t from-black/95 to-transparent to-90%",
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
  const {
    videoRef,
    toggleMute,
    setVolume,
    isVolumeControlOpen,
    setIsVolumeControlOpen
  } = useVideo();

  // Local state mirrors native video volume/mute events for instant UI feedback.
  const [localVolume, setLocalVolume] = useState<number>(1);
  const [localMuted, setLocalMuted] = useState<boolean>(false);

  // Drag state and slider ref let pointer movement update volume globally.
  const [isVolumeDragging, setIsVolumeDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Converts a pointer Y position within the vertical slider into a volume fraction.
  const setVolumeFromClientY = useCallback(
    (clientY: number) => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
      const frac = rect.height ? 1 - y / rect.height : 0;
      setVolume(frac);
      toggleMute(frac === 0);
    },
    [setVolume, toggleMute]
  );

  // Starts a volume drag and applies the first volume value immediately.
  const handleSliderPointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    setIsVolumeDragging(true);
    setIsVolumeControlOpen(true);
    setVolumeFromClientY(event.clientY);
  };

  // Registers global pointer listeners while dragging outside the slider bounds.
  useEffect(() => {
    if (!isVolumeDragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      setVolumeFromClientY(event.clientY);
    };

    const handlePointerUp = () => {
      setIsVolumeDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isVolumeDragging, setVolumeFromClientY]);

  // Keeps local mute and volume state synced with native media element changes.
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const sync = () => {
      setLocalMuted(videoElement.muted);
      setLocalVolume(videoElement.volume);
    };
    sync();
    videoElement.addEventListener("volumechange", sync);
    return () => videoElement.removeEventListener("volumechange", sync);
  }, [videoRef]);

  // Chooses the volume icon that best matches the current mute/volume state.
  const iconToDisplay = (() => {
    if (localMuted) {
      return <VolumeOff size={18} fill="white" />;
    } else if (localVolume < 0.33) {
      return <Volume size={18} fill="white" />;
    } else if (localVolume < 0.67) {
      return <Volume1 size={18} fill="white" />;
    } else {
      return <Volume2 size={18} fill="white" />;
    }
  })();

  return (
    <div className={cn("relative flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={() => toggleMute(!localMuted)}
        className="relative group/button text-white hover:cursor-pointer"
        {...props}
      >
        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 transition-opacity duration-300 select-none group-hover/button:opacity-100">
          {localMuted ? "Unmute" : "Mute"}
        </span>
        {iconToDisplay}
      </button>
      <button
        type="button"
        onClick={() => setIsVolumeControlOpen(!isVolumeControlOpen)}
        className="text-white hover:cursor-pointer"
        aria-label={isVolumeControlOpen ? "Hide volume" : "Show volume"}
      >
        {isVolumeControlOpen ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronUp size={16} />
        )}
      </button>
      <div
        className={cn(
          "absolute -top-22 left-[27px] h-20 w-1 transition-opacity duration-300",
          isVolumeControlOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div
          ref={sliderRef}
          className="relative h-full w-full rounded-full bg-neutral-600"
          onPointerDown={handleSliderPointerDown}
        >
          <div
            className="pointer-events-none absolute bottom-0 left-0 w-full rounded-full bg-white"
            style={{ height: `${localVolume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export interface VideoPipTriggerProps
  extends React.ComponentPropsWithoutRef<"button"> {}

export function VideoPipTrigger({
  className = "",
  ...props
}: VideoPipTriggerProps): React.ReactElement {
  const { isPip, togglePip } = useVideo();

  // Renders the PiP toggle and tooltip using the shared PiP state.
  return (
    <button
      onClick={togglePip}
      className={`relative group/button text-white hover:cursor-pointer ${className}`}
      {...props}
    >
      <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 transition-opacity duration-300 select-none group-hover/button:opacity-100 whitespace-nowrap">
        {isPip ? "Disable PiP" : "Enable PiP"}
      </span>
      <PictureInPicture2 size={18} />
    </button>
  );
}

export interface VideoPlayTriggerProps
  extends React.ComponentPropsWithoutRef<"button"> {}

export function VideoPlayTrigger({
  className = "",
  ...props
}: VideoPlayTriggerProps): React.ReactElement {
  const { isPlaying, isBuffering, attemptTogglePlay } = useVideo();

  // Renders play, pause, or loading buttons based on playback state.
  return (
    <button
      onClick={attemptTogglePlay}
      disabled={isBuffering}
      aria-busy={isBuffering}
      className={`relative group/button text-white hover:cursor-pointer disabled:cursor-wait disabled:opacity-60 ${className}`}
      {...props}
    >
      <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 transition-opacity duration-300 select-none group-hover/button:opacity-100">
        {isBuffering ? "" : isPlaying ? "Pause" : "Play"}
      </span>
      {isBuffering ? (
        <Loader2 className="animate-spin" size={18} />
      ) : isPlaying ? (
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

  // Renders fullscreen enter/exit buttons based on browser fullscreen state.
  return (
    <button
      onClick={toggleFullscreen}
      className={`relative group/button text-white hover:cursor-pointer ${className}`}
      {...props}
    >
      <span className="pointer-events-none absolute -top-7 -translate-x-1/2 -left-3 text-xs text-white opacity-0 transition-opacity duration-300 select-none group-hover/button:opacity-100 whitespace-nowrap">
        {isFullscreen ? "Exit Full Screen" : "Full Screen"}
      </span>
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
  const { videoProgress, videoDuration } = useVideo();

  // Displays elapsed time, seek slider, and total duration as one control group.
  return (
    <div
      className={`flex-1 ${className} flex items-center justify-center gap-2`}
    >
      <span className="text-sm text-white select-none">
        {formatTime(videoProgress)}
      </span>
      <VideoSeekSlider {...props} />
      <span className="text-sm text-white select-none">
        {formatTime(videoDuration)}
      </span>
    </div>
  );
}

function VideoSeekSlider({
  className = "",
  ...props
}: React.ComponentPropsWithoutRef<"div">): React.ReactElement {
  // Remembers whether playback should resume after the user finishes seeking.
  const wasPlayingRef = useRef<boolean>(false);

  const {
    videoDuration,
    videoProgress,
    videoRef,
    setVideoProgress,
    setIsVolumeControlOpen
  } = useVideo();

  const frac = videoDuration > 0 ? videoProgress / videoDuration : 0;

  const progressBarContainerRef = useRef<HTMLDivElement | null>(null);
  // Hover stores x pixels from the slider edge and the matching video timestamp.
  const [hover, setHover] = useState<{ x: number; time: number } | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Converts a pointer X position into a clamped slider offset and progress fraction.
  const getXOffsetandFraction = useCallback(
    (clientX: number): { x: number; frac: number } | undefined => {
      if (!progressBarContainerRef.current || videoDuration === 0) return;
      const rect = progressBarContainerRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const frac = rect.width ? x / rect.width : 0;
      return { x, frac };
    },
    [videoDuration]
  );

  // Seeks the video to a fraction of total duration and closes the volume control.
  const handleSeekVideo = useCallback(
    (newFrac: number) => {
      if (!videoRef.current || videoDuration === 0) return;
      const newTime = newFrac * videoDuration;
      videoRef.current.currentTime = newTime;
      setVideoProgress(newTime);
      setIsVolumeControlOpen(false);
    },
    [videoDuration, videoRef, setVideoProgress, setIsVolumeControlOpen]
  );

  // Updates the tooltip position and preview time from a pointer X position.
  const updateHoverFromClientX = useCallback(
    (clientX: number) => {
      const val = getXOffsetandFraction(clientX);
      if (!val) return;
      setHover({ x: val.x, time: val.frac * videoDuration });
    },
    [videoDuration, getXOffsetandFraction]
  );

  // Shows and updates the hover tooltip while the pointer moves over the slider.
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    updateHoverFromClientX(event.clientX);
    setIsHovering(true);
  };

  // Starts seeking, pauses playback during drag, and applies the first seek value.
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

  // Hides the tooltip on leave unless an active drag still needs feedback.
  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsHovering(false);
    }
  };

  // Updates both the seek position and tooltip while dragging globally.
  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      updateHoverFromClientX(event.clientX);
      const val = getXOffsetandFraction(event.clientX);
      if (!val) return;
      handleSeekVideo(val.frac);
    },
    [updateHoverFromClientX, getXOffsetandFraction, handleSeekVideo]
  );

  // Ends seeking and resumes playback if the video was playing before the drag.
  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setIsHovering(false);
    if (videoRef.current && wasPlayingRef.current) {
      videoRef.current.play().catch((error) => {
        console.warn("Video playback could not resume after seeking:", error);
      });
    }
    wasPlayingRef.current = false;
  }, [videoRef]);

  // Registers global drag listeners so seeking continues outside the slider bounds.
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
      ref={progressBarContainerRef}
      className={cn(
        "relative flex-1 h-4 translate-y-[0.4px] flex items-center",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      {...props}
    >
      <div
        id="video-progress-bar-bg"
        className="h-1 w-full rounded-full bg-neutral-600"
      />
      <div
        id="video-progress-bar-fill"
        className="pointer-events-none absolute left-0 h-1 rounded-full bg-white"
        style={{ width: `${frac * 100}%` }}
      />

      {hover && (
        <div
          id="video-progress-bar-hover-time"
          className={cn(
            "pointer-events-none absolute -top-13 z-10 rounded text-sm text-white transition-opacity duration-300 flex flex-col items-center gap-[3px] select-none",
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

// Formats seconds into the m:ss timestamp used by the player controls.
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
