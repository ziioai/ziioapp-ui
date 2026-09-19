"use client";

import { Button } from "@ziioapp/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@ziioapp/ui/components/drawer";
import { cn } from "@ziioapp/ui/lib/utils";
import { X } from "lucide-react";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { BottomFixed } from "react-bottom-fixed";
import { useVisualViewport } from "../internal/use-visual-viewport.js";

export type InputDrawerProps = ComponentProps<typeof Drawer> & {
  title: ReactNode;
  closeLabel: string;
  children: ReactNode;
  contentProps?: Omit<
    ComponentProps<typeof DrawerContent>,
    "children" | "render" | "className" | "style"
  > & { className?: string; style?: CSSProperties };
};

/** Keyboard-safe container only. Drafts, submission and dismissal policy belong to the caller. */
export function InputDrawer({
  title,
  closeLabel,
  children,
  contentProps,
  ...props
}: InputDrawerProps) {
  const viewport = useVisualViewport();
  const { className, style, ...popupProps } = contentProps ?? {};
  return (
    <Drawer showSwipeHandle {...props}>
      <DrawerContent
        initialFocus={false}
        aria-describedby={undefined}
        {...popupProps}
        className={cn(
          "mx-auto w-full max-w-3xl max-h-[calc(var(--input-viewport-height,100dvh)-1rem)]",
          className,
        )}
        style={
          {
            "--input-viewport-height": viewport
              ? `${viewport.height}px`
              : undefined,
            ...style,
          } as CSSProperties
        }
        render={(popup) => (
          <BottomFixed className="inset-x-0" scrollBehavior="close-keyboard">
            <div {...popup} />
          </BottomFixed>
        )}
      >
        <DrawerHeader className="relative">
          <DrawerTitle className="pr-10">{title}</DrawerTitle>
          <DrawerClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                aria-label={closeLabel}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              />
            }
          >
            <X data-icon="inline-start" />
          </DrawerClose>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}

export function InputDrawerBody({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-drawer-body"
      className={cn(
        "min-h-0 overflow-y-auto overscroll-contain px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]",
        className,
      )}
      {...props}
    />
  );
}

export function InputDrawerActions({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-drawer-actions"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  );
}
