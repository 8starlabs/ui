import PartitionBar, {
  PartitionBarSegment,
  PartitionBarSegmentTitle,
  PartitionBarSegmentValue
} from "@/registry/8starlabs-ui/blocks/partition-bar";
import HomepageDemoCard from "./homepage-demo-card";

const PartitionBarCard = () => {
  return (
    <HomepageDemoCard
      href="/docs/components/partition-bar"
      title="Partition Bar"
      description={
        <p className="text-sm text-muted-foreground">
          A visual representation of a partitioned bar, useful for displaying
          progress or distribution across multiple segments.
        </p>
      }
      demo={
        <div className="scroll-fade-x my-3 w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <PartitionBar size="md" className="mx-auto w-[700px]">
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
        </div>
      }
    />
  );
};

export default PartitionBarCard;
