"use client";

import { cn } from "@ziioapp/ui/lib/utils";
import type { ComponentProps, CSSProperties } from "react";
import { useVisualViewport } from "../internal/use-visual-viewport.js";

export function MobilePage({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="mobile-page"
      className={cn("wac-mobile-page", className)}
      {...props}
    />
  );
}

export function MobilePageContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="mobile-page-content"
      className={cn("wac-page-content", className)}
      {...props}
    />
  );
}

/** Fixed-height conversation surface that follows the mobile keyboard. */
export function MobileViewport({
  className,
  style,
  ...props
}: ComponentProps<"section">) {
  const viewport = useVisualViewport();
  return (
    <section
      data-slot="mobile-viewport"
      className={cn("wac-mobile-viewport", className)}
      style={
        {
          "--viewport-height": viewport ? `${viewport.height}px` : undefined,
          "--viewport-top": viewport ? `${viewport.top}px` : undefined,
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  );
}
