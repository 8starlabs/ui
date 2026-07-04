"use client";

import * as React from "react";
import Image from "next/image";
import Link, { LinkProps } from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/8starlabs-ui/blocks/button";
import { source } from "@/lib/source";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/registry/8starlabs-ui/ui/popover";
import { PAGES_NEW } from "@/lib/docs";

const HEADER_LOGO_SRC = "/images/8sl_logo_disco_transparent.png";

export function MobileNav({
  tree,
  items,
  className
}: {
  tree: typeof source.pageTree;
  items: { href: string; label: string; external?: boolean }[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            className={cn(
              "extend-touch-target h-10 touch-manipulation items-center justify-start gap-2.5 p-0! hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent",
              className
            )}
          >
            <div className="relative flex h-8 w-4 items-center justify-center">
              <div className="relative size-4">
                <span
                  className={cn(
                    "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                    open ? "top-[0.4rem] -rotate-45" : "top-1"
                  )}
                />
                <span
                  className={cn(
                    "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                    open ? "top-[0.4rem] rotate-45" : "top-2.5"
                  )}
                />
              </div>
              <span className="sr-only">Toggle Menu</span>
            </div>
            <span className="flex h-10 items-center text-lg leading-none font-medium">
              <Image
                src={HEADER_LOGO_SRC}
                alt=""
                width={40}
                height={40}
                className="object-contain"
                style={{ width: 40, height: 40 }}
              />
            </span>
          </Button>
        }
      />
      <PopoverContent
        className="bg-background/90 no-scrollbar h-(--available-height) w-(--available-width) overflow-y-auto rounded-none border-none p-0 shadow-none backdrop-blur duration-100"
        align="start"
        side="bottom"
        alignOffset={-16}
        sideOffset={14}
      >
        <div className="flex flex-col gap-12 overflow-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="text-muted-foreground text-sm font-medium">
              Menu
            </div>
            <div className="flex flex-col gap-3">
              <MobileLink href="/" onOpenChange={setOpen}>
                Home
              </MobileLink>
              {items.map((item, index) =>
                item.external ? (
                  <MobileExternalLink
                    key={index}
                    href={item.href}
                    onOpenChange={setOpen}
                  >
                    {item.label}
                    {PAGES_NEW.includes(item.href) && (
                      <span
                        className="flex size-2 rounded-full bg-blue-500"
                        title="New"
                      />
                    )}
                  </MobileExternalLink>
                ) : (
                  <MobileLink
                    key={index}
                    href={item.href}
                    onOpenChange={setOpen}
                  >
                    {item.label}
                    {PAGES_NEW.includes(item.href) && (
                      <span
                        className="flex size-2 rounded-full bg-blue-500"
                        title="New"
                      />
                    )}
                  </MobileLink>
                )
              )}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {tree?.children?.map((group, index) => {
              if (group.type === "folder") {
                return (
                  <div key={index} className="flex flex-col gap-4">
                    <div className="text-muted-foreground text-sm font-medium">
                      {group.name}
                    </div>
                    <div className="flex flex-col gap-3">
                      {group.children.map((item) => {
                        if (item.type === "page") {
                          return (
                            <MobileLink
                              key={`${item.url}-${index}`}
                              href={item.url}
                              onOpenChange={setOpen}
                            >
                              {item.name}
                              {PAGES_NEW.includes(item.url) && (
                                <span
                                  className="flex size-2 rounded-full bg-blue-500"
                                  title="New"
                                />
                              )}
                            </MobileLink>
                          );
                        }
                      })}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      prefetch={false}
      href={href}
      onClick={() => onOpenChange?.(false)}
      className={cn("text-2xl font-medium flex gap-2 items-center", className)}
      {...props}
    >
      {children}
    </Link>
  );
}

function MobileExternalLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: {
  href: string;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onOpenChange?.(false)}
      className={cn("text-2xl font-medium flex gap-2 items-center", className)}
      {...props}
    >
      {children}
    </a>
  );
}
