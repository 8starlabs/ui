import Marquee from "../blocks/marquee";
import {
  JohnsonAndJohnsonIcon,
  ShopifyIcon,
  SingaporeAirlinesIcon,
  TheWeatherCompanyIcon,
  VercelLightIcon,
  WixBlackIcon
} from "@/components/icons";

export default function MarqueeGrayscaleDemo() {
  return (
    <Marquee grayscale={true}>
      <div className="w-30 h-14">
        <VercelLightIcon
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      </div>
      <div className="w-30 h-14">
        <ShopifyIcon
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
      <div className="w-30 h-5">
        <WixBlackIcon
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      </div>
      <div className="w-30 h-14">
        <JohnsonAndJohnsonIcon
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
    </Marquee>
  );
}
