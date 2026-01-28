import Marquee from "../blocks/marquee";

export default function MarqueeGreyscaleDemo() {
  return (
    <Marquee greyscale={true}>
      <div className="w-30 h-14">
        <img
          src="/svgs/vercel-logotype-light.svg"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      </div>
      <div className="w-30 h-14">
        <img
          src="/svgs/shopify_monotone_black.svg"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      </div>
      <div className="w-30 h-14">
        <img
          src="/svgs/the_weather_company.svg"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      </div>
      <div className="w-30 h-5">
        <img
          src="/svgs/Wix.svg"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      </div>
      <div className="w-30 h-14">
        <img
          src="/svgs/Johnson & Johnson_Logo_0.svg"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      </div>
      <div className="w-30 h-14">
        <img
          src="/svgs/singapore_airlines.svg"
          alt=""
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
