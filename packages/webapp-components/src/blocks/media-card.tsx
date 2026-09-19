import { cn } from "@ziioapp/ui/lib/utils";
import type { ComponentProps } from "react";

export function MediaCard({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      data-slot="media-card"
      className={cn(
        "relative flex min-w-0 flex-col overflow-hidden rounded-xl border bg-background",
        className,
      )}
      {...props}
    />
  );
}
export function MediaCardContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="media-card-content"
      className={cn("flex flex-col gap-4 p-4", className)}
      {...props}
    />
  );
}
