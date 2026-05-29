"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/8starlabs-ui/blocks/button";

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { href: string; label: string; external?: boolean }[];
}) {
  const pathname = usePathname();

  return (
    <nav className={cn("items-center gap-0.5", className)} {...props}>
      {items.map((item) =>
        item.external ? (
          <Button key={item.href} variant="ghost" asChild size="sm">
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(pathname === item.href && "text-primary")}
            >
              {item.label}
            </a>
          </Button>
        ) : (
          <Button key={item.href} variant="ghost" asChild size="sm">
            <Link
              prefetch={false}
              href={item.href}
              className={cn(pathname === item.href && "text-primary")}
            >
              {item.label}
            </Link>
          </Button>
        )
      )}
    </nav>
  );
}
