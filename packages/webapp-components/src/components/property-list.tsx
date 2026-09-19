"use client";

import { Item, ItemGroup, ItemSeparator } from "@ziioapp/ui/components/item";
import { cn } from "@ziioapp/ui/lib/utils";
import { ChevronRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export function PropertyList({
  className,
  ...props
}: ComponentProps<typeof ItemGroup>) {
  return (
    <ItemGroup
      role="group"
      className={cn("gap-0 overflow-hidden rounded-xl border", className)}
      {...props}
    />
  );
}

export function PropertyListSeparator({
  className,
  ...props
}: ComponentProps<typeof ItemSeparator>) {
  return <ItemSeparator className={cn("my-0", className)} {...props} />;
}

/** Use render={<button />} or render={<a />} for interactive rows. */
export function PropertyRow({
  className,
  ...props
}: ComponentProps<typeof Item>) {
  return (
    <Item
      className={cn(
        "min-h-16 grid grid-cols-[var(--property-label-width,5.5rem)_minmax(0,1fr)_auto] gap-3 rounded-none text-left",
        className,
      )}
      {...props}
    />
  );
}

export function PropertyRowLabel({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      data-slot="property-row-label"
      className={cn(
        "cn-field-description truncate text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function PropertyRowValue({
  className,
  children,
  placeholder,
  ...props
}: ComponentProps<"div"> & { placeholder?: ReactNode }) {
  const empty = children == null || children === "";
  return (
    <div
      data-slot="property-row-value"
      data-empty={empty || undefined}
      className={cn(
        "cn-field-description min-w-0 truncate",
        empty ? "text-muted-foreground" : "text-foreground",
        className,
      )}
      {...props}
    >
      {empty ? placeholder : children}
    </div>
  );
}

export function PropertyRowAction({
  className,
  children = <ChevronRight aria-hidden="true" />,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      data-slot="property-row-action"
      className={cn(
        "flex shrink-0 items-center text-muted-foreground [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
