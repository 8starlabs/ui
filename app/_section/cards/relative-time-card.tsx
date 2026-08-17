import RelativeTime from "@/registry/8starlabs-ui/blocks/relative-time";

import HomepageDemoCard from "./homepage-demo-card";

const now = Date.now();

const activities = [
  { label: "Deployment completed", date: now - 3 * 60 * 1000 },
  { label: "Team standup", date: now + 2 * 60 * 60 * 1000 },
  { label: "Invoice updated", date: now - 2 * 24 * 60 * 60 * 1000 }
];

const RelativeTimeCard = () => {
  return (
    <HomepageDemoCard
      href="/docs/components/relative-time"
      title="Relative Time"
      description={
        <p className="text-sm text-muted-foreground">
          Clear, human-friendly timestamps for activity feeds and updates.
        </p>
      }
      demo={
        <div className="grid h-full grid-cols-1 divide-y rounded-lg border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {activities.map((activity) => (
            <div
              key={activity.label}
              className="flex items-center justify-between gap-4 px-4 py-3 sm:flex-col sm:items-start sm:justify-center sm:gap-1"
            >
              <span className="text-sm font-medium">{activity.label}</span>
              <RelativeTime
                date={activity.date}
                showTooltip={false}
                className="text-sm"
              />
            </div>
          ))}
        </div>
      }
    />
  );
};

export default RelativeTimeCard;
