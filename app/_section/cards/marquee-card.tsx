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
      <Card className="size-full px-6 relative overflow-hidden hover:bg-muted/20 transition-colors">
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
      </Card>
    </Link>
  );
};

export default MarqueeCard;
