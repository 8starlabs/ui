import Link from "next/link";
import Marquee from "@/registry/8starlabs-ui/blocks/marquee";
import { Card } from "@/registry/8starlabs-ui/ui/card";
import { Icons } from "@/components/icons";

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

          <div className="flex flex-col gap-2 overflow-hidden">
            <Marquee grayscale={true}>
              <div className="w-30 h-14">
                <Icons.vercel_light
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>
              <div className="w-30 h-14">
                <Icons.shopify
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>
              <div className="w-30 h-14">
                <Icons.the_weather_company
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>
              <div className="w-30 h-5">
                <Icons.wix_black
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>
              <div className="w-30 h-14">
                <Icons.johnson_and_johnson
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>
              <div className="w-30 h-14">
                <Icons.singapore_airlines
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>
            </Marquee>

            <Marquee direction="right">
              <div className="w-30 h-20">
                <Icons.oikova_light
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>
              <div className="w-30 h-20">
                <Icons.supabase
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>
              <div className="w-30 h-20">
                <Icons.big_commerce
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>
              <div className="w-30 h-14">
                <Icons.singapore_airlines
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>
              <div className="w-30 h-14">
                <Icons.the_weather_company
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>
            </Marquee>
            <Marquee pauseOnHover={false}></Marquee>
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
