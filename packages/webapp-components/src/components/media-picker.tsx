"use client";

import { Button } from "@ziioapp/ui/components/button";
import { Spinner } from "@ziioapp/ui/components/spinner";
import { ImagePlus, X } from "lucide-react";
import { type ComponentProps, type ReactNode, useRef } from "react";

export type MediaPickerProps = {
  label: string;
  accept: string;
  multiple?: boolean;
  disabled?: boolean;
  busy?: boolean;
  children?: ReactNode;
  icon?: ReactNode;
  onFilesSelected: (files: File[]) => void;
  onRemove?: () => void;
  removeLabel?: string;
  triggerProps?: Omit<
    ComponentProps<typeof Button>,
    "children" | "onClick" | "disabled"
  >;
};

/** Does not create object URLs, upload files or maintain a second copy of the value. */
export function MediaPicker({
  label,
  accept,
  multiple,
  disabled,
  busy,
  children,
  icon = <ImagePlus data-icon="inline-start" />,
  onFilesSelected,
  onRemove,
  removeLabel = "移除媒体",
  triggerProps,
}: MediaPickerProps) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div data-slot="media-picker" className="flex flex-wrap items-center gap-3">
      {children}
      <Button
        type="button"
        variant="outline"
        {...triggerProps}
        disabled={disabled || busy}
        aria-busy={busy || undefined}
        onClick={() => input.current?.click()}
      >
        {busy ? <Spinner data-icon="inline-start" /> : icon}
        {label}
      </Button>
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          disabled={disabled || busy}
          aria-label={removeLabel}
          onClick={onRemove}
        >
          <X data-icon="inline-start" />
        </Button>
      )}
      <input
        ref={input}
        type="file"
        className="sr-only"
        tabIndex={-1}
        aria-label={label}
        accept={accept}
        multiple={multiple}
        disabled={disabled || busy}
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? []);
          event.currentTarget.value = "";
          if (files.length) onFilesSelected(files);
        }}
      />
    </div>
  );
}
