"use client";
import { Badge } from "@/registry/8starlabs-ui/ui/badge";
import { Icons } from "@/components/icons";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/registry/8starlabs-ui/ui/button";
import Link from "next/link";

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
      <Icons.eslUiLogoDarkPrimary className="w-auto h-8 md:h-16" />
    ) : (
      <Icons.eslUiLogoLightPrimary className="w-auto h-8 md:h-16" />
    )
  ) : (
    <Icons.eslUiLogoLightPrimary className="w-auto h-8 md:h-16" />
  );

  return (
    <div className={cn("flex flex-col w-full items-center gap-2", className)}>
      {/* <Badge variant="secondary" className="bg-transparent">
        <span
          className="flex size-2 rounded-full bg-blue-500"
          title="Coming soon"
        />
        Coming soon!
      </Badge> */}
      {logo}
      <p className="text-md max-w-3xl text-center">
        A set of beautifully designed components designed for developers who
        want niche, high-utility UI elements that you won&apos;t find in
        standard libraries.
      </p>
      <div className="flex gap-2">
        <Button asChild size="sm">
          <Link href="/docs">Get Started</Link>
        </Button>
        <Button asChild size="sm" variant="ghost">
          <Link href="/docs/components">View Components</Link>
        </Button>
      </div>
    </div>
  );
};

export default Hero;
