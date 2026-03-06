"use client";

import React, { useMemo, useState } from "react";
import type { JSX } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

interface JsonViewerProps {
  data: any;
  className?: string;
  truncation?: Partial<TruncationSettings>;
  showLineNumbers?: boolean;
  showColorIndent?: boolean;
  collapseOn?: "click" | "doubleClick";
  defaultExpanded?: boolean | number;
  title?: string;
}

interface TruncationSettings {
  enabled: boolean;
  itemsPerArray: number;
}

type DataType =
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "object"
  | "array"
  | "unknown";

const getDataType = (value: any): DataType => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  const type = typeof value;
  if (
    type === "string" ||
    type === "number" ||
    type === "boolean" ||
    type === "object"
  ) {
    return type;
  }
  return "unknown";
};

const getTypeStyle = (type: DataType): string => {
  switch (type) {
    case "string":
      return "text-green-600 dark:text-green-400";
    case "number":
      return "text-orange-600 dark:text-orange-400";
    case "boolean":
      return "text-blue-600 dark:text-blue-400";
    case "null":
      return "text-gray-500 dark:text-gray-400";
    default:
      return "";
  }
};

const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (Math.abs(diffInSeconds) < 60) return "just now";

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(Math.abs(diffInSeconds) / seconds);
    if (interval >= 1) {
      const suffix = diffInSeconds > 0 ? "ago" : "from now";
      return `${interval} ${unit}${interval !== 1 ? "s" : ""} ${suffix}`;
    }
  }

  return "just now";
};

const detectDate = (value: any): Date | null => {
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  } else if (typeof value === "number") {
    if (value >= 946684800 && value <= 4102444800) {
      return new Date(value * 1000);
    }
    if (value >= 946684800000 && value <= 4102444800000) {
      return new Date(value);
    }
  }
  return null;
};

const SmartValue = React.forwardRef<
  any,
  { value: any; type: DataType } & React.HTMLAttributes<HTMLElement>
>(({ value, type, ...props }, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (type === "string") {
    if (
      /^#([0-9A-F]{3}){1,2}$/i.test(value) ||
      /^rgba?\(/.test(value) ||
      /^hsla?\(/.test(value)
    ) {
      return (
        <span
          ref={ref}
          {...props}
          className={cn(
            "inline-flex items-center gap-1.5 whitespace-nowrap",
            props.className
          )}
        >
          <span
            className="w-3 h-3 rounded-[2px] border border-white/20 shrink-0"
            style={{ backgroundColor: value }}
          />
          <span className="text-green-600 dark:text-green-400">{`'${value}'`}</span>
        </span>
      );
    }

    if (/^https?:\/\//.test(value)) {
      const isLongUrl = String(value).length > 50;
      const isVeryLongUrl = String(value).length > 180;

      if (isVeryLongUrl) {
        return (
          <span className="inline-flex flex-col items-start gap-1">
            <a
              ref={ref}
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              {...(props as any)}
              className={cn(
                "text-green-600 dark:text-green-400 hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-pre-wrap break-all",
                !isExpanded && "line-clamp-3",
                props.className
              )}
              style={
                !isExpanded
                  ? {
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }
                  : undefined
              }
              onClick={(e) => {
                e.stopPropagation();
                props.onClick?.(e);
              }}
            >
              {`'${value}'`}
            </a>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline select-none"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          </span>
        );
      }

      return (
        <a
          ref={ref}
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          {...(props as any)}
          className={cn(
            "text-green-600 dark:text-green-400 hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
            isLongUrl ? "whitespace-pre-wrap break-all" : "whitespace-nowrap",
            props.className
          )}
          onClick={(e) => {
            e.stopPropagation();
            props.onClick?.(e);
          }}
        >
          {`'${value}'`}
        </a>
      );
    }
  }

  const typeStyle = getTypeStyle(type);
  if (type === "string") {
    const isLongString = String(value).length > 50;
    const isVeryLongString = String(value).length > 180;

    if (isVeryLongString) {
      return (
        <span className="inline-flex flex-col items-start gap-1">
          <span
            ref={ref}
            {...props}
            className={cn(
              typeStyle,
              "whitespace-pre-wrap wrap-break-words",
              !isExpanded && "line-clamp-3",
              props.className
            )}
            style={
              !isExpanded
                ? {
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }
                : undefined
            }
          >
            {`'${value}'`}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-xs text-muted-foreground hover:text-foreground underline select-none"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        </span>
      );
    }

    return (
      <span
        ref={ref}
        {...props}
        className={cn(
          typeStyle,
          isLongString
            ? "whitespace-pre-wrap wrap-break-words"
            : "whitespace-nowrap",
          props.className
        )}
      >
        {`'${value}'`}
      </span>
    );
  }
  if (type === "null")
    return (
      <span
        ref={ref}
        {...props}
        className={cn(typeStyle, "whitespace-nowrap", props.className)}
      >
        null
      </span>
    );
  return (
    <span
      ref={ref}
      {...props}
      className={cn(typeStyle, "whitespace-nowrap", props.className)}
    >
      {String(value)}
    </span>
  );
});
SmartValue.displayName = "SmartValue";

const calculateLineCount = (
  data: any,
  expandedPaths: Set<string>,
  path = "root",
  level = 0,
  truncation: TruncationSettings
): number => {
  const dataType = getDataType(data);

  if (dataType === "object") {
    const isOpen = expandedPaths.has(path);
    if (!isOpen) return 1;
    const entries = Object.entries(data);
    if (entries.length === 0) return 2;
    return (
      2 +
      entries.reduce(
        (acc, [key, value]) =>
          acc +
          calculateLineCount(
            value,
            expandedPaths,
            `${path}.${key}`,
            level + 1,
            truncation
          ),
        0
      )
    );
  }

  if (dataType === "array") {
    const isOpen = expandedPaths.has(path);
    if (!isOpen) return 1;
    if (data.length === 0) return 2;

    if (truncation.enabled && data.length > truncation.itemsPerArray) {
      const visibleItems = data.slice(0, truncation.itemsPerArray);
      return (
        3 +
        visibleItems.reduce(
          (acc: number, item: any, index: number) =>
            acc +
            calculateLineCount(
              item,
              expandedPaths,
              `${path}[${index}]`,
              level + 1,
              truncation
            ),
          0
        )
      );
    }

    return (
      2 +
      data.reduce(
        (acc: number, item: any, index: number) =>
          acc +
          calculateLineCount(
            item,
            expandedPaths,
            `${path}[${index}]`,
            level + 1,
            truncation
          ),
        0
      )
    );
  }

  return 1;
};

const generateAllPaths = (
  data: any,
  maxLevel: number = Infinity,
  currentLevel: number = 0,
  currentPath: string = "root"
): Set<string> => {
  const paths = new Set<string>();
  if (currentLevel > maxLevel) return paths;

  if (typeof data === "object" && data !== null) {
    paths.add(currentPath);
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const childPaths = generateAllPaths(
          item,
          maxLevel,
          currentLevel + 1,
          `${currentPath}[${index}]`
        );
        childPaths.forEach((path) => paths.add(path));
      });
    } else {
      Object.entries(data).forEach(([key, value]) => {
        const childPaths = generateAllPaths(
          value,
          maxLevel,
          currentLevel + 1,
          `${currentPath}.${key}`
        );
        childPaths.forEach((path) => paths.add(path));
      });
    }
  }
  return paths;
};

const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  className,
  truncation: truncationProp,
  showLineNumbers = true,
  showColorIndent = false,
  collapseOn = "click",
  defaultExpanded = false,
  title
}) => {
  const isMobile = useIsMobile();

  const [expandedPaths, setExpandedPaths] = React.useState<Set<string>>(() => {
    if (typeof defaultExpanded === "number") {
      return generateAllPaths(data, defaultExpanded);
    }
    if (defaultExpanded === true) {
      return generateAllPaths(data);
    }
    const initialPaths = new Set<string>();
    if (typeof data === "object" && data !== null) {
      initialPaths.add("root");
    }
    return initialPaths;
  });

  const expandAll = () => {
    setExpandedPaths(generateAllPaths(data));
  };

  const collapseAll = () => {
    setExpandedPaths(new Set(["root"]));
  };

  const truncation: TruncationSettings = React.useMemo(
    () => ({
      enabled: isMobile ? false : (truncationProp?.enabled ?? true),
      itemsPerArray: truncationProp?.itemsPerArray ?? 5
    }),
    [truncationProp, isMobile]
  );

  const toggleNode = (path: string) => {
    setExpandedPaths((prev) => {
      const newPaths = new Set(prev);
      if (newPaths.has(path)) {
        newPaths.delete(path);
      } else {
        newPaths.add(path);
      }
      return newPaths;
    });
  };

  const lineCount = useMemo(
    () => calculateLineCount(data, expandedPaths, "root", 0, truncation),
    [data, expandedPaths, truncation]
  );

  return (
    <div
      className={cn(
        "relative font-mono text-[13px] leading-6 w-full text-foreground bg-secondary/10 dark:bg-muted/50 rounded-md border border-border flex flex-col",
        className
      )}
    >
      <div className="flex justify-between items-center p-2 z-10 gap-2">
        <div className="text-xs font-medium text-muted-foreground px-2">
          {title}
        </div>
        <div className="flex items-center rounded-md border bg-muted/50 overflow-hidden">
          <button
            onClick={expandAll}
            className="h-7 px-2 flex items-center justify-center text-xs font-medium hover:bg-muted transition-colors"
            title="Expand All"
          >
            Expand All
          </button>
          <div className="w-px h-4 bg-border" />
          <button
            onClick={collapseAll}
            className="h-7 px-2 flex items-center justify-center text-xs font-medium hover:bg-muted transition-colors"
            title="Collapse All"
          >
            Collapse All
          </button>
          <div className="w-px h-4 bg-border" />
          <CopyButton
            value={JSON.stringify(data, null, 2)}
            className="static size-7 bg-transparent hover:bg-muted hover:opacity-100 focus-visible:opacity-100 text-foreground rounded-none"
          />
        </div>
      </div>
      <div className="w-full overflow-auto flex-1 p-4 pt-0">
        <pre className="flex">
          {showLineNumbers && (
            <div className="hidden sm:block">
              <LineNumbers lineCount={lineCount} />
            </div>
          )}
          <code>
            <JsonNode
              data={data}
              path="root"
              expandedPaths={expandedPaths}
              toggleNode={toggleNode}
              truncation={truncation}
              showColorIndent={showColorIndent}
              collapseOn={collapseOn}
            />
          </code>
        </pre>
      </div>
    </div>
  );
};

const LineNumbers: React.FC<{ lineCount: number }> = ({ lineCount }) => {
  return (
    <div className="flex flex-col text-right pr-4 text-muted-foreground select-none border-r border-border mr-4">
      {Array.from({ length: lineCount }, (_, i) => (
        <div key={i} className="h-6 leading-6 text-xs tabular-nums opacity-50">
          {i + 1}
        </div>
      ))}
    </div>
  );
};

interface JsonNodeProps {
  data: any;
  level?: number;
  path: string;
  expandedPaths: Set<string>;
  toggleNode: (path: string) => void;
  showComma?: boolean;
  objectKey?: string;
  truncation: TruncationSettings;
  showColorIndent?: boolean;
  collapseOn?: "click" | "doubleClick";
}

const JsonNode: React.FC<JsonNodeProps> = ({
  data,
  level = 0,
  path,
  expandedPaths,
  toggleNode,
  showComma,
  objectKey,
  truncation,
  showColorIndent,
  collapseOn
}) => {
  const dataType = getDataType(data);

  const renderValue = () => {
    let element: JSX.Element | null = null;
    switch (dataType) {
      case "array":
        element = (
          <JsonArray
            data={data}
            level={level}
            path={path}
            expandedPaths={expandedPaths}
            toggleNode={toggleNode}
            showComma={showComma}
            objectKey={objectKey}
            truncation={truncation}
            showColorIndent={showColorIndent}
            collapseOn={collapseOn}
          />
        );
        break;
      case "object":
        element = (
          <JsonObject
            data={data}
            level={level}
            path={path}
            expandedPaths={expandedPaths}
            toggleNode={toggleNode}
            showComma={showComma}
            objectKey={objectKey}
            truncation={truncation}
            showColorIndent={showColorIndent}
            collapseOn={collapseOn}
          />
        );
        break;
      default:
        element = <SmartValue value={data} type={dataType} />;
        break;
    }

    if (dataType === "object" || dataType === "array") {
      return element;
    }

    const date = detectDate(data);
    if (date) {
      const timeStr = formatRelativeTime(date);
      return (
        <span className="inline-flex items-center gap-2">
          {element}
          <span className="text-xs text-muted-foreground/60 select-none italic">
            {`// ${timeStr}`}
          </span>
        </span>
      );
    }

    return element;
  };

  return (
    <>
      {renderValue()}
      {dataType !== "object" && dataType !== "array" && showComma && (
        <span className="text-muted-foreground">,</span>
      )}
    </>
  );
};

const indentColors = [
  "border-red-300/60 dark:border-red-700/60",
  "border-yellow-300/60 dark:border-yellow-700/60",
  "border-green-300/60 dark:border-green-700/60",
  "border-blue-300/60 dark:border-blue-700/60",
  "border-purple-300/60 dark:border-purple-700/60"
];

const JsonObject: React.FC<{
  objectKey?: string;
  data: Record<string, any>;
  level: number;
  path: string;
  expandedPaths: Set<string>;
  toggleNode: (path: string) => void;
  showComma?: boolean;
  truncation: TruncationSettings;
  showColorIndent?: boolean;
  collapseOn?: "click" | "doubleClick";
}> = ({
  data,
  level,
  path,
  expandedPaths,
  toggleNode,
  showComma,
  objectKey,
  truncation,
  showColorIndent,
  collapseOn
}) => {
  const entries = Object.entries(data);
  const isOpen = expandedPaths.has(path);

  const trigger = (
    <Collapsible.Trigger
      className={cn(
        "inline-flex items-center text-left h-6 leading-6 group rounded-sm px-1 -ml-1 w-full",
        isOpen && "hover:bg-muted-foreground/20"
      )}
      onDoubleClick={
        collapseOn === "doubleClick" ? () => toggleNode(path) : undefined
      }
      onClick={
        collapseOn === "doubleClick" ? (e) => e.preventDefault() : undefined
      }
    >
      {objectKey && (
        <span className="text-purple-600 dark:text-purple-400 inline-flex items-center group font-medium">
          {`'${objectKey}'`}
          <span className="text-muted-foreground mx-1">: </span>
        </span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleNode(path);
        }}
        className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform shrink-0",
            isOpen && "rotate-90"
          )}
        />
      </button>
      <span className="text-muted-foreground">{"{"}</span>
      {!isOpen && (
        <>
          <span className="text-muted-foreground">...</span>
          <span className="text-muted-foreground">
            {"}"} ({entries.length} {entries.length > 1 ? "items" : "item"})
          </span>
          {showComma && <span className="text-muted-foreground">,</span>}
        </>
      )}
    </Collapsible.Trigger>
  );

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={() => toggleNode(path)}
      asChild
    >
      <div>
        {trigger}
        <Collapsible.Content className="transition-all duration-200">
          <div
            className={cn(
              "pl-5 border-l",
              showColorIndent
                ? indentColors[level % indentColors.length]
                : "border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]"
            )}
          >
            {entries.map(([key, value], index) => {
              const childPath = `${path}.${key}`;
              const dataType = getDataType(value);
              const isChildCollapsible =
                dataType === "object" || dataType === "array";
              const isChildOpen =
                isChildCollapsible && expandedPaths.has(childPath);

              return (
                <div
                  key={key}
                  className={cn(
                    "group rounded-md",
                    !isChildCollapsible && "flex items-start min-h-6",
                    isChildOpen ? "" : "hover:bg-muted-foreground/20"
                  )}
                >
                  {isChildCollapsible ? (
                    <JsonNode
                      data={value}
                      level={level + 1}
                      path={childPath}
                      expandedPaths={expandedPaths}
                      toggleNode={toggleNode}
                      showComma={index < entries.length - 1}
                      objectKey={key}
                      truncation={truncation}
                      showColorIndent={showColorIndent}
                      collapseOn={collapseOn}
                    />
                  ) : (
                    <>
                      <span className="text-purple-600 dark:text-purple-400 inline-flex items-center">
                        {`'${key}'`}
                      </span>
                      <span className="text-muted-foreground">: </span>
                      <JsonNode
                        data={value}
                        level={level + 1}
                        path={childPath}
                        expandedPaths={expandedPaths}
                        toggleNode={toggleNode}
                        showComma={index < entries.length - 1}
                        truncation={truncation}
                        showColorIndent={showColorIndent}
                        collapseOn={collapseOn}
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div>
            <span className="text-muted-foreground">{"}"}</span>
            {showComma && <span className="text-muted-foreground">,</span>}
          </div>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
};

const JsonArray: React.FC<{
  objectKey?: string;
  data: any[];
  level: number;
  path: string;
  expandedPaths: Set<string>;
  toggleNode: (path: string) => void;
  showComma?: boolean;
  truncation: TruncationSettings;
  showColorIndent?: boolean;
  collapseOn?: "click" | "doubleClick";
}> = ({
  data,
  level,
  path,
  expandedPaths,
  toggleNode,
  showComma,
  objectKey,
  truncation,
  showColorIndent,
  collapseOn
}) => {
  const isOpen = expandedPaths.has(path);
  const [showAll, setShowAll] = useState(false);

  const itemsToShow =
    truncation.enabled && !showAll && data.length > truncation.itemsPerArray
      ? data.slice(0, truncation.itemsPerArray)
      : data;

  const handleShowMore = () => {
    setShowAll(true);
  };

  const trigger = (
    <Collapsible.Trigger
      className={cn(
        "inline-flex items-center text-left h-6 leading-6 group rounded-sm px-1 -ml-1 w-full",
        isOpen && "hover:bg-muted-foreground/20"
      )}
      onDoubleClick={
        collapseOn === "doubleClick" ? () => toggleNode(path) : undefined
      }
      onClick={
        collapseOn === "doubleClick" ? (e) => e.preventDefault() : undefined
      }
    >
      {objectKey && (
        <span className="text-purple-600 dark:text-purple-400 inline-flex items-center group">
          {`'${objectKey}'`}
          <span className="text-muted-foreground mx-1">: </span>
        </span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleNode(path);
        }}
        className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform shrink-0",
            isOpen && "rotate-90"
          )}
        />
      </button>
      <span className="text-muted-foreground">{"["}</span>
      {!isOpen && (
        <>
          <span className="text-muted-foreground">...</span>
          <span className="text-muted-foreground">
            {"]"} ({data.length} items)
          </span>
          {showComma && <span className="text-muted-foreground">,</span>}
        </>
      )}
    </Collapsible.Trigger>
  );

  return (
    <Collapsible.Root open={isOpen} onOpenChange={() => toggleNode(path)}>
      {trigger}
      <Collapsible.Content className="transition-all duration-200">
        <div
          className={cn(
            "pl-5 border-l",
            showColorIndent
              ? indentColors[level % indentColors.length]
              : "border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]"
          )}
        >
          {itemsToShow.map((item, index) => {
            const childPath = `${path}[${index}]`;
            const dataType = getDataType(item);
            const isChildCollapsible =
              dataType === "object" || dataType === "array";
            const isChildOpen =
              isChildCollapsible && expandedPaths.has(childPath);

            return (
              <div
                key={index}
                className={cn(
                  "group rounded-md",
                  !isChildCollapsible &&
                    "flex sm:items-center items-start sm:h-6 h-auto",
                  isChildOpen ? "" : "hover:bg-muted-foreground/20"
                )}
              >
                <JsonNode
                  data={item}
                  level={level + 1}
                  path={childPath}
                  expandedPaths={expandedPaths}
                  toggleNode={toggleNode}
                  showComma={index < data.length - 1}
                  truncation={truncation}
                  showColorIndent={showColorIndent}
                  collapseOn={collapseOn}
                />
              </div>
            );
          })}
          {truncation.enabled && data.length > truncation.itemsPerArray && (
            <div className="pl-5">
              {!showAll ? (
                <button
                  onClick={handleShowMore}
                  className="text-muted-foreground hover:text-foreground text-xs bg-secondary/30 hover:bg-secondary/50 px-2 py-0.5 rounded transition-colors mt-1"
                >
                  Show {data.length - truncation.itemsPerArray} more items...
                </button>
              ) : (
                <button
                  onClick={() => setShowAll(false)}
                  className="text-muted-foreground hover:text-foreground text-xs bg-secondary/30 hover:bg-secondary/50 px-2 py-0.5 rounded transition-colors mt-1"
                >
                  Show Less
                </button>
              )}
            </div>
          )}
        </div>
        <div>
          <span className="text-muted-foreground">]</span>
          {showComma && <span className="text-muted-foreground">,</span>}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default JsonViewer;
