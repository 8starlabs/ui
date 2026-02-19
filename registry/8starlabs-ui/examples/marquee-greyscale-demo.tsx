import Marquee from "../blocks/marquee";
import { Icons } from "@/components/icons";

export default function MarqueeGreyscaleDemo() {
  return (
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
  );
}
