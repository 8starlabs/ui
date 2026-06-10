import VideoRoot, {
  VideoViewport,
  VideoControls,
  VideoPlayTrigger,
  VideoProgressBar
} from "@/registry/8starlabs-ui/blocks/video-player";

export default function VideoPlayerMinimalControlsDemo() {
  return (
    <VideoRoot className="rounded-lg">
      <VideoViewport src="https://vjs.zencdn.net/v/oceans.mp4" />
      <VideoControls className="flex gap-4 items-center justify-between">
        <VideoPlayTrigger />
        <VideoProgressBar />
      </VideoControls>
    </VideoRoot>
  );
}
