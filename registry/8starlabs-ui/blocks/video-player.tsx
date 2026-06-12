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
  Volume,
  Volume1,
  Volume2,
  VolumeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/8starlabs-ui/blocks/button";
import GlassContainer from "../ui/apple-glass-effect";

interface VideoContextType {
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMouseOverControls, setIsMouseOverControls] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [isVolumeControlOpen, setIsVolumeControlOpen] = useState(false);

  // Toggle play/pause state of the video
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

  // Toggle fullscreen mode for the video container
  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch((err) => console.error(err));
      } else {
        document.exitFullscreen();
      }
    }
    setIsVolumeControlOpen(false);
  };

  // Set the volume of the video element
  const setVolume = (volume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  };

  // Toggle mute state of the video element
  const toggleMute = (muted: boolean) => {
    if (!videoRef.current) return;
    videoRef.current.muted = muted;
  };

  // Toggle picture-in-picture mode
  const togglePip = async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Check if the browser actually supports PiP (some older versions or configurations don't)
    if (!document.pictureInPictureEnabled) {
      console.warn("Picture-in-Picture is not supported by this browser.");
      return;
    }

    try {
      if (document.pictureInPictureElement === videoElement) {
        // If this video is already in PiP, exit it
        await document.exitPictureInPicture();
      } else {
        // Otherwise, request the video to enter PiP mode
        await videoElement.requestPictureInPicture();
      }
      setIsPip(!isPip);
    } catch (error) {
      console.error("Failed to toggle Picture-in-Picture mode:", error);
    } finally {
      setIsVolumeControlOpen(false);
    }
  };

  const handleFullscreenChange = () => {
    const container = videoRef.current?.parentElement;
    setIsFullscreen(!!container && document.fullscreenElement === container);
    setIsVolumeControlOpen(false);
  };

  // Listen for fullscreen changes to update the isFullscreen state accordingly
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
  const { setShowControls, isMouseOverControls } = useVideo();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <div
      className={`relative overflow-hidden bg-black hover:cursor-pointer ${className}`}
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
  extends Omit<React.ComponentPropsWithoutRef<"video">, "controls"> {}

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
    isPlaying,
    isBuffering,
    hasError,
    setIsVolumeControlOpen,
    attemptTogglePlay,
    showControls
  } = useVideo();
  const rafRef = useRef<number | null>(null);
  const shouldResumeAfterBufferRef = useRef(false);

  // function to sync duration metadata to context state
  const syncDuration = useCallback(
    (videoEl: HTMLVideoElement) => {
      if (videoEl && videoEl.duration) {
        setVideoDuration(videoEl.duration);
      }
    },
    [setVideoDuration]
  );

  // Sync duration metadata when source or video element changes (e.g. on initial load)
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (videoElement.readyState >= 1) {
      syncDuration(videoElement);
    }
  }, [src, videoRef, syncDuration]);

  // Use requestAnimationFrame to sync the video progress with the UI for smooth updates
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

  const handleBufferingStart = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    shouldResumeAfterBufferRef.current = true;
    setIsBuffering(true);
  }, [videoRef, setIsBuffering]);

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
        onPlay={() => {
          setIsPlaying(true);
          setIsVolumeControlOpen(false);
        }}
        // fires when playback is halted
        // when .pause() is successfully invoked
        onPause={() => {
          setIsPlaying(false);
          setIsVolumeControlOpen(false);
        }}
        // fires when the browser begins looking for the media resource
        // when `src` is resolved or updated
        onLoadStart={() => setIsBuffering(true)}
        // fires when the basic structural properties of the video are parsed
        // when browser resolved duration, dimensions and text/audio tracks
        onLoadedMetadata={(e) => syncDuration(e.currentTarget)}
        // fires when first frame of video is downloaded and decoded
        onLoadedData={handleBufferingEnd}
        // fires when browser believes it can begin playing video
        onCanPlay={handleBufferingEnd}
        // fires when browser believes it can begin playing entire video from start to finish without pausing to buffer.
        onCanPlayThrough={handleBufferingEnd}
        // fires when playback unexpectedly stops because next frame is not available
        onWaiting={handleBufferingStart}
        // fires when browser is trying to fetch media data but server stopped sending it
        onStalled={handleBufferingStart}
        // fires when user clicks inside boundary of video element canvas
        onClick={attemptTogglePlay}
        // fires on fatal breakdown that prevents video from loading or playing:
        // CORS, 403, etc
        onError={(e) => {
          setIsBuffering(false);
          setIsPlaying(false);
          setHasError(true);
          shouldResumeAfterBufferRef.current = false;
          console.error("Video element failed to stream source asset:", e);
        }}
        // explicitly tell browser to not render its own video controls UI
        controls={false}
        {...props}
      />

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity",
          isBuffering || showControls ? "opacity-100" : "opacity-0"
        )}
        onClick={attemptTogglePlay}
      >
        <GlassContainer
          className="inline-flex items-center justify-center"
          variant="regular"
          tint="cool"
          blur={3}
          opacity={0.1}
          edgeBlur={false}
        >
          {isBuffering ? (
            <Loader2
              className="animate-spin"
              size={70}
              color="rgba(255, 255, 255, 0.78)"
            />
          ) : isPlaying ? (
            <Pause
              size={70}
              color="rgba(255, 255, 255, 0.78)"
              fill="transparent"
              strokeWidth={2}
            />
          ) : (
            <Play
              size={70}
              color="rgba(255, 255, 255, 0.78)"
              fill="transparent"
              strokeWidth={2}
            />
          )}
        </GlassContainer>
      </div>

      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col gap-2 items-center justify-center bg-black/80 text-center cursor-default">
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

  return (
    <div
      onMouseEnter={() => setIsMouseOverControls(true)}
      onMouseLeave={() => setIsMouseOverControls(false)}
      id="video-controls"
      className={cn(
        "absolute bottom-0 left-0 right-0 px-3 pb-3 pt-3 transition-opacity",
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

  const [localVolume, setLocalVolume] = useState<number>(1);
  const [localMuted, setLocalMuted] = useState<boolean>(false);

  const [isVolumeDragging, setIsVolumeDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

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

  const handleSliderPointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    setIsVolumeDragging(true);
    setIsVolumeControlOpen(true);
    setVolumeFromClientY(event.clientY);
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
        type="button"
        onClick={() => toggleMute(!localMuted)}
        className="relative group/button text-white hover:cursor-pointer"
        {...props}
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

  return (
    <button
      onClick={togglePip}
      className={`relative group/button text-white hover:cursor-pointer ${className}`}
      {...props}
    >
      <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 transition-opacity duration-150 group-hover/button:opacity-100 whitespace-nowrap">
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

  return (
    <button
      onClick={attemptTogglePlay}
      disabled={isBuffering}
      aria-busy={isBuffering}
      className={`relative group/button text-white hover:cursor-pointer disabled:cursor-wait disabled:opacity-60 ${className}`}
      {...props}
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
      className={`relative group/button text-white hover:cursor-pointer ${className}`}
      {...props}
    >
      <span className="pointer-events-none absolute -top-7 -translate-x-1/2 -left-3 text-xs text-white opacity-0 transition-opacity duration-150 group-hover/button:opacity-100 whitespace-nowrap">
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

  return (
    <div
      className={`flex-1 ${className} flex items-center justify-center gap-2`}
    >
      <span className="text-white text-sm">{formatTime(videoProgress)}</span>
      <VideoSeekSlider {...props} />
      <span className="text-white text-sm">{formatTime(videoDuration)}</span>
    </div>
  );
}

function VideoSeekSlider({
  className = "",
  ...props
}: React.ComponentPropsWithoutRef<"div">): React.ReactElement {
  const wasPlayingRef = useRef<boolean>(false);

  const { videoDuration, videoProgress, videoRef, setIsVolumeControlOpen } =
    useVideo();

  const frac = videoDuration > 0 ? videoProgress / videoDuration : 0;

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
      setIsVolumeControlOpen(false);
    },
    [videoDuration, videoRef, setIsVolumeControlOpen]
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
      videoRef.current.play().catch((error) => {
        console.warn("Video playback could not resume after seeking:", error);
      });
    }
    wasPlayingRef.current = false;
  }, [videoRef]);

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
      id="video-progress-bar"
      ref={containerRef}
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

// Helper function to format time in seconds to "minutes:seconds"
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
