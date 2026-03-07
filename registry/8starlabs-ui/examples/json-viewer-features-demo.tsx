"use client";

import { useState } from "react";
import {
  Hash,
  Palette,
  Scissors,
  MousePointerClick,
  ChevronDown
} from "lucide-react";
import JsonViewer from "../blocks/json-viewer";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/8starlabs-ui/ui/button";
import { Input } from "@/registry/8starlabs-ui/ui/input";
import { Label } from "@/registry/8starlabs-ui/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/registry/8starlabs-ui/ui/dropdown-menu";

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
    updatedAt: "2026-03-06T12:00:00.000Z",
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
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className={cn(
              "h-8 text-xs font-normal border transition-colors",
              showLineNumbers
                ? "bg-secondary border-primary/50 text-primary font-medium shadow-[0_0_8px_-2px_rgba(var(--primary),0.5)] hover:bg-secondary/80"
                : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <Hash className="w-3.5 h-3.5" />
            Line Numbers
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowColorIndent(!showColorIndent)}
            className={cn(
              "h-8 text-xs font-normal border transition-colors",
              showColorIndent
                ? "bg-secondary border-primary/50 text-primary font-medium shadow-[0_0_8px_-2px_rgba(var(--primary),0.5)] hover:bg-secondary/80"
                : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <Palette className="w-3.5 h-3.5" />
            Color Indent
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCollapseOnDoubleClick(!collapseOnDoubleClick)}
            className={cn(
              "h-8 text-xs font-normal border transition-colors",
              collapseOnDoubleClick
                ? "bg-secondary border-primary/50 text-primary font-medium shadow-[0_0_8px_-2px_rgba(var(--primary),0.5)] hover:bg-secondary/80"
                : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            Double Click
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 mr-2">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">
              Initial Expansion:
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-normal justify-between w-[140px]"
                >
                  {defaultExpanded === true
                    ? "Expand All"
                    : defaultExpanded === false
                      ? "Collapsed"
                      : `Depth ${defaultExpanded}`}
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[140px]">
                <DropdownMenuRadioGroup
                  value={
                    defaultExpanded === true
                      ? "true"
                      : defaultExpanded === false
                        ? "false"
                        : String(defaultExpanded)
                  }
                  onValueChange={(value) => {
                    if (value === "true") setDefaultExpanded(true);
                    else if (value === "false") setDefaultExpanded(false);
                    else setDefaultExpanded(Number(value));
                  }}
                >
                  <DropdownMenuRadioItem value="false" className="text-xs">
                    Collapsed
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="true" className="text-xs">
                    Expand All
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="1" className="text-xs">
                    Depth 1
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="2" className="text-xs">
                    Depth 2
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="3" className="text-xs">
                    Depth 3
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEnableTruncation(!enableTruncation)}
            className={cn(
              "h-8 text-xs font-normal border transition-colors",
              enableTruncation
                ? "bg-secondary border-primary/50 text-primary font-medium shadow-[0_0_8px_-2px_rgba(var(--primary),0.5)] hover:bg-secondary/80"
                : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <Scissors className="w-3.5 h-3.5" />
            Smart Truncation
          </Button>
          {enableTruncation && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">
                Limit:
              </Label>
              <Input
                type="number"
                min="1"
                value={truncationLimit}
                onChange={(e) => setTruncationLimit(Number(e.target.value))}
                className="w-16 h-8 text-xs px-2"
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
