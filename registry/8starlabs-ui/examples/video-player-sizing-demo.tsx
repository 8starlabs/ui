import VideoRoot, {
  VideoViewport,
  VideoControls,
  VideoPlayTrigger,
  VideoProgressBar
} from "@/registry/8starlabs-ui/blocks/video-player";
import { cn } from "@/lib/utils";

function CompactPlayer({
  label,
  className,
  wrapperClassName
}: {
  label: string;
  className: string;
  wrapperClassName?: string;
}) {
  return (
    <div className={cn("space-y-2", wrapperClassName)}>
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
    <div className="grid w-full gap-6 p-4 md:grid-cols-2">
      <CompactPlayer
        label="aspect-video"
        className="aspect-video rounded-lg"
        wrapperClassName="md:col-span-2"
      />
      <CompactPlayer
        label="aspect-square"
        className="aspect-square rounded-lg"
      />
      <CompactPlayer label="fixed height" className="h-120 rounded-lg" />
    </div>
  );
}
