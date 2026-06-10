import VideoRoot, {
  VideoViewport,
  VideoControls,
  VideoPlayTrigger,
  VideoFullscreenTrigger,
  VideoProgressBar,
  VideoSoundControl,
  VideoPipTrigger
} from "@/registry/8starlabs-ui/blocks/video-player";

export default function VideoPlayerHostedMp4Demo() {
  return (
    <VideoRoot className="rounded-lg">
      <VideoViewport src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" />

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
