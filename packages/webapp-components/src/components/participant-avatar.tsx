"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@ziioapp/ui/components/avatar";
import { cn } from "@ziioapp/ui/lib/utils";
import type { ComponentProps } from "react";
export type Participant = { id: string; name: string; imageUrl?: string };
const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const initial = (name: string) =>
  [...segmenter.segment(name)][0]?.segment || "?";
export function ParticipantAvatarFrame({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="participant-avatar-frame"
      role="img"
      className={cn(
        "size-14 overflow-hidden rounded-xl border border-border bg-muted",
        className,
      )}
      {...props}
    />
  );
}
export function ParticipantAvatarGrid({
  count,
  className,
  ...props
}: ComponentProps<"div"> & { count: number }) {
  return (
    <div
      data-slot="participant-avatar-grid"
      data-count={count}
      className={cn(
        "grid size-full grid-cols-2 gap-px bg-border data-[count=3]:[&>[data-slot=avatar]:first-child]:row-span-2",
        count > 2 && "grid-rows-2",
        className,
      )}
      {...props}
    />
  );
}
export function ParticipantAvatarCell({
  className,
  ...props
}: ComponentProps<typeof Avatar>) {
  return (
    <Avatar
      size="sm"
      aria-hidden="true"
      className={cn(
        "size-full min-h-0 min-w-0 rounded-none after:hidden",
        className,
      )}
      {...props}
    />
  );
}
export function ParticipantAvatarImage({
  className,
  ...props
}: ComponentProps<typeof AvatarImage>) {
  return (
    <AvatarImage alt="" className={cn("rounded-none", className)} {...props} />
  );
}
export function ParticipantAvatarFallback({
  className,
  ...props
}: ComponentProps<typeof AvatarFallback>) {
  return (
    <AvatarFallback className={cn("rounded-none", className)} {...props} />
  );
}
export function ParticipantAvatarOverflow({
  count,
  children,
  ...props
}: ComponentProps<typeof ParticipantAvatarFallback> & { count: number }) {
  return (
    <ParticipantAvatarFallback {...props}>
      {children ?? `+${count}`}
    </ParticipantAvatarFallback>
  );
}
export function ParticipantAvatar({
  participants,
  ...props
}: ComponentProps<typeof ParticipantAvatarFrame> & {
  participants: readonly Participant[];
}) {
  const label = participants.map((p) => p.name).join("、") || "暂无成员";
  const cell = (p?: Participant, size: "sm" | "lg" = "sm") => (
    <ParticipantAvatarCell key={p?.id ?? "empty"} size={size}>
      {p?.imageUrl && <ParticipantAvatarImage src={p.imageUrl} />}
      <ParticipantAvatarFallback>
        {initial(p?.name ?? "")}
      </ParticipantAvatarFallback>
    </ParticipantAvatarCell>
  );
  return (
    <ParticipantAvatarFrame aria-label={label} title={label} {...props}>
      {participants.length > 1 ? (
        <ParticipantAvatarGrid count={participants.length}>
          {participants
            .slice(0, participants.length > 4 ? 3 : 4)
            .map((p) => cell(p))}
          {participants.length > 4 && (
            <ParticipantAvatarCell>
              <ParticipantAvatarOverflow count={participants.length - 3} />
            </ParticipantAvatarCell>
          )}
        </ParticipantAvatarGrid>
      ) : (
        cell(participants[0], "lg")
      )}
    </ParticipantAvatarFrame>
  );
}
