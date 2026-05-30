import Link from "next/link";
import Marquee from "@/registry/8starlabs-ui/blocks/marquee";
import { Card } from "@/registry/8starlabs-ui/ui/card";
import {
  BigCommerceIcon,
  OikovaLightIcon,
  SingaporeAirlinesIcon,
  SupabaseIcon,
  TheWeatherCompanyIcon
} from "@/components/icons";

const MarqueeCard = () => {
  return (
    <Link prefetch={false} href="/docs/components/marquee">
      <Card className="size-full px-6 group relative overflow-hidden hover:bg-muted/20 transition-colors">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">Marquee</h3>
          <p className="text-sm text-muted-foreground">
            Scrolling marquee component with grayscale and direction options.
          </p>
        </div>

        <div className="flex flex-col gap-2 overflow-hidden justify-center h-full">
          <Marquee direction="right">
            <div className="w-30 h-20">
              <OikovaLightIcon
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
            <div className="w-30 h-20">
              <SupabaseIcon
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
            <div className="w-30 h-20">
              <BigCommerceIcon
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
            <div className="w-30 h-14">
              <SingaporeAirlinesIcon
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
            <div className="w-30 h-14">
              <TheWeatherCompanyIcon
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
          </Marquee>
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
