import VideoRoot, {
  VideoViewport,
  VideoControls,
  VideoPlayTrigger,
  VideoProgressBar
} from "@/registry/8starlabs-ui/blocks/video-player";

export default function VideoPlayerMinimalControlsDemo() {
  return (
    <VideoRoot className="rounded-lg">
      <VideoViewport src="/sample_scenery.mp4" />
      <VideoControls className="flex items-center justify-between gap-4">
        <VideoPlayTrigger />
        <VideoProgressBar />
      </VideoControls>
    </VideoRoot>
  );
}
