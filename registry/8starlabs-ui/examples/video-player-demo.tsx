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
      <VideoViewport src="/sample_scenery.mp4" />

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
