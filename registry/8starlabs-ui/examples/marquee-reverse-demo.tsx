import Marquee from "../blocks/marquee";

export default function MarqueeReverseDemo() {
  return (
    <Marquee direction="right" pauseOnHover={false}>
      <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">Item 1</div>
      <div className="bg-purple-500 text-white px-4 py-2 rounded-lg">
        Item 2
      </div>
      <div className="bg-pink-500 text-white px-4 py-2 rounded-lg">Item 3</div>
    </Marquee>
  );
}
