import {
  PartitionBar,
  PartitionBarSegment,
  PartitionBarSegmentTitle,
  PartitionBarSegmentValue
} from "@/registry/8starlabs-ui/blocks/partition-bar";

export default function PartitionBarWidthDemo() {
  return (
    <PartitionBar size="md" className="md:w-[70%] sm:w-[90%] mx-auto">
      <PartitionBarSegment num={3}>
        <PartitionBarSegmentTitle>Apples</PartitionBarSegmentTitle>
        <PartitionBarSegmentValue>30%</PartitionBarSegmentValue>
      </PartitionBarSegment>

      <PartitionBarSegment num={7} variant="secondary">
        <PartitionBarSegmentTitle>Oranges</PartitionBarSegmentTitle>
        <PartitionBarSegmentValue>70%</PartitionBarSegmentValue>
      </PartitionBarSegment>
    </PartitionBar>
  );
}
