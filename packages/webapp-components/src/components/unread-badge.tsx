import { Badge } from "@ziioapp/ui/components/badge";
import { cn } from "@ziioapp/ui/lib/utils";
import type { ComponentProps } from "react";
export function UnreadBadge({
  count,
  max = 99,
  formatLabel = (n) => `${n} 条未读消息`,
  className,
  children,
  ...props
}: ComponentProps<typeof Badge> & {
  count: number;
  max?: number;
  formatLabel?: (count: number) => string;
}) {
  if (!Number.isFinite(count) || count < 1) return null;
  const value = Math.floor(count);
  const limit = Number.isFinite(max) && max >= 1 ? Math.floor(max) : 99;
  const text = value > limit ? `${limit}+` : String(value);
  return (
    <Badge
      aria-label={formatLabel(value)}
      className={cn(
        "h-5 min-w-5 shrink-0 justify-center rounded-full px-1.5 tabular-nums",
        text.length === 1 && "w-5 px-0",
        className,
      )}
      {...props}
    >
      {children ?? text}
    </Badge>
  );
}
