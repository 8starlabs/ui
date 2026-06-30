import Link from "next/link";
import VideoRoot, {
  VideoViewport,
  VideoControls,
  VideoPlayTrigger,
  VideoSoundControl,
  VideoProgressBar,
  VideoPipTrigger,
  VideoFullscreenTrigger
} from "@/registry/8starlabs-ui/blocks/video-player";
import { Card } from "@/registry/8starlabs-ui/ui/card";

const VideoPlayerCard = () => {
  return (
    <Card className="group relative size-full overflow-hidden px-6 transition-colors hover:bg-muted/20">
      <Link
        prefetch={false}
        href="/docs/components/video-player"
        className="absolute inset-0 z-10"
        aria-label="Video Player documentation"
      />

      <div className="relative z-20 flex flex-col gap-4">
        <div className="pointer-events-none flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Video Player</h3>
          <p className="text-sm text-muted-foreground">
            A customizable video player component with support for various
            controls.
          </p>
        </div>

        <VideoRoot className="relative z-20 rounded-lg" auto>
          <VideoViewport src="https://vjs.zencdn.net/v/oceans.mp4" />
          <VideoControls className="flex items-center justify-between gap-4">
            <VideoPlayTrigger />
            <VideoSoundControl />
            <VideoProgressBar />
            <VideoPipTrigger />
            <VideoFullscreenTrigger />
          </VideoControls>
        </VideoRoot>
      </div>

      <div className="pointer-events-none absolute top-4 right-4 z-20 opacity-0 transition-opacity group-hover:opacity-100">
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M7 17L17 7"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 7h10v10"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Card>
  );
};

export default VideoPlayerCard;
