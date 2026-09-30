"use client";
import { Field, FieldLabel } from "@ziioapp/ui/components/field";
import { type ComponentProps, useId, useRef } from "react";
import {
  Composer,
  ComposerActions,
  ComposerInput,
  ComposerStop,
  ComposerSubmit,
} from "../components/composer.js";
import { useMergedRef } from "../internal/use-merged-ref.js";
export function MessageComposer({
  value,
  onValueChange,
  onSend,
  onStop,
  canSubmit,
  editable = true,
  active = false,
  label = "消息",
  sendLabel = "发送消息",
  stopLabel = "停止生成",
  placeholder,
  maxLength,
  submitShortcut = "enter",
  ref,
  onSubmit,
  children,
  ...props
}: Omit<ComponentProps<"form">, "onChange"> & {
  value: string;
  onValueChange: (value: string) => void;
  onSend: (value: string) => void;
  onStop: () => void;
  canSubmit: boolean;
  editable?: boolean;
  active?: boolean;
  label?: string;
  sendLabel?: string;
  stopLabel?: string;
  placeholder?: string;
  maxLength?: number;
  submitShortcut?: "mod-enter" | "enter" | "none";
}) {
  const id = useId();
  const form = useRef<HTMLFormElement>(null);
  const mergedRef = useMergedRef(form, ref);
  const allowed = editable && canSubmit && !active;
  return (
    <form
      {...props}
      ref={mergedRef}
      onSubmit={(event) => {
        onSubmit?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        if (allowed) onSend(value);
      }}
    >
      {children ?? (
        <Field data-disabled={!editable}>
          <FieldLabel htmlFor={id} className="sr-only">
            {label}
          </FieldLabel>
          <Composer>
            <ComposerInput
              id={id}
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              disabled={!editable}
              placeholder={placeholder}
              maxLength={maxLength}
              rows={1}
              className="max-h-40"
              submitShortcut={submitShortcut}
              onSubmitShortcut={() => {
                form.current?.requestSubmit();
              }}
            />
            <ComposerActions className="justify-end">
              {active ? (
                <ComposerStop aria-label={stopLabel} onClick={onStop} />
              ) : (
                <ComposerSubmit aria-label={sendLabel} disabled={!allowed} />
              )}
            </ComposerActions>
          </Composer>
        </Field>
      )}
    </form>
  );
}
