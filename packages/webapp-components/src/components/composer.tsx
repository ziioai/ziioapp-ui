"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@ziioapp/ui/components/input-group";
import { Spinner } from "@ziioapp/ui/components/spinner";
import { cn } from "@ziioapp/ui/lib/utils";
import { ArrowUp, Square } from "lucide-react";
import type { ComponentProps } from "react";

export function Composer(props: ComponentProps<typeof InputGroup>) {
  return <InputGroup {...props} />;
}

export function ComposerInput({
  onSubmitShortcut,
  submitShortcut = "mod-enter",
  onKeyDown,
  className,
  ...props
}: ComponentProps<typeof InputGroupTextarea> & {
  onSubmitShortcut?: () => void;
  submitShortcut?: "mod-enter" | "enter" | "none";
}) {
  return (
    <InputGroupTextarea
      className={cn(
        "min-h-0 max-h-32 field-sizing-content scroll-fade-y scroll-fade-4 overflow-y-auto",
        className,
      )}
      {...props}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (
          !event.defaultPrevented &&
          !event.nativeEvent.isComposing &&
          event.keyCode !== 229 &&
          event.key === "Enter" &&
          !event.shiftKey &&
          !event.altKey &&
          (submitShortcut === "mod-enter"
            ? event.ctrlKey || event.metaKey
            : submitShortcut === "enter" && !event.ctrlKey && !event.metaKey) &&
          onSubmitShortcut
        ) {
          event.preventDefault();
          onSubmitShortcut();
        }
      }}
    />
  );
}

export function ComposerActions({
  className,
  ...props
}: ComponentProps<typeof InputGroupAddon>) {
  return (
    <InputGroupAddon
      align="block-end"
      className={cn("pt-1", className)}
      {...props}
    />
  );
}

export function ComposerSubmit({
  busy = false,
  disabled,
  children,
  className,
  ...props
}: ComponentProps<typeof InputGroupButton> & { busy?: boolean }) {
  return (
    <InputGroupButton
      type="submit"
      variant="default"
      size="icon-sm"
      className={cn("ml-auto", className)}
      {...props}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
    >
      {busy ? <Spinner /> : (children ?? <ArrowUp />)}
    </InputGroupButton>
  );
}

export function ComposerStop({
  children,
  className,
  ...props
}: ComponentProps<typeof InputGroupButton>) {
  return (
    <InputGroupButton
      type="button"
      variant="secondary"
      size="icon-sm"
      aria-label="停止生成"
      className={cn("ml-auto", className)}
      {...props}
    >
      {children ?? <Square />}
    </InputGroupButton>
  );
}
