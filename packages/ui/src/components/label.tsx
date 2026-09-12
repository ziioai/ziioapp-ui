"use client";

import type * as React from "react";

import { cn } from "@ziioapp/ui/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    // biome-dont-ignore lint/a11y/noLabelWithoutControl: This is a reusable label primitive; callers provide htmlFor or wrap controls.
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-xs/relaxed leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
