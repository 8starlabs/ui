import JsonViewer from "@/registry/8starlabs-ui/blocks/json-viewer";
import HomepageDemoCard from "./homepage-demo-card";

const data = {
  id: "0001",
  type: "donut",
  name: "Cake",
  ppu: 0.55,
  isActive: true,
  discontinued: null,
  batters: {
    batter: [
      { id: "1001", type: "Regular" },
      { id: "1002", type: "Chocolate" },
      { id: "1003", type: "Blueberry" }
    ]
  },
  topping: [
    { id: "5001", type: "None" },
    { id: "5002", type: "Glazed" },
    { id: "5005", type: "Sugar" },
    { id: "5003", type: "Chocolate" }
  ]
};

const JsonViewerCard = () => {
  return (
    <HomepageDemoCard
      href="/docs/components/json-viewer"
      title="JSON Viewer"
      description={
        <p className="text-sm text-muted-foreground">
          Inspect JSON with collapsible nodes, syntax highlighting, and
          copy-to-clipboard.
        </p>
      }
      demo={
        <div className="pointer-events-none flex-1 overflow-hidden rounded-lg border">
          <JsonViewer
            data={data}
            className="h-full border-0 text-[12px] [&>div:first-child]:gap-1 [&>div:first-child]:p-1.5 [&>div:first-child>div:first-child]:hidden [&_button]:h-6 [&_button]:px-1.5 [&_button]:text-[10px] sm:text-[13px] sm:[&>div:first-child]:gap-2 sm:[&>div:first-child]:p-2 sm:[&>div:first-child>div:first-child]:block sm:[&_button]:h-7 sm:[&_button]:px-2 sm:[&_button]:text-xs"
            title="Response Data"
          />
        </div>
      }
    />
  );
};

export default JsonViewerCard;
