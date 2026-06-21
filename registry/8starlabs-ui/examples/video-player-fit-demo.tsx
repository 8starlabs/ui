import VideoRoot, {
  VideoViewport,
  VideoControls,
  VideoPlayTrigger,
  VideoProgressBar,
  VideoFullscreenTrigger
} from "@/registry/8starlabs-ui/blocks/video-player";

export default function VideoPlayerFitDemo() {
  return (
    <div className="grid w-full gap-6 md:grid-cols-2 m-4">
      <div className="space-y-2">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          fit: cover
        </p>
        <VideoRoot className="aspect-square rounded-lg">
          <VideoViewport src="/sample_scenery.mp4" fit="cover" />
          <VideoControls className="flex items-center justify-between gap-4">
            <VideoPlayTrigger />
            <VideoProgressBar />
            <VideoFullscreenTrigger />
          </VideoControls>
        </VideoRoot>
      </div>

      <div className="space-y-2">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          fit: contain
        </p>
        <VideoRoot className="aspect-square rounded-lg">
          <VideoViewport src="/sample_scenery.mp4" fit="contain" />
          <VideoControls className="flex items-center justify-between gap-4">
            <VideoPlayTrigger />
            <VideoProgressBar />
            <VideoFullscreenTrigger />
          </VideoControls>
        </VideoRoot>
      </div>
    </div>
  );
}
