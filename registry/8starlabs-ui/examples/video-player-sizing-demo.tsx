import VideoRoot, {
  VideoViewport,
  VideoControls,
  VideoPlayTrigger,
  VideoProgressBar
} from "@/registry/8starlabs-ui/blocks/video-player";

function CompactPlayer({
  label,
  className
}: {
  label: string;
  className: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <VideoRoot className={className}>
        <VideoViewport src="/sample_scenery.mp4" fit="cover" />
        <VideoControls className="flex items-center justify-between gap-4">
          <VideoPlayTrigger />
          <VideoProgressBar />
        </VideoControls>
      </VideoRoot>
    </div>
  );
}

export default function VideoPlayerSizingDemo() {
  return (
    <div className="grid w-full gap-6 md:grid-cols-3 m-4">
      <CompactPlayer label="aspect-video" className="aspect-video rounded-lg" />
      <CompactPlayer
        label="aspect-square"
        className="aspect-square rounded-lg"
      />
      <CompactPlayer label="fixed height" className="h-64 rounded-lg" />
    </div>
  );
}
