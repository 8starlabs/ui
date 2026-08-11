import RelativeTime from "@/registry/8starlabs-ui/blocks/relative-time";

const now = Date.now();

export default function RelativeTimeDemo() {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <RelativeTime date={now - 3 * 60 * 1000} />
      <RelativeTime date={now + 2 * 60 * 60 * 1000} />
      <RelativeTime date={now - 2 * 24 * 60 * 60 * 1000} />
    </div>
  );
}
