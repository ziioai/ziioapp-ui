"use client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@ziioapp/ui/components/input-group";
import { Eye, EyeOff } from "lucide-react";
import type { ComponentProps } from "react";

export {
  InputGroup as SecretInputRoot,
  InputGroupInput as SecretInputControl,
} from "@ziioapp/ui/components/input-group";
export function SecretInputToggle({
  visible,
  onVisibleChange,
  showLabel = "显示内容",
  hideLabel = "隐藏内容",
  onClick,
  children,
  ...props
}: ComponentProps<typeof InputGroupButton> & {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  showLabel?: string;
  hideLabel?: string;
}) {
  return (
    <InputGroupButton
      type="button"
      size="icon-xs"
      aria-label={visible ? hideLabel : showLabel}
      aria-pressed={visible}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onVisibleChange(!visible);
      }}
    >
      {children ?? (visible ? <EyeOff /> : <Eye />)}
    </InputGroupButton>
  );
}
export type SecretInputProps = Omit<
  ComponentProps<typeof InputGroupInput>,
  "type"
> & {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  showLabel?: string;
  hideLabel?: string;
};
export function SecretInput({
  visible,
  onVisibleChange,
  showLabel,
  hideLabel,
  ...props
}: SecretInputProps) {
  return (
    <InputGroup>
      <InputGroupInput
        autoComplete="off"
        spellCheck={false}
        {...props}
        type={visible ? "text" : "password"}
      />
      <InputGroupAddon align="inline-end">
        <SecretInputToggle
          visible={visible}
          onVisibleChange={onVisibleChange}
          showLabel={showLabel}
          hideLabel={hideLabel}
          disabled={props.disabled}
        />
      </InputGroupAddon>
    </InputGroup>
  );
}
