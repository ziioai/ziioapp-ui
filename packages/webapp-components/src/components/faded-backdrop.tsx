import { cn } from "@ziioapp/ui/lib/utils";
import type { ComponentProps } from "react";
/** Appearance belongs to Tailwind classes; no parallel blur/mask props. */
export function FadedBackdrop({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="faded-backdrop"
      aria-hidden="true"
      className={cn(
        "pointer-events-none backdrop-blur-[16px] mask-[linear-gradient(to_bottom,transparent,black)]",
        className,
      )}
      {...props}
    />
  );
}
export function TouchGuard({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="touch-guard"
      aria-hidden="true"
      className={cn("pointer-events-auto touch-none select-none", className)}
      {...props}
    />
  );
}
