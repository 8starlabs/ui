"use client";

import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/config";
import CommandMenu from "@/components/command-menu";
import { GitHubLink } from "@/components/github-link";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeSwitcher } from "@/components/mode-switcher";
import { Button } from "@/registry/8starlabs-ui/blocks/button";
import { Separator } from "@/registry/8starlabs-ui/ui/separator";
import { source } from "@/lib/source";

const HEADER_LOGO_SRC = "/images/8sl_logo_disco_transparent.png";

export function SiteHeader({ tree }: { tree: typeof source.pageTree }) {
  return (
    <header className="sticky left-0 top-0 z-50 h-20 w-full justify-center bg-[#ffffffb8] dark:bg-[#000000b8] backdrop-blur-[20px] backdrop-saturate-180">
      <div className="m-auto flex h-full w-full max-w-10xl justify-between px-6 md:px-16 items-center">
        <MobileNav
          tree={tree}
          items={siteConfig.navLinks}
          className="flex lg:hidden"
        />
        <Button
          variant="ghost"
          size="icon"
          className="hidden size-12 lg:flex"
          nativeButton={false}
          render={<Link prefetch={false} href="/" />}
        >
          <Image
            src={HEADER_LOGO_SRC}
            alt=""
            width={48}
            height={48}
            className="object-contain"
            style={{ width: 48, height: 48 }}
          />
          <span className="sr-only">{siteConfig.name}</span>
        </Button>
        <MainNav items={siteConfig.navLinks} className="hidden lg:flex ml-4" />
        <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
          <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none items-center gap-2">
            <div className="flex items-center h-full">
              <CommandMenu tree={tree} />
            </div>
          </div>
          <Separator
            orientation="vertical"
            className="ml-2 hidden lg:block h-4!"
          />

          <GitHubLink />
          <ModeSwitcher />
        </div>
      </div>
    </header>
  );
}
