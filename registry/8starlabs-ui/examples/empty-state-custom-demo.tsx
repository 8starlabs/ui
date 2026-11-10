"use client";

import * as React from "react";
import { Bell, CircleCheck, MessageSquare, Calendar } from "lucide-react";

import EmptyState from "@/registry/8starlabs-ui/blocks/empty-state";

export default function EmptyStateCustomDemo() {
  const [checked, setChecked] = React.useState(false);
  return (
    <div className="w-full rounded-xl border">
      <EmptyState
        icon={Bell}
        surroundingIcons={[CircleCheck, MessageSquare, Calendar]}
        title="You’re all caught up"
        description="New notifications will appear here when there’s something to see."
        primaryAction={{ label: "Refresh", onClick: () => setChecked(true) }}
      />
      <p
        role="status"
        className="text-muted-foreground min-h-10 px-6 pb-4 text-center text-xs"
      >
        {checked ? "Checked just now. No new notifications." : ""}
      </p>
    </div>
  );
}
