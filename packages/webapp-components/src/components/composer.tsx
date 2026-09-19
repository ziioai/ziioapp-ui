"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@ziioapp/ui/components/input-group";
import { Spinner } from "@ziioapp/ui/components/spinner";
import { cn } from "@ziioapp/ui/lib/utils";
import { ArrowUp } from "lucide-react";
import type { ComponentProps } from "react";

export function Composer(props: ComponentProps<typeof InputGroup>) {
  return <InputGroup {...props} />;
}

export function ComposerInput({
  onSubmitShortcut,
  onKeyDown,
  className,
  ...props
}: ComponentProps<typeof InputGroupTextarea> & {
  onSubmitShortcut?: () => void;
}) {
  return (
    <InputGroupTextarea
      className={cn("max-h-32", className)}
      {...props}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (
          !event.defaultPrevented &&
          !event.nativeEvent.isComposing &&
          event.key === "Enter" &&
          (event.ctrlKey || event.metaKey) &&
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
      {busy ? (
        <Spinner data-icon="inline-start" />
      ) : (
        (children ?? <ArrowUp data-icon="inline-start" />)
      )}
    </InputGroupButton>
  );
}
