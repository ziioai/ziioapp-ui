"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ziioapp/ui/components/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@ziioapp/ui/components/toggle-group";
import { cn } from "@ziioapp/ui/lib/utils";
import type { ComponentProps } from "react";
export type ChoiceItem = { value: string; label: string; disabled?: boolean };
export type ChoiceGroup = { group: string; items: readonly ChoiceItem[] };
export function SelectChoice({
  value,
  onValueChange,
  items,
  groups,
  placeholder = "请选择",
  className,
  ...props
}: Omit<ComponentProps<typeof SelectTrigger>, "value" | "onChange"> & {
  value: string;
  onValueChange: (value: string) => void;
  items: readonly ChoiceItem[];
  groups?: readonly ChoiceGroup[];
  placeholder?: string;
}) {
  const choices = groups ? groups.flatMap((g) => g.items) : items;
  return (
    <Select
      items={choices}
      value={value || null}
      disabled={props.disabled}
      onValueChange={(next) => {
        if (next !== null) onValueChange(next);
      }}
    >
      <SelectTrigger className={cn("w-full min-w-0", className)} {...props}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {(groups ?? [{ group: "", items }]).map((group) => (
          <SelectGroup key={group.group}>
            {group.group && <SelectLabel>{group.group}</SelectLabel>}
            {group.items.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                disabled={item.disabled}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
export function SegmentedChoice({
  value,
  onValueChange,
  items,
  className,
  ...props
}: Omit<
  ComponentProps<typeof ToggleGroup>,
  "value" | "onValueChange" | "multiple"
> & {
  value: string;
  onValueChange: (value: string) => void;
  items: readonly ChoiceItem[];
}) {
  return (
    <ToggleGroup
      variant="outline"
      spacing={1}
      className={cn("flex-wrap", className)}
      {...props}
      value={[value]}
      onValueChange={(values) => {
        if (values[0]) onValueChange(values[0]);
      }}
    >
      {items.map((item) => (
        <ToggleGroupItem
          key={item.value}
          value={item.value}
          disabled={item.disabled}
        >
          {item.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
