import { cn } from "@ziioapp/ui/lib/utils";
import type { ComponentProps } from "react";
/** Compose inside a flex, height-constrained DialogContent. Header/footer remain siblings. */
export function DialogBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "min-h-0 overflow-y-auto overscroll-contain p-1",
        className,
      )}
      {...props}
    />
  );
}
