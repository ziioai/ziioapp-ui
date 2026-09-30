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
export function ConversationItemRoot({
  className,
  ...props
}: ComponentProps<typeof Item>) {
  return <Item className={cn("flex-nowrap", className)} {...props} />;
}
export function ConversationItemAvatar({
  className,
  ...props
}: ComponentProps<typeof ItemMedia>) {
  return <ItemMedia className={cn("shrink-0", className)} {...props} />;
}
export function ConversationItemContent({
  className,
  ...props
}: ComponentProps<typeof ItemContent>) {
  return <ItemContent className={cn("min-w-0", className)} {...props} />;
}
export function ConversationItemTitleRow({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center justify-between gap-2",
        className,
      )}
      {...props}
    />
  );
}
export function ConversationItemTitle({
  className,
  ...props
}: ComponentProps<typeof ItemTitle>) {
  return <ItemTitle className={cn("block truncate", className)} {...props} />;
}
export function ConversationItemPreviewRow({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-w-0 items-center gap-2", className)}
      {...props}
    />
  );
}
export function ConversationItemPreview({
  className,
  ...props
}: ComponentProps<typeof ItemDescription>) {
  return (
    <ItemDescription
      className={cn("min-w-0 line-clamp-1 break-all", className)}
      {...props}
    />
  );
}
export function ConversationItemTitleGroup({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-w-0 flex-1 items-center gap-2", className)}
      {...props}
    />
  );
}
export { ItemActions as ConversationItemActions } from "@ziioapp/ui/components/item";
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
  titleBadge?: ReactNode;
  previewTrailing?: ReactNode;
};
/** Legacy badge stays below the preview; new slots are opt-in. */
export function ConversationItem({
  avatar,
  title,
  preview,
  time,
  badge,
  trailing,
  titleBadge,
  previewTrailing,
  ...props
}: ConversationItemProps) {
  return (
    <ConversationItemRoot {...props}>
      <ConversationItemAvatar
        className={
          titleBadge != null || previewTrailing != null
            ? "self-center"
            : undefined
        }
      >
        {avatar}
      </ConversationItemAvatar>
      <ConversationItemContent>
        <ConversationItemTitleRow>
          {titleBadge != null ? (
            <ConversationItemTitleGroup>
              <ConversationItemTitle className="min-w-0">
                {title}
              </ConversationItemTitle>
              {titleBadge}
            </ConversationItemTitleGroup>
          ) : (
            <ConversationItemTitle>{title}</ConversationItemTitle>
          )}
          {time}
        </ConversationItemTitleRow>
        {previewTrailing != null ? (
          <ConversationItemPreviewRow>
            <ConversationItemPreview className="flex-1">
              {preview}
            </ConversationItemPreview>
            {previewTrailing}
          </ConversationItemPreviewRow>
        ) : (
          <ConversationItemPreview>{preview}</ConversationItemPreview>
        )}
        {badge != null && <div>{badge}</div>}
      </ConversationItemContent>
      {trailing != null && <ItemActions>{trailing}</ItemActions>}
    </ConversationItemRoot>
  );
}
