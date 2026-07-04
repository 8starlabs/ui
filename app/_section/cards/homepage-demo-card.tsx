import Link from "next/link";
import { Card } from "@/registry/8starlabs-ui/ui/card";
import { cn } from "@/lib/utils";

interface HomepageDemoCardProps {
  title: string;
  description: React.ReactNode;
  demo: React.ReactNode;
  className?: string;
  href: string;
}

export default function HomepageDemoCard({
  title,
  description,
  demo,
  className,
  href
}: HomepageDemoCardProps) {
  return (
    <Link prefetch={false} href={href} className="block h-full">
      <Card
        className={cn(
          "group relative flex size-full flex-col gap-0 overflow-hidden px-5 py-5 transition-colors hover:bg-muted/20 sm:px-6 sm:py-6",
          className
        )}
      >
        <div className="flex shrink-0 flex-col gap-2 pr-6">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description}
        </div>

        <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden">
          {demo}
        </div>

        <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M7 17L17 7"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 7h10v10"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Card>
    </Link>
  );
}
