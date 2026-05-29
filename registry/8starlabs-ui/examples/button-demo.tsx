import { Button } from "@/registry/8starlabs-ui/blocks/button";

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button withArrow>Start building</Button>
      <Button variant="secondary" withArrow>
        View components
      </Button>
      <Button variant="outline">Default action</Button>
    </div>
  );
}
