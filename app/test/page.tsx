import {
  VideoRoot,
  VideoViewport,
  VideoControls,
  VideoPlayTrigger,
  VideoFullscreenTrigger,
  VideoProgressBar
} from "./video-player";

export default function TestPage() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <VideoRoot className="rounded-xl shadow-lg aspect-video">
        <VideoViewport src="/sample2.mp4" />

        <VideoControls className="flex gap-2 items-center justify-between">
          <VideoPlayTrigger />
          <VideoProgressBar />
        </VideoControls>
      </VideoRoot>
    </div>
  );
}
