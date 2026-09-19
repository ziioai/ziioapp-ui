import { cn } from "@ziioapp/ui/lib/utils";
import type { ComponentProps } from "react";

export function PageHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      data-slot="page-header"
      className={cn("wac-page-header", className)}
      {...props}
    />
  );
}
export function PageHeaderTitle({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-header-title"
      className={cn(
        "min-w-0 break-words text-xl font-semibold leading-snug",
        className,
      )}
      {...props}
    />
  );
}
export function PageHeaderActions({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-actions"
      className={cn("ml-auto flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  );
}
