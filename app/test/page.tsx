import {
  VideoRoot,
  VideoViewport,
  VideoControls,
  VideoPlayTrigger,
  VideoFullscreenTrigger,
  VideoProgressBar,
  VideoSoundControl
} from "./video-player";

export default function TestPage() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <VideoRoot className="rounded-xl shadow-lg aspect-video">
        <VideoViewport src="/sample.mp4" />

        <VideoControls className="flex gap-4 items-center justify-between">
          <VideoPlayTrigger />
          <VideoSoundControl />
          <VideoProgressBar />
          <VideoFullscreenTrigger />
        </VideoControls>
      </VideoRoot>
    </div>
  );
}
