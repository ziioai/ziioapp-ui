"use client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@ziioapp/ui/components/input-group";
import { Search, X } from "lucide-react";
import type { ComponentProps } from "react";

export {
  InputGroup as SearchInputRoot,
  InputGroupInput as SearchInputControl,
} from "@ziioapp/ui/components/input-group";
export function SearchInputIcon({
  children,
  ...props
}: ComponentProps<typeof InputGroupAddon>) {
  return <InputGroupAddon {...props}>{children ?? <Search />}</InputGroupAddon>;
}
export function SearchInputAction({
  kind = "clear",
  children,
  ...props
}: ComponentProps<typeof InputGroupButton> & { kind?: "clear" | "close" }) {
  return (
    <InputGroupButton
      type="button"
      size="icon-xs"
      aria-label={kind === "close" ? "关闭搜索" : "清空搜索"}
      {...props}
    >
      {children ?? <X />}
    </InputGroupButton>
  );
}
export function SearchInputClear(
  props: Omit<ComponentProps<typeof SearchInputAction>, "kind">,
) {
  return <SearchInputAction kind="clear" {...props} />;
}
export function SearchInputClose(
  props: Omit<ComponentProps<typeof SearchInputAction>, "kind">,
) {
  return <SearchInputAction kind="close" {...props} />;
}
export type SearchInputProps = Omit<
  ComponentProps<typeof InputGroupInput>,
  "value" | "onChange"
> & {
  value: string;
  onValueChange: (value: string) => void;
  trailingAction?: {
    kind: "clear" | "close";
    label?: string;
    onClick: () => void;
  };
};
/** className/ref address the input. Compose the exported parts to style the group/addons. */
export function SearchInput({
  value,
  onValueChange,
  trailingAction,
  ...props
}: SearchInputProps) {
  return (
    <InputGroup>
      <InputGroupInput
        {...props}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      />
      <SearchInputIcon />
      {trailingAction &&
        (trailingAction.kind === "close" || value.length > 0) && (
          <InputGroupAddon align="inline-end">
            <SearchInputAction
              kind={trailingAction.kind}
              aria-label={
                trailingAction.label ??
                (trailingAction.kind === "close" ? "关闭搜索" : "清空搜索")
              }
              disabled={
                props.disabled ||
                (props.readOnly && trailingAction.kind === "clear")
              }
              onClick={trailingAction.onClick}
            />
          </InputGroupAddon>
        )}
    </InputGroup>
  );
}
