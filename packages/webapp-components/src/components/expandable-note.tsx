"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@ziioapp/ui/components/collapsible";
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@ziioapp/ui/components/marker";
import { cn } from "@ziioapp/ui/lib/utils";
import { ChevronRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export { Collapsible as ExpandableNoteRoot } from "@ziioapp/ui/components/collapsible";
export {
  Marker as ExpandableNoteHeader,
  MarkerContent as ExpandableNoteTitle,
} from "@ziioapp/ui/components/marker";
export function ExpandableNoteTrigger({
  className,
  ...props
}: ComponentProps<typeof CollapsibleTrigger>) {
  return (
    <CollapsibleTrigger
      className={cn(
        "group flex items-center gap-2 rounded-sm py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}
export function ExpandableNoteArrow({
  className,
  ...props
}: ComponentProps<typeof ChevronRight>) {
  return (
    <ChevronRight
      className={cn(
        "transition-transform duration-200 group-aria-expanded:rotate-90 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}
export function ExpandableNoteContent({
  className,
  ...props
}: ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-250 ease-out data-starting-style:h-0 data-starting-style:opacity-0 data-ending-style:h-0 data-ending-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}
export function ExpandableNoteBody({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-3 py-2 whitespace-pre-wrap text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
export function ExpandableNote({
  title,
  children,
  ...props
}: Omit<ComponentProps<typeof Collapsible>, "title"> & { title: ReactNode }) {
  return (
    <Collapsible {...props}>
      <Marker>
        <ExpandableNoteTrigger>
          <MarkerContent>{title}</MarkerContent>
          <MarkerIcon>
            <ExpandableNoteArrow />
          </MarkerIcon>
        </ExpandableNoteTrigger>
      </Marker>
      <ExpandableNoteContent>
        <ExpandableNoteBody>{children}</ExpandableNoteBody>
      </ExpandableNoteContent>
    </Collapsible>
  );
}
