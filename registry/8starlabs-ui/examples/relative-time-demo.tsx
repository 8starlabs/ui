import RelativeTime from "@/registry/8starlabs-ui/blocks/relative-time";

const now = Date.now();

export default function RelativeTimeDemo() {
  return (
    <div className="w-full max-w-sm divide-y rounded-lg border text-sm">
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="grid gap-1">
          <p className="font-medium">Payment received</p>
          <RelativeTime date={now - 3 * 60 * 1000} />
        </div>
        <span className="font-medium">$24.00</span>
      </div>
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="grid gap-1">
          <p className="font-medium">Interview scheduled</p>
          <RelativeTime date={now + 2 * 60 * 60 * 1000} />
        </div>
        <span className="text-muted-foreground">Today</span>
      </div>
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="grid gap-1">
          <p className="font-medium">Invoice updated</p>
          <RelativeTime date={now - 2 * 24 * 60 * 60 * 1000} />
        </div>
        <span className="text-muted-foreground">INV-2048</span>
      </div>
    </div>
  );
}
