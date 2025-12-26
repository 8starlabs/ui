import {
  PartitionBar,
  PartitionBarSegment,
  PartitionBarSegmentTitle,
  PartitionBarSegmentValue
} from "@/registry/8starlabs-ui/blocks/partition-bar";

export default function PartitionBarDemo() {
  return (
    <PartitionBar size="md">
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
