"use client";
import { Badge } from "@/registry/8starlabs-ui/ui/badge";
import {
  EslUiLogoDarkPrimaryIcon,
  EslUiLogoLightPrimaryIcon
} from "@/components/icons";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/registry/8starlabs-ui/blocks/button";
import Link from "next/link";
import Snowfall from "react-snowfall";

interface HeroProps {
  className?: string;
}

const Hero = ({ className }: HeroProps) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const effectiveTheme =
    theme === "system" ? (resolvedTheme ?? "light") : (theme ?? "light");

  const logo = mounted ? (
    effectiveTheme === "dark" ? (
      <EslUiLogoDarkPrimaryIcon className="w-auto h-8 md:h-16" />
    ) : (
      <EslUiLogoLightPrimaryIcon className="w-auto h-8 md:h-16" />
    )
  ) : (
    <EslUiLogoLightPrimaryIcon className="w-auto h-8 md:h-16" />
  );

  return (
    <div
      className={cn(
        "t-stagger flex flex-col w-full items-center gap-2",
        className
      )}
    >
      {/* <Snowfall snowflakeCount={67} /> */}
      <Badge
        variant="secondary"
        className="bg-transparent t-stagger-line t-stagger-line--1"
      >
        <span
          className="flex size-2 rounded-full bg-blue-500"
          title="Coming soon"
        />
        Happy 2026! 🤩
      </Badge>
      {/* <Badge variant="secondary" className="bg-transparent" asChild>
        <Link prefetch={false} href="/docs/components/timeline">
          <span
            className="flex size-2 rounded-full bg-blue-500"
            title="Coming soon"
          />
          New: Timeline component launched!
        </Link>
      </Badge> */}
      <div className="t-stagger-line t-stagger-line--2">{logo}</div>
      <p className="text-md max-w-3xl text-center t-stagger-line t-stagger-line--3">
        A set of beautifully designed components designed for developers who
        want niche, high-utility UI elements that you won&apos;t find in
        standard libraries.
      </p>
      <div className="flex gap-2 t-stagger-line t-stagger-line--4">
        <Button
          size="sm"
          withArrow
          nativeButton={false}
          render={<Link prefetch={false} href="/docs" />}
        >
          Get Started
        </Button>
        <Button
          size="sm"
          variant="ghost"
          withArrow
          nativeButton={false}
          render={<Link prefetch={false} href="/docs/components" />}
        >
          View Components
        </Button>
      </div>
    </div>
  );
};

export default Hero;
