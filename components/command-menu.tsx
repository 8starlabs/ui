"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CornerDownLeftIcon, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/registry/8starlabs-ui/ui/command";
import { useIsMac } from "@/hooks/use-is-mac";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { source } from "@/lib/source";
import { IconArrowRight } from "@tabler/icons-react";
import { useMutationObserver } from "@/hooks/use-mutation-observer";
import { useConfig } from "@/hooks/use-config";
import { copyToClipboardWithMeta } from "@/components/copy-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/registry/8starlabs-ui/ui/dialog";
import { Button } from "@/registry/8starlabs-ui/ui/button";
import { Separator } from "@/registry/8starlabs-ui/ui/separator";
import { Kbd, KbdGroup } from "@/registry/8starlabs-ui/ui/kbd";

const CommandMenu = ({ tree, ...props }: { tree: typeof source.pageTree }) => {
  const router = useRouter();
  const isMac = useIsMac();
  const [config] = useConfig();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<"page" | "component" | null>(
    null
  );
  const [copyPayload, setCopyPayload] = useState("");
  const packageManager = config.packageManager || "npm";

  const handlePageHighlight = useCallback(
    (isComponent: boolean, item: { url: string; name?: React.ReactNode }) => {
      if (isComponent) {
        const componentName = item.url.split("/").pop();
        setSelectedType("component");
        setCopyPayload(
          `${packageManager} shadcn@latest add @8starlabs-ui/${componentName}`
        );
      } else {
        setSelectedType("page");
        setCopyPayload("");
      }
    },
    [packageManager, setSelectedType, setCopyPayload]
  );

  const runCommand = useCallback((command: any) => {
    setOpen(false);
    command();
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }

      if (e.key === "c" && (e.metaKey || e.ctrlKey)) {
        runCommand(() => {
          copyToClipboardWithMeta(copyPayload, {
            name: "copy_npm_command",
            properties: { command: copyPayload, pm: packageManager }
          });
        });
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [copyPayload, runCommand, selectedType, packageManager]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className={cn(
            "bg-surface text-surface-foreground/60 dark:bg-card relative h-8 w-full justify-start pl-2.5 font-normal shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64"
          )}
          onClick={() => setOpen(true)}
          {...props}
        >
          <span className="hidden lg:inline-flex">Search documentation...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <div className="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
            <KbdGroup>
              <Kbd className="border">{isMac ? "⌘" : "Ctrl"}</Kbd>
              <Kbd className="border">K</Kbd>
            </KbdGroup>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-xl border-none bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search documentation...</DialogTitle>
          <DialogDescription>Search for a command to run...</DialogDescription>
        </DialogHeader>
        <Command
          className="**:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input-wrapper]:border-input rounded-none bg-transparent **:data-[slot=command-input]:!h-9 **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:!h-9 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border"
          filter={(value, search, keywords) => {
            const extendValue = value + " " + (keywords?.join(" ") || "");
            if (extendValue.toLowerCase().includes(search.toLowerCase())) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup
              heading="Pages"
              className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
            >
              {siteConfig.navLinks.map((navItem) => (
                <CommandMenuItem
                  key={navItem.href}
                  value={navItem.label}
                  keywords={["nav", "navigation", navItem.label.toLowerCase()]}
                  onHighlight={() => {
                    setSelectedType("page");
                    setCopyPayload("");
                  }}
                  onSelect={() => {
                    if (navItem.external) {
                      window.open(
                        navItem.href,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    } else {
                      runCommand(() => router.push(navItem.href));
                    }
                  }}
                >
                  {navItem.external ? (
                    <ExternalLink className="mr-2 h-4 w-4" />
                  ) : (
                    <IconArrowRight />
                  )}
                  {navItem.label}
                </CommandMenuItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            {tree.children.map((group) => (
              <span key={group.$id}>
                {group.$id !== "(root)" && (
                  <CommandGroup
                    key={group.$id}
                    heading={group.name}
                    className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
                  >
                    {group.type === "folder" &&
                      group.children.map((item) => {
                        if (item.type === "page") {
                          const isComponent = item.url.includes("/components/");

                          return (
                            <CommandMenuItem
                              key={item.url}
                              value={
                                item.name?.toString()
                                  ? `${group.name} ${item.name}`
                                  : ""
                              }
                              keywords={isComponent ? ["component"] : undefined}
                              onHighlight={() =>
                                handlePageHighlight(isComponent, item)
                              }
                              onSelect={() => {
                                runCommand(() => router.push(item.url));
                              }}
                            >
                              {isComponent ? (
                                <div className="border-muted-foreground aspect-square size-4 rounded-full border border-dashed" />
                              ) : (
                                <IconArrowRight />
                              )}
                              {item.name}
                            </CommandMenuItem>
                          );
                        }
                        return null;
                      })}
                  </CommandGroup>
                )}
              </span>
            ))}
          </CommandList>
        </Command>
        <div className="text-muted-foreground absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium dark:border-t-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2">
            <Kbd className="border">
              <CornerDownLeftIcon />
            </Kbd>{" "}
            {selectedType === "page" || selectedType === "component"
              ? "Go to Page"
              : null}
          </div>
          {copyPayload && (
            <>
              <Separator orientation="vertical" className="!h-4" />
              <div className="flex items-center gap-1">
                <KbdGroup>
                  <Kbd className="border">{isMac ? "⌘" : "Ctrl"}</Kbd>
                  <Kbd className="border">K</Kbd>
                </KbdGroup>
                {copyPayload}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommandMenu;

function CommandMenuItem({
  children,
  className,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onHighlight?: () => void;
  "data-selected"?: string;
  "aria-selected"?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onHighlight?.();
      }
    });
  });

  return (
    <CommandItem
      ref={ref}
      className={cn(
        "data-[selected=true]:border-input data-[selected=true]:bg-input/50 h-9 rounded-md border border-transparent !px-3 font-medium",
        className
      )}
      {...props}
    >
      {children}
    </CommandItem>
  );
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  );
}
