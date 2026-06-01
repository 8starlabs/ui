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
        <VideoViewport src="/sample.mp4" />

        <VideoControls className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <VideoPlayTrigger />
            <VideoProgressBar />
            {/* <VideoFullscreenTrigger /> */}
          </div>
        </VideoControls>
      </VideoRoot>
    </div>
  );
}
