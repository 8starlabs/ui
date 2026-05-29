"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GitHubIcon } from "@/components/icons";
import { siteConfig, api } from "@/lib/config";
import { Button } from "@/registry/8starlabs-ui/blocks/button";
import { Skeleton } from "@/registry/8starlabs-ui/ui/skeleton";

export function GitHubLink() {
  return (
    <Button asChild size="sm" variant="ghost" className="h-8 shadow-none">
      <Link
        prefetch={false}
        href={siteConfig.links.github}
        target="_blank"
        rel="noreferrer"
      >
        <GitHubIcon />
        <StarsCountClient />
      </Link>
    </Button>
  );
}

function StarsCountClient() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(api.github.direct);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        if (mounted) setCount(json.stargazers_count ?? null);
      } catch (err) {
        console.error("Stars fetch error:", err);
        if (mounted) setCount(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Skeleton className="h-4 w-8" />;
  if (count === null)
    return <span className="text-muted-foreground text-xs">—</span>;

  return (
    <span className="text-muted-foreground w-2 text-xs tabular-nums">
      {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count.toLocaleString()}
    </span>
  );
}
