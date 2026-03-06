"use client";

import { useState } from "react";
import { Hash, Palette, Scissors, MousePointerClick } from "lucide-react";
import JsonViewer from "../blocks/json-viewer";
import { cn } from "@/lib/utils";

const JsonViewerFeaturesDemo = () => {
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showColorIndent, setShowColorIndent] = useState(false);
  const [collapseOnDoubleClick, setCollapseOnDoubleClick] = useState(false);
  const [enableTruncation, setEnableTruncation] = useState(true);
  const [truncationLimit, setTruncationLimit] = useState(3);
  const [defaultExpanded, setDefaultExpanded] = useState<boolean | number>(
    false
  );

  const jsonData = {
    id: "0001",
    type: "donut",
    name: "Cake",
    ppu: 0.55,
    website: "https://example.com/donuts/cake",
    primaryColor: "#FF5733",
    secondaryColor: "rgb(255, 255, 255)",
    createdAt: 1709251200000,
    updatedAt: new Date().toISOString(),
    futureEvent: new Date(Date.now() + 86400000 * 2).toISOString(),
    recentEvent: Math.floor(Date.now() / 1000) - 300,
    isActive: true,
    isGlutenFree: false,
    discontinued: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lobortis tellus eu justo hendrerit, a viverra turpis aliquam. Morbi sollicitudin accumsan lectus, eget sollicitudin magna tempus et. Cras fringilla risus sed libero consequat faucibus. Nulla facilisi. Quisque pretium, lorem id dignissim iaculis, est sem aliquet risus, sed suscipit elit sem sit amet dui. Vivamus tempor orci nec imperdiet molestie. Integer elit ex, elementum sed libero vitae, varius porta nisi. Pellentesque eget nibh justo. Morbi nec cursus metus, et faucibus nunc. Quisque vehicula sollicitudin ipsum, laoreet aliquam libero lobortis nec. Nulla facilisi.",
    batters: {
      batter: [
        { id: "1001", type: "Regular" },
        { id: "1002", type: "Chocolate" },
        { id: "1003", type: "Blueberry" },
        { id: "1004", type: "Devil's Food" }
      ]
    },
    topping: [
      { id: "5001", type: "None" },
      { id: "5002", type: "Glazed" },
      { id: "5005", type: "Sugar" },
      { id: "5007", type: "Powdered Sugar" },
      { id: "5006", type: "Chocolate with Sprinkles" },
      { id: "5003", type: "Chocolate" },
      { id: "5004", type: "Maple" }
    ]
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Feature Dashboard */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border transition-colors cursor-pointer",
              showLineNumbers
                ? "bg-secondary border-primary/50 text-primary font-medium shadow-[0_0_8px_-2px_rgba(var(--primary),0.5)]"
                : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Line Numbers</span>
          </button>
          <button
            onClick={() => setShowColorIndent(!showColorIndent)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border transition-colors cursor-pointer",
              showColorIndent
                ? "bg-secondary border-primary/50 text-primary font-medium shadow-[0_0_8px_-2px_rgba(var(--primary),0.5)]"
                : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Color Indent</span>
          </button>
          <button
            onClick={() => setCollapseOnDoubleClick(!collapseOnDoubleClick)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border transition-colors cursor-pointer",
              collapseOnDoubleClick
                ? "bg-secondary border-primary/50 text-primary font-medium shadow-[0_0_8px_-2px_rgba(var(--primary),0.5)]"
                : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>Double Click</span>
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mr-2">
            <span>Initial Expansion:</span>
            <select
              value={
                defaultExpanded === true
                  ? "true"
                  : defaultExpanded === false
                    ? "false"
                    : String(defaultExpanded)
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === "true") setDefaultExpanded(true);
                else if (value === "false") setDefaultExpanded(false);
                else setDefaultExpanded(Number(value));
              }}
              className="h-7 px-2 rounded border border-input bg-background text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="false">Collapsed (Default)</option>
              <option value="true">Expand All</option>
              <option value="1">Depth 1</option>
              <option value="2">Depth 2</option>
              <option value="3">Depth 3</option>
            </select>
          </div>
          <button
            onClick={() => setEnableTruncation(!enableTruncation)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border transition-colors cursor-pointer",
              enableTruncation
                ? "bg-secondary border-primary/50 text-primary font-medium shadow-[0_0_8px_-2px_rgba(var(--primary),0.5)]"
                : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Smart Truncation</span>
          </button>
          {enableTruncation && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-in fade-in slide-in-from-left-2">
              <span>Limit:</span>
              <input
                type="number"
                min="1"
                value={truncationLimit}
                onChange={(e) => setTruncationLimit(Number(e.target.value))}
                className="w-12 h-7 px-1.5 rounded border border-input bg-background text-xs"
              />
            </div>
          )}
        </div>
      </div>
      <JsonViewer
        key={String(defaultExpanded)}
        data={jsonData}
        showLineNumbers={showLineNumbers}
        showColorIndent={showColorIndent}
        collapseOn={collapseOnDoubleClick ? "doubleClick" : "click"}
        truncation={{
          enabled: enableTruncation,
          itemsPerArray: truncationLimit
        }}
        defaultExpanded={defaultExpanded}
        className="h-[500px]"
        title="Feature Showcase"
      />
    </div>
  );
};

export default JsonViewerFeaturesDemo;
