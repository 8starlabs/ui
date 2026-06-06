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
    <VideoRoot className="rounded-t-lg">
      <VideoViewport src="https://vjs.zencdn.net/v/oceans.mp4" />

      <VideoControls className="flex gap-4 items-center justify-between">
        <VideoPlayTrigger />
        <VideoSoundControl />
        <VideoProgressBar />
        <VideoPipTrigger />
        <VideoFullscreenTrigger />
      </VideoControls>
    </VideoRoot>
  );
}
