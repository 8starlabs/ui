"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

interface VideoContextType {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  videoProgress: number;
  videoDuration: number;
  showControls: boolean;
  isFullscreen: boolean;
  togglePlay: () => void;
  toggleFullscreen: () => void;
  setIsPlaying: (playing: boolean) => void;
  setVideoProgress: (progress: number) => void;
  setVideoDuration: (videoDuration: number) => void;
  setShowControls: (show: boolean) => void;
  setVolume: (x: number) => void;
  toggleMute: (x: boolean) => void;
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
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const toggleFullscreen = () => {
    // Note: To make controls visible, we request fullscreen on the wrapper,
    // but for this basic scaffold, we'll target the video or its parent.
    const container = videoRef.current?.parentElement;
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch((err) => console.error(err));
      } else {
        document.exitFullscreen();
      }
    }
  };

  const setVolume = (volume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  };

  const toggleMute = (muted: boolean) => {
    if (!videoRef.current) return;
    videoRef.current.muted = muted;
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const container = videoRef.current?.parentElement;
      setIsFullscreen(!!container && document.fullscreenElement === container);
    };

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
        videoProgress,
        videoDuration,
        showControls,
        isFullscreen,
        togglePlay,
        toggleFullscreen,
        setIsPlaying,
        setVideoProgress,
        setVideoDuration,
        setShowControls,
        setVolume,
        toggleMute
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}
