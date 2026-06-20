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
    <Link prefetch={false} href={href}>
      <Card
        className={cn(
          "group relative size-full overflow-hidden px-6 transition-colors hover:bg-muted/20",
          className
        )}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            {description}
          </div>

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
