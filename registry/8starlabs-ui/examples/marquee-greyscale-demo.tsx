import Marquee from "../blocks/marquee";

export default function MarqueeGreyscaleDemo() {
  return (
    <Marquee greyscale={true}>
      <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Grayscale Item 1
      </div>
      <div className="bg-purple-500 text-white px-4 py-2 rounded-lg">
        Grayscale Item 2
      </div>
      <div className="bg-pink-500 text-white px-4 py-2 rounded-lg">
        Grayscale Item 3
      </div>
    </Marquee>
  );
}
