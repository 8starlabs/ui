import {
  PartitionBar,
  PartitionBarSegment,
  PartitionBarSegmentTitle,
  PartitionBarSegmentValue
} from "@/registry/8starlabs-ui/blocks/partition-bar";

export default function PartitionBarCustomColoursDemo() {
  return (
    <PartitionBar size="md">
      <PartitionBarSegment num={6} className="bg-purple-600">
        <PartitionBarSegmentTitle className="text-purple-600">
          Custom 1
        </PartitionBarSegmentTitle>
        <PartitionBarSegmentValue>111</PartitionBarSegmentValue>
      </PartitionBarSegment>

      <PartitionBarSegment num={5} className="bg-amber-800">
        <PartitionBarSegmentTitle className="text-cyan-600">
          Custom 2
        </PartitionBarSegmentTitle>
        <PartitionBarSegmentValue className="text-red-700">
          222
        </PartitionBarSegmentValue>
      </PartitionBarSegment>

      <PartitionBarSegment num={4} variant="outline">
        <PartitionBarSegmentTitle>Default</PartitionBarSegmentTitle>
        <PartitionBarSegmentValue>333</PartitionBarSegmentValue>
      </PartitionBarSegment>
    </PartitionBar>
  );
}
