import {
  PartitionBar,
  PartitionBarSegment,
  PartitionBarSegmentTitle,
  PartitionBarSegmentValue
} from "@/registry/8starlabs-ui/blocks/partition-bar";

export default function PartitionBarAlignmentDemo() {
  return (
    <PartitionBar size="md">
      <PartitionBarSegment num={4} alignment="left">
        <PartitionBarSegmentTitle>Start</PartitionBarSegmentTitle>
        <PartitionBarSegmentValue>40</PartitionBarSegmentValue>
      </PartitionBarSegment>

      <PartitionBarSegment num={2} alignment="center" variant="secondary">
        <PartitionBarSegmentTitle>Middle</PartitionBarSegmentTitle>
        <PartitionBarSegmentValue>20</PartitionBarSegmentValue>
      </PartitionBarSegment>

      <PartitionBarSegment num={4} alignment="right" variant="muted">
        <PartitionBarSegmentTitle>End</PartitionBarSegmentTitle>
        <PartitionBarSegmentValue>40</PartitionBarSegmentValue>
      </PartitionBarSegment>
    </PartitionBar>
  );
}
