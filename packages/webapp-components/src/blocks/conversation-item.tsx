"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@ziioapp/ui/components/item";
import { cn } from "@ziioapp/ui/lib/utils";
import type { ComponentProps, ReactNode } from "react";

export type ConversationItemProps = Omit<
  ComponentProps<typeof Item>,
  "title" | "children"
> & {
  avatar: ReactNode;
  title: ReactNode;
  preview: ReactNode;
  time?: ReactNode;
  badge?: ReactNode;
  trailing?: ReactNode;
};

export function ConversationItem({
  avatar,
  title,
  preview,
  time,
  badge,
  trailing,
  className,
  ...props
}: ConversationItemProps) {
  return (
    <Item className={cn("flex-nowrap", className)} {...props}>
      <ItemMedia>{avatar}</ItemMedia>
      <ItemContent className="min-w-0">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <ItemTitle className="block truncate">{title}</ItemTitle>
          {time}
        </div>
        <ItemDescription className="line-clamp-1 break-all">
          {preview}
        </ItemDescription>
        {badge != null && <div>{badge}</div>}
      </ItemContent>
      {trailing != null && <ItemActions>{trailing}</ItemActions>}
    </Item>
  );
}
