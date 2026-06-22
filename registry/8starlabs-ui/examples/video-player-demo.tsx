import VideoRoot, {
  VideoViewport,
  VideoControls,
  VideoPlayTrigger,
  VideoFullscreenTrigger,
  VideoProgressBar,
  VideoSoundControl,
  VideoPipTrigger
} from "@/registry/8starlabs-ui/blocks/video-player";

export default function VideoPlayerDemo() {
  return (
    <VideoRoot className="rounded-lg">
      <VideoViewport src="https://vjs.zencdn.net/v/oceans.mp4" />

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
