"use client";

import React, { createContext, useContext, useRef, useState } from "react";

interface VideoContextType {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  progress: number;
  duration: number;
  showControls: boolean;
  togglePlay: () => void;
  toggleFullscreen: () => void;
  // Setters for the native video events to update context
  setIsPlaying: (playing: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setShowControls: (show: boolean) => void;
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
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);

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

  return (
    <VideoContext.Provider
      value={{
        videoRef,
        isPlaying,
        progress,
        duration,
        showControls,
        togglePlay,
        toggleFullscreen,
        setIsPlaying,
        setProgress,
        setDuration,
        setShowControls
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}
