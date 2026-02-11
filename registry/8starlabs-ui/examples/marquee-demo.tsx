import Marquee from "../blocks/marquee";
import { Icons } from "@/components/icons";

export default function MarqueeDemo() {
  return (
    <Marquee fade={false}>
      <div className="w-48 h-20">
        <Icons.oikova_light
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      </div>
      <div className="w-48 h-14">
        <Icons.the_weather_company
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      </div>
      <div className="w-48 h-20">
        <Icons.supabase
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
