// Generated from locked shadcn upstream; edit scripts/sync-upstream.mjs, not this file.
import { cn } from "@ziioapp/ui/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("cn-skeleton animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
