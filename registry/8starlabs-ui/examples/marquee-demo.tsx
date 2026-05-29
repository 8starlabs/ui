import Marquee from "../blocks/marquee";
import {
  OikovaLightIcon,
  SupabaseIcon,
  TheWeatherCompanyIcon
} from "@/components/icons";

export default function MarqueeDemo() {
  return (
    <Marquee>
      <div className="w-48 h-20">
        <OikovaLightIcon
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      </div>
      <div className="w-48 h-14">
        <TheWeatherCompanyIcon
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      </div>
      <div className="w-48 h-20">
        <SupabaseIcon
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      </div>
    </Marquee>
  );
}
