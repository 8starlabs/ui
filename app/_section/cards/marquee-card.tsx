import Marquee from "@/registry/8starlabs-ui/blocks/marquee";
import {
  BigCommerceIcon,
  OikovaLightIcon,
  SingaporeAirlinesIcon,
  SupabaseIcon,
  TheWeatherCompanyIcon
} from "@/components/icons";
import HomepageDemoCard from "./homepage-demo-card";

const MarqueeCard = () => {
  return (
    <HomepageDemoCard
      href="/docs/components/marquee"
      title="Marquee"
      description={
        <p className="text-sm text-muted-foreground">
          Scrolling marquee component with grayscale and direction options.
        </p>
      }
      demo={
        <div className="flex h-full flex-col justify-center gap-2 overflow-hidden">
          <Marquee direction="right">
            <div className="h-20 w-30">
              <OikovaLightIcon
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
            <div className="h-20 w-30">
              <SupabaseIcon
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
            <div className="h-20 w-30">
              <BigCommerceIcon
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
            <div className="h-14 w-30">
              <SingaporeAirlinesIcon
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
            <div className="h-14 w-30">
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
      }
    />
  );
};

export default MarqueeCard;
