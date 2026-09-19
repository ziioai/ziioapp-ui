import { cn } from "@ziioapp/ui/lib/utils";
import type { ComponentProps } from "react";

/** Placement only; content may be a navigation block or a group of actions. */
export function FloatingBar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="floating-bar"
      className={cn("wac-floating-bar", className)}
      {...props}
    />
  );
}
