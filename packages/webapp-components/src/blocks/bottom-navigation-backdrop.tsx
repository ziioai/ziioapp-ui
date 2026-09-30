import { cn } from "@ziioapp/ui/lib/utils";
import type { ComponentProps } from "react";
import { FadedBackdrop, TouchGuard } from "../components/faded-backdrop.js";

const bounds =
  "absolute left-1/2 w-[min(100vw,var(--mobile-page-width,768px))] -translate-x-1/2 bottom-[calc(-1*var(--floating-bar-bottom,calc(16px+env(safe-area-inset-bottom))))]";
export function BottomNavigationBackdropSurface({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-backdrop"
      aria-hidden="true"
      className={cn(bounds, "pointer-events-none -top-12", className)}
      {...props}
    />
  );
}
export function BottomNavigationBackdropTint({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 bg-linear-to-b from-background/0 to-background/85",
        className,
      )}
      {...props}
    />
  );
}
export function BottomNavigationTouchGuard({
  className,
  ...props
}: ComponentProps<typeof TouchGuard>) {
  return (
    <TouchGuard
      data-slot="navigation-touch-guard"
      className={cn(bounds, "top-0", className)}
      {...props}
    />
  );
}
/** A ready-made FloatingBar companion; omit the guard in custom compositions if unwanted. */
export function BottomNavigationBackdrop() {
  return (
    <>
      <BottomNavigationBackdropSurface>
        <FadedBackdrop className="absolute inset-0" />
        <BottomNavigationBackdropTint />
      </BottomNavigationBackdropSurface>
      <BottomNavigationTouchGuard />
    </>
  );
}
