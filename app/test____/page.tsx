import VideoRoot, {
  VideoViewport,
  VideoControls,
  VideoPlayTrigger,
  VideoSoundControl,
  VideoProgressBar,
  VideoPipTrigger,
  VideoFullscreenTrigger
} from "@/registry/8starlabs-ui/blocks/video-player";

export default function page() {
  return (
    <div className="max-w-5xl">
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
    </div>
  );
}
