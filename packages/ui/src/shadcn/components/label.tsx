// Generated from locked shadcn upstream; edit scripts/sync-upstream.mjs, not this file.
"use client"

import * as React from "react"
import { cn } from "@ziioapp/ui/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "cn-label flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export { Label }
