"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
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
  Volume,
  Volume1,
  Volume2,
  VolumeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoContextType {
  rootRef: React.RefObject<HTMLDivElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  isBuffering: boolean;
  hasError: boolean;
  videoProgress: number;
  videoDuration: number;
  showControls: boolean;
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
  setVolume: (x: number) => void;
  setIsMouseOverControls: (x: boolean) => void;
  toggleMute: (x: boolean) => void;
  togglePip: () => void;
  setIsVolumeControlOpen: (x: boolean) => void;
}

const VideoContext = createContext<VideoContextType | null>(null);

function ignoreRejectedMediaRequest(): void {
  // Media APIs can reject due to browser policy or unsupported modes; DOM
  // events and UI state handle the user-visible outcome.
}

function composeEventHandlers<Event extends React.SyntheticEvent>(
  externalHandler: ((event: Event) => void) | undefined,
  internalHandler: (event: Event) => void
) {
  return (event: Event) => {
    externalHandler?.(event);

    if (!event.defaultPrevented) {
      internalHandler(event);
    }
  };
}

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
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMouseOverControls, setIsMouseOverControls] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [isVolumeControlOpen, setIsVolumeControlOpen] = useState(false);

  // Toggle play/pause state of the video
  const attemptTogglePlay = useCallback(async () => {
    if (isBuffering || hasError) return;
    if (videoRef.current) {
      if (videoRef.current.paused) {
        try {
          await videoRef.current.play();
        } catch {
          ignoreRejectedMediaRequest();
        }
      } else {
        videoRef.current.pause();
      }
    }
    setIsVolumeControlOpen(false);
  }, [hasError, isBuffering]);

  // Toggle fullscreen mode for the video container
  const toggleFullscreen = useCallback(() => {
    const container = rootRef.current;
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(ignoreRejectedMediaRequest);
      } else {
        document.exitFullscreen().catch(ignoreRejectedMediaRequest);
      }
    }
    setIsVolumeControlOpen(false);
  }, []);

  // Set the volume of the video element
  const setVolume = useCallback((volume: number) => {
    if (videoRef.current) {
      const nextVolume = Math.min(Math.max(volume, 0), 1);
      videoRef.current.volume = nextVolume;
      if (nextVolume > 0) {
        videoRef.current.muted = false;
      }
    }
  }, []);

  // Toggle mute state of the video element
  const toggleMute = useCallback((muted: boolean) => {
    if (!videoRef.current) return;
    videoRef.current.muted = muted;
    if (!muted && videoRef.current.volume === 0) {
      videoRef.current.volume = 1;
    }
  }, []);

  // Toggle picture-in-picture mode
  const togglePip = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Check if the browser actually supports PiP (some older versions or configurations don't)
    if (!document.pictureInPictureEnabled) {
      return;
    }

    try {
      const isCurrentlyPip = document.pictureInPictureElement === videoElement;

      if (isCurrentlyPip) {
        // If this video is already in PiP, exit it
        await document.exitPictureInPicture();
        setIsPip(false);
      } else {
        // Otherwise, request the video to enter PiP mode
        await videoElement.requestPictureInPicture();
        setIsPip(true);
      }
    } catch {
      ignoreRejectedMediaRequest();
    } finally {
      setIsVolumeControlOpen(false);
    }
  }, []);

  const handleFullscreenChange = useCallback(() => {
    const container = rootRef.current;
    setIsFullscreen(!!container && document.fullscreenElement === container);
    setIsVolumeControlOpen(false);
  }, []);

  // Listen for fullscreen changes to update the isFullscreen state accordingly
  useEffect(() => {
    handleFullscreenChange();
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  const contextValue = useMemo<VideoContextType>(
    () => ({
      rootRef,
      videoRef,
      isPlaying,
      isBuffering,
      hasError,
      videoProgress,
      videoDuration,
      showControls,
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
      setVolume,
      toggleMute,
      setIsMouseOverControls,
      togglePip,
      setIsVolumeControlOpen
    }),
    [
      hasError,
      isBuffering,
      isFullscreen,
      isMouseOverControls,
      isPip,
      isPlaying,
      isVolumeControlOpen,
      showControls,
      videoDuration,
      videoProgress,
      attemptTogglePlay,
      setVolume,
      toggleFullscreen,
      toggleMute,
      togglePip
    ]
  );

  return (
    <VideoContext.Provider value={contextValue}>
      {children}
    </VideoContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// VideoRoot: Handles the Provider and the Inactivity Timeout Logic
// -----------------------------------------------------------------------------

export type VideoRootProps = React.ComponentPropsWithoutRef<"div">;

export default function VideoRoot({
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
  const { rootRef, setShowControls, isMouseOverControls } = useVideo();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    onMouseMove,
    onMouseLeave,
    onFocusCapture,
    onBlurCapture,
    ...containerProps
  } = props;

  const handleMouseMove = () => {
    setShowControls(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!isMouseOverControls) {
      timeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowControls(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      {...containerProps}
      ref={rootRef}
      className={cn(
        "relative overflow-hidden bg-black hover:cursor-pointer",
        className
      )}
      onMouseMove={(event) => {
        onMouseMove?.(event);
        if (!event.defaultPrevented) handleMouseMove();
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        if (!event.defaultPrevented) handleMouseLeave();
      }}
      onFocusCapture={composeEventHandlers(onFocusCapture, () =>
        setShowControls(true)
      )}
      onBlurCapture={composeEventHandlers(onBlurCapture, (event) => {
        const nextFocusedElement = event.relatedTarget;
        if (
          !(nextFocusedElement instanceof Node) ||
          !event.currentTarget.contains(nextFocusedElement)
        ) {
          setShowControls(false);
        }
      })}
    >
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
// VideoViewport: The actual HTML5 Video Tag
// -----------------------------------------------------------------------------

export type VideoViewportProps = Omit<
  React.ComponentPropsWithoutRef<"video">,
  "controls" | "src"
> & {
  src: string;
};

export function VideoViewport({
  src,
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
    isBuffering,
    hasError,
    setIsVolumeControlOpen,
    attemptTogglePlay
  } = useVideo();
  const rafRef = useRef<number | null>(null);
  const shouldResumeAfterBufferRef = useRef(false);
  const {
    onPlay,
    onPause,
    onLoadStart,
    onLoadedMetadata,
    onLoadedData,
    onCanPlay,
    onCanPlayThrough,
    onWaiting,
    onStalled,
    onClick,
    onError,
    onEnded,
    onSeeked,
    onTimeUpdate,
    ...videoProps
  } = props;

  // function to sync duration metadata to context state
  const syncDuration = useCallback(
    (videoEl: HTMLVideoElement) => {
      if (Number.isFinite(videoEl.duration) && videoEl.duration > 0) {
        setVideoDuration(videoEl.duration);
      }
    },
    [setVideoDuration]
  );

  const syncProgress = useCallback(
    (videoEl: HTMLVideoElement) => {
      setVideoProgress(videoEl.currentTime);
    },
    [setVideoProgress]
  );

  const stopProgressLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startProgressLoop = useCallback(() => {
    stopProgressLoop();

    const updateLoop = () => {
      const videoElement = videoRef.current;
      if (!videoElement || videoElement.paused || videoElement.ended) {
        rafRef.current = null;
        return;
      }

      setVideoProgress(videoElement.currentTime);
      rafRef.current = requestAnimationFrame(updateLoop);
    };

    rafRef.current = requestAnimationFrame(updateLoop);
  }, [setVideoProgress, stopProgressLoop, videoRef]);

  // Sync duration metadata when source or video element changes (e.g. on initial load)
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (videoElement.readyState >= 1) {
      syncDuration(videoElement);
      syncProgress(videoElement);
    }
  }, [src, videoRef, syncDuration, syncProgress]);

  useEffect(() => stopProgressLoop, [stopProgressLoop]);

  const handleBufferingStart = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    shouldResumeAfterBufferRef.current =
      !videoElement.paused && !videoElement.ended;
    setIsBuffering(true);
  }, [videoRef, setIsBuffering]);

  const handleBufferingEnd = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (shouldResumeAfterBufferRef.current) {
      shouldResumeAfterBufferRef.current = false;
      videoElement.play().catch(ignoreRejectedMediaRequest);
    }
    setIsBuffering(false);
  }, [videoRef, setIsBuffering]);

  const handleRetry = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    setHasError(false);
    setIsBuffering(true);
    shouldResumeAfterBufferRef.current = false;
    videoElement.load();
  };

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        src={src}
        className={`w-full h-full object-cover ${className}`}
        // fires when the video transitions from pause to active state
        // when .play() is successfully invoked
        onPlay={(event) => {
          onPlay?.(event);
          if (event.defaultPrevented) return;
          setIsPlaying(true);
          setIsVolumeControlOpen(false);
          syncProgress(event.currentTarget);
          startProgressLoop();
        }}
        // fires when playback is halted
        // when .pause() is successfully invoked
        onPause={(event) => {
          onPause?.(event);
          if (event.defaultPrevented) return;
          setIsPlaying(false);
          setIsVolumeControlOpen(false);
          syncProgress(event.currentTarget);
          stopProgressLoop();
        }}
        // fires when the browser begins looking for the media resource
        // when `src` is resolved or updated
        onLoadStart={(event) => {
          onLoadStart?.(event);
          if (event.defaultPrevented) return;
          setHasError(false);
          shouldResumeAfterBufferRef.current = false;
          setIsBuffering(true);
        }}
        // fires when the basic structural properties of the video are parsed
        // when browser resolved duration, dimensions and text/audio tracks
        onLoadedMetadata={(event) => {
          onLoadedMetadata?.(event);
          if (event.defaultPrevented) return;
          syncDuration(event.currentTarget);
          syncProgress(event.currentTarget);
        }}
        // fires when first frame of video is downloaded and decoded
        onLoadedData={(event) => {
          onLoadedData?.(event);
          if (event.defaultPrevented) return;
          syncProgress(event.currentTarget);
          handleBufferingEnd();
        }}
        // fires when browser believes it can begin playing video
        onCanPlay={(event) => {
          onCanPlay?.(event);
          if (!event.defaultPrevented) handleBufferingEnd();
        }}
        // fires when browser believes it can begin playing entire video from start to finish without pausing to buffer.
        onCanPlayThrough={(event) => {
          onCanPlayThrough?.(event);
          if (!event.defaultPrevented) handleBufferingEnd();
        }}
        // fires when playback unexpectedly stops because next frame is not available
        onWaiting={(event) => {
          onWaiting?.(event);
          if (!event.defaultPrevented) handleBufferingStart();
        }}
        // fires when browser is trying to fetch media data but server stopped sending it
        onStalled={(event) => {
          onStalled?.(event);
          if (!event.defaultPrevented) handleBufferingStart();
        }}
        // fires when user clicks inside boundary of video element canvas
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) void attemptTogglePlay();
        }}
        onTimeUpdate={(event) => {
          onTimeUpdate?.(event);
          if (!event.defaultPrevented) syncProgress(event.currentTarget);
        }}
        onSeeked={(event) => {
          onSeeked?.(event);
          if (!event.defaultPrevented) syncProgress(event.currentTarget);
        }}
        onEnded={(event) => {
          onEnded?.(event);
          if (event.defaultPrevented) return;
          setIsPlaying(false);
          syncProgress(event.currentTarget);
          stopProgressLoop();
        }}
        // fires on fatal breakdown that prevents video from loading or playing:
        // CORS, 403, etc
        onError={(event) => {
          onError?.(event);
          if (event.defaultPrevented) return;
          setIsBuffering(false);
          setIsPlaying(false);
          setHasError(true);
          shouldResumeAfterBufferRef.current = false;
          stopProgressLoop();
        }}
        // explicitly tell browser to not render its own video controls UI
        controls={false}
        {...videoProps}
      />

      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col gap-2 items-center justify-center bg-black/80 text-center cursor-default">
          <AlertCircle className="mx-auto text-red-300" size={20} />
          <p className="text-sm text-white font-medium">Video failed to load</p>
          <p className="text-sm text-white/70">
            The video source could not be found or the browser could not play
            it.
          </p>
          <button
            type="button"
            className="mt-1 inline-flex h-8 items-center justify-center rounded-md bg-white px-3 text-sm font-medium text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      )}

      {isBuffering && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-radial from-black/80 to-black/30">
          <div className="flex items-center gap-3 text-sm text-white">
            <Loader2 className="animate-spin" size={16} />
            Loading video...
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// VideoControls: The disappearing overlay wrapper
// -----------------------------------------------------------------------------

export type VideoControlsProps = React.ComponentPropsWithoutRef<"div">;

export function VideoControls({
  children,
  className = "",
  ...props
}: VideoControlsProps): React.ReactElement {
  const { showControls, setIsMouseOverControls } = useVideo();
  const { onMouseEnter, onMouseLeave, ...controlsProps } = props;

  return (
    <div
      {...controlsProps}
      onMouseEnter={composeEventHandlers(onMouseEnter, () =>
        setIsMouseOverControls(true)
      )}
      onMouseLeave={composeEventHandlers(onMouseLeave, () =>
        setIsMouseOverControls(false)
      )}
      data-slot="video-controls"
      className={cn(
        "absolute bottom-0 left-0 right-0 px-3 pb-3 pt-3 transition-opacity",
        "bg-gradient-to-t from-black/95 to-transparent to-90%",
        showControls ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
    >
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
// VideoSoundControl: Controls volume and mute
// -----------------------------------------------------------------------------

export type VideoSoundControlProps = React.ComponentPropsWithoutRef<"button">;

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

  const [localVolume, setLocalVolume] = useState<number>(1);
  const [localMuted, setLocalMuted] = useState<boolean>(false);

  const [isVolumeDragging, setIsVolumeDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const { onClick, ...muteButtonProps } = props;

  const updateVolume = useCallback(
    (volume: number) => {
      const nextVolume = Math.min(Math.max(volume, 0), 1);
      setLocalVolume(nextVolume);
      setLocalMuted(nextVolume === 0);
      setVolume(nextVolume);
      toggleMute(nextVolume === 0);
    },
    [setVolume, toggleMute]
  );

  const setVolumeFromClientY = useCallback(
    (clientY: number) => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
      const frac = rect.height ? 1 - y / rect.height : 0;
      updateVolume(frac);
    },
    [updateVolume]
  );

  const handleSliderPointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    setIsVolumeDragging(true);
    setIsVolumeControlOpen(true);
    setVolumeFromClientY(event.clientY);
  };

  const handleSliderKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 0.1 : 0.05;
    const nextVolumeByKey: Record<string, number> = {
      ArrowUp: localVolume + step,
      ArrowRight: localVolume + step,
      ArrowDown: localVolume - step,
      ArrowLeft: localVolume - step,
      Home: 0,
      End: 1
    };

    if (!(event.key in nextVolumeByKey)) return;
    event.preventDefault();
    updateVolume(nextVolumeByKey[event.key]);
  };

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
        {...muteButtonProps}
        type="button"
        aria-label={localMuted ? "Unmute video" : "Mute video"}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) toggleMute(!localMuted);
        }}
        className="relative group/button text-white hover:cursor-pointer"
      >
        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 transition-opacity duration-150 group-hover/button:opacity-100">
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
          "absolute -top-22 left-[27px] h-20 w-1 transition-opacity duration-150",
          isVolumeControlOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div
          ref={sliderRef}
          role="slider"
          tabIndex={isVolumeControlOpen ? 0 : -1}
          aria-label="Volume"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(localVolume * 100)}
          className="relative h-full w-full rounded-full bg-neutral-600"
          onPointerDown={handleSliderPointerDown}
          onKeyDown={handleSliderKeyDown}
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

export type VideoPipTriggerProps = React.ComponentPropsWithoutRef<"button">;

export function VideoPipTrigger({
  className = "",
  ...props
}: VideoPipTriggerProps): React.ReactElement {
  const { isPip, togglePip } = useVideo();
  const { onClick, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      type="button"
      aria-label={
        isPip ? "Disable Picture-in-Picture" : "Enable Picture-in-Picture"
      }
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) void togglePip();
      }}
      className={`relative group/button text-white hover:cursor-pointer ${className}`}
    >
      <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 transition-opacity duration-150 group-hover/button:opacity-100 whitespace-nowrap">
        {isPip ? "Disable PiP" : "Enable PiP"}
      </span>
      <PictureInPicture2 size={18} />
    </button>
  );
}

export type VideoPlayTriggerProps = React.ComponentPropsWithoutRef<"button">;

export function VideoPlayTrigger({
  className = "",
  ...props
}: VideoPlayTriggerProps): React.ReactElement {
  const { isPlaying, isBuffering, attemptTogglePlay } = useVideo();
  const { onClick, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) void attemptTogglePlay();
      }}
      disabled={isBuffering}
      aria-busy={isBuffering}
      aria-label={isPlaying ? "Pause video" : "Play video"}
      className={`relative group/button text-white hover:cursor-pointer disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 transition-opacity duration-150 group-hover/button:opacity-100">
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

export type VideoFullscreenTriggerProps =
  React.ComponentPropsWithoutRef<"button">;

export function VideoFullscreenTrigger({
  className = "",
  ...props
}: VideoFullscreenTriggerProps): React.ReactElement {
  const { toggleFullscreen, isFullscreen } = useVideo();
  const { onClick, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      type="button"
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggleFullscreen();
      }}
      className={`relative group/button text-white hover:cursor-pointer ${className}`}
    >
      <span className="pointer-events-none absolute -top-7 -translate-x-1/2 -left-3 text-xs text-white opacity-0 transition-opacity duration-150 group-hover/button:opacity-100 whitespace-nowrap">
        {isFullscreen ? "Exit Full Screen" : "Full Screen"}
      </span>
      {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
    </button>
  );
}

export type VideoProgressBarProps = React.ComponentPropsWithoutRef<"div">;

export function VideoProgressBar({
  className = "",
  ...props
}: VideoProgressBarProps): React.ReactElement {
  const { videoProgress, videoDuration } = useVideo();

  return (
    <div
      {...props}
      className={`flex-1 ${className} flex items-center justify-center gap-2`}
    >
      <span className="text-white text-sm">
        {formatVideoTime(videoProgress)}
      </span>
      <VideoSeekSlider />
      <span className="text-white text-sm">
        {formatVideoTime(videoDuration)}
      </span>
    </div>
  );
}

function VideoSeekSlider(): React.ReactElement {
  const wasPlayingRef = useRef<boolean>(false);

  const {
    videoDuration,
    videoProgress,
    videoRef,
    setIsVolumeControlOpen,
    setVideoProgress
  } = useVideo();

  const frac =
    videoDuration > 0
      ? Math.min(Math.max(videoProgress / videoDuration, 0), 1)
      : 0;

  const containerRef = useRef<HTMLDivElement | null>(null);
  // x: pixels from left edge of slider container
  const [hover, setHover] = useState<{ x: number; time: number } | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Helper function to calculate the x offset and corresponding time fraction based on clientX position
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

  // Seek video to a specific time based on fraction (0 to 1) of total duration
  const handleSeekVideo = useCallback(
    (newFrac: number) => {
      if (!videoRef.current || videoDuration === 0) return;
      const newTime = newFrac * videoDuration;
      videoRef.current.currentTime = newTime;
      setVideoProgress(newTime);
      setIsVolumeControlOpen(false);
    },
    [videoDuration, videoRef, setIsVolumeControlOpen, setVideoProgress]
  );

  // Update hover state based on clientX position, used for displaying hover time tooltip
  const updateHoverFromClientX = useCallback(
    (clientX: number) => {
      const val = getXOffsetandFraction(clientX);
      if (!val) return;
      setHover({ x: val.x, time: val.frac * videoDuration });
    },
    [videoDuration, getXOffsetandFraction]
  );

  // Handle mouse move over the progress bar to update hover state and show tooltip
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    updateHoverFromClientX(event.clientX);
    setIsHovering(true);
  };

  // Handle pointer down event to start seeking the video, pause if currently playing, and set dragging state
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
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

  // Handle mouse leaving the progress bar area, hide tooltip if not dragging
  // If dragging, dont do anything so user can still see progress bar and tooltip
  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsHovering(false);
    }
  };

  // Handle pointer move event during dragging to update video seek position and hover tooltip
  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      updateHoverFromClientX(event.clientX);
      const val = getXOffsetandFraction(event.clientX);
      if (!val) return;
      handleSeekVideo(val.frac);
    },
    [updateHoverFromClientX, getXOffsetandFraction, handleSeekVideo]
  );

  // Handle pointer up event to end dragging, hide tooltip, and resume playing if it was playing before
  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setIsHovering(false);
    if (videoRef.current && wasPlayingRef.current) {
      videoRef.current.play().catch(ignoreRejectedMediaRequest);
    }
    wasPlayingRef.current = false;
  }, [videoRef]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!videoRef.current || videoDuration === 0) return;
    if (!isVideoSeekKey(event.key)) return;

    event.preventDefault();
    const nextTime = getNextSeekTime(
      videoRef.current.currentTime,
      videoDuration,
      event.key,
      event.shiftKey
    );
    videoRef.current.currentTime = nextTime;
    setVideoProgress(nextTime);
    setIsVolumeControlOpen(false);
  };

  // Add global event listeners for pointer move and pointer up when dragging starts, and clean up when dragging ends
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
      data-slot="video-progress-bar"
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label="Seek video"
      aria-valuemin={0}
      aria-valuemax={Math.round(videoDuration)}
      aria-valuenow={Math.round(Math.min(videoProgress, videoDuration))}
      aria-valuetext={`${formatVideoTime(videoProgress)} of ${formatVideoTime(videoDuration)}`}
      className={cn(
        "relative flex-1 h-4 translate-y-[0.4px] flex items-center"
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
    >
      <div
        data-slot="video-progress-bar-bg"
        className="h-1 w-full rounded-full bg-neutral-600"
      />
      <div
        data-slot="video-progress-bar-fill"
        className="pointer-events-none absolute left-0 h-1 rounded-full bg-white"
        style={{ width: `${frac * 100}%` }}
      />

      {hover && (
        <div
          data-slot="video-progress-bar-hover-time"
          className={cn(
            "pointer-events-none absolute -top-13 z-10 rounded text-sm text-white transition-opacity duration-200 flex flex-col items-center gap-[3px]",
            isHovering ? "opacity-100" : "opacity-0"
          )}
          style={{ left: hover.x, transform: "translateX(-50%)" }}
        >
          <div className="flex flex-row items-center gap-1">
            <span>{formatVideoTime(hover.time)}</span>
            <span className="opacity-50 whitespace-nowrap">{`/ ${formatVideoTime(videoDuration)}`}</span>
          </div>
          <div>|</div>
        </div>
      )}
    </div>
  );
}

export function isVideoSeekKey(key: string): boolean {
  return (
    key === "ArrowLeft" ||
    key === "ArrowRight" ||
    key === "Home" ||
    key === "End"
  );
}

export function getNextSeekTime(
  currentTime: number,
  duration: number,
  key: string,
  isLargeStep = false
): number {
  if (!Number.isFinite(duration) || duration <= 0) {
    return currentTime;
  }

  const seekBySeconds = isLargeStep ? 10 : 5;
  const keyToTime: Record<string, number> = {
    ArrowLeft: currentTime - seekBySeconds,
    ArrowRight: currentTime + seekBySeconds,
    Home: 0,
    End: duration
  };

  if (!isVideoSeekKey(key)) {
    return currentTime;
  }

  return Math.min(Math.max(keyToTime[key], 0), duration);
}

export function formatVideoTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const wholeSeconds = Math.floor(seconds);
  const hours = Math.floor(wholeSeconds / 3600);
  const mins = Math.floor((wholeSeconds % 3600) / 60);
  const secs = wholeSeconds % 60;

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
