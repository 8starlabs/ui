import Link from "next/link";
import { Card } from "@/registry/8starlabs-ui/ui/card";
import ScrollFade from "@/registry/8starlabs-ui/blocks/scroll-fade";
import PartitionBar, {
  PartitionBarSegment,
  PartitionBarSegmentTitle,
  PartitionBarSegmentValue
} from "@/registry/8starlabs-ui/blocks/partition-bar";

const PartitionBarCard = () => {
  return (
    <Link prefetch={false} href="/docs/components/partition-bar">
      <Card className="size-full px-6 group relative overflow-hidden hover:bg-muted/20 transition-colors">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg">Partition Bar</h3>
            <p className="text-sm text-muted-foreground">
              A visual representation of a partitioned bar, useful for
              displaying progress or distribution across multiple segments.
            </p>
          </div>

          <ScrollFade axis="horizontal" className="my-3">
            <PartitionBar size="md" className="w-[700px] mx-auto">
              <PartitionBarSegment num={3} className="bg-red-600">
                <PartitionBarSegmentTitle className="text-red-600">
                  Apples
                </PartitionBarSegmentTitle>
                <PartitionBarSegmentValue>15%</PartitionBarSegmentValue>
              </PartitionBarSegment>

              <PartitionBarSegment
                num={7}
                variant="secondary"
                className="bg-orange-600"
              >
                <PartitionBarSegmentTitle className="text-orange-600">
                  Oranges
                </PartitionBarSegmentTitle>
                <PartitionBarSegmentValue>35%</PartitionBarSegmentValue>
              </PartitionBarSegment>

              <PartitionBarSegment
                num={4}
                variant="secondary"
                className="bg-yellow-400"
              >
                <PartitionBarSegmentTitle className="text-yellow-400">
                  Bananas
                </PartitionBarSegmentTitle>
                <PartitionBarSegmentValue>20%</PartitionBarSegmentValue>
              </PartitionBarSegment>

              <PartitionBarSegment
                num={6}
                variant="secondary"
                className="bg-green-600"
              >
                <PartitionBarSegmentTitle className="text-green-600">
                  Limes
                </PartitionBarSegmentTitle>
                <PartitionBarSegmentValue>30%</PartitionBarSegmentValue>
              </PartitionBarSegment>
            </PartitionBar>
          </ScrollFade>
        </div>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg
            className="w-4 h-4"
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
};

export default PartitionBarCard;
