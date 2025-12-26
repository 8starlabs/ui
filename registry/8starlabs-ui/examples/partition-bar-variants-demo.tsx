import {
  PartitionBar,
  PartitionBarSegment,
  PartitionBarSegmentTitle,
  PartitionBarSegmentValue
} from "@/registry/8starlabs-ui/blocks/partition-bar";

export default function PartitionBarVariantsDemo() {
  return (
    <PartitionBar size="md">
      <PartitionBarSegment num={3} variant="default">
        <PartitionBarSegmentTitle>Apples</PartitionBarSegmentTitle>
        <PartitionBarSegmentValue>300kg</PartitionBarSegmentValue>
      </PartitionBarSegment>

      <PartitionBarSegment num={2} variant="secondary">
        <PartitionBarSegmentTitle>Oranges</PartitionBarSegmentTitle>
        <PartitionBarSegmentValue>200kg</PartitionBarSegmentValue>
      </PartitionBarSegment>

      <PartitionBarSegment num={3} variant="destructive">
        <PartitionBarSegmentTitle>Bananas</PartitionBarSegmentTitle>
        <PartitionBarSegmentValue>300kg</PartitionBarSegmentValue>
      </PartitionBarSegment>

      <PartitionBarSegment num={2} variant="outline">
        <PartitionBarSegmentTitle>Pears</PartitionBarSegmentTitle>
        <PartitionBarSegmentValue>200kg</PartitionBarSegmentValue>
      </PartitionBarSegment>

      <PartitionBarSegment num={3} variant="muted">
        <PartitionBarSegmentTitle>Mangoes</PartitionBarSegmentTitle>
        <PartitionBarSegmentValue>300kg</PartitionBarSegmentValue>
      </PartitionBarSegment>
    </PartitionBar>
  );
}
