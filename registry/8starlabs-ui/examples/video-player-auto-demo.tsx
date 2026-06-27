import VideoRoot, {
  VideoControls,
  VideoFullscreenTrigger,
  VideoPipTrigger,
  VideoPlayTrigger,
  VideoProgressBar,
  VideoSoundControl,
  VideoViewport
} from "@/registry/8starlabs-ui/blocks/video-player";

export default function VideoPlayerAutoDemo() {
  return (
    <VideoRoot className="rounded-lg" auto>
      <VideoViewport src="https://vjs.zencdn.net/v/oceans.mp4" muted />

      <VideoControls className="flex items-center justify-between gap-4">
        <VideoPlayTrigger />
        <VideoSoundControl />
        <VideoProgressBar />
        <VideoPipTrigger />
        <VideoFullscreenTrigger />
      </VideoControls>
    </VideoRoot>
  );
}
