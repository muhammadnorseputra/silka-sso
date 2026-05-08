import { Chip } from "@heroui/react";

export default function ChipComponent({ ...props }: any) {
  return (
    <Chip color="warning" size="lg" variant="flat">
      {props.name}
    </Chip>
  );
}
