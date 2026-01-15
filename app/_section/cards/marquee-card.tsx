import Link from "next/link";
import Marquee from "@/registry/8starlabs-ui/blocks/marquee";
import { Card } from "@/registry/8starlabs-ui/ui/card";

const MarqueeCard = () => {
  return (
    <Link prefetch={false} href="/docs/components/marquee">
      <Card className="size-full px-6 relative overflow-hidden hover:bg-muted/20 transition-colors">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg">Marquee</h3>
            <p className="text-sm text-muted-foreground">
              Scrolling marquee component with grayscale and direction options.
            </p>
          </div>

          <div className="flex flex-col gap-4 overflow-hidden">
            <Marquee greyscale={true}>
              <img src="/svgs/oikova_logo_light.svg" alt="" />
            </Marquee>

            <Marquee direction="right">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Going
              </div>
              <div className="bg-purple-500 text-white px-4 py-2 rounded-lg">
                To
              </div>
              <div className="bg-pink-500 text-white px-4 py-2 rounded-lg">
                The
              </div>
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
                Right
              </div>
            </Marquee>
            <Marquee></Marquee>
          </div>
        </div>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg
            className="w-4 h-4"
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
    </Link>
  );
};

export default MarqueeCard;
