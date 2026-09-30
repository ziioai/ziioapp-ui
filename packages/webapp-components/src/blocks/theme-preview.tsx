"use client";
import { Badge } from "@ziioapp/ui/components/badge";
import { Button } from "@ziioapp/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ziioapp/ui/components/card";
import { FieldGroup } from "@ziioapp/ui/components/field";
import { Input } from "@ziioapp/ui/components/input";
import { cn } from "@ziioapp/ui/lib/utils";
import { type ComponentProps, useId } from "react";
import { ExpandableNote } from "../components/expandable-note.js";
import { FormField } from "../components/form-field.js";

const colors = [
  ["background / foreground", "bg-background text-foreground"],
  ["card / card-foreground", "bg-card text-card-foreground"],
  ["primary / primary-foreground", "bg-primary text-primary-foreground"],
  [
    "secondary / secondary-foreground",
    "bg-secondary text-secondary-foreground",
  ],
  ["muted / muted-foreground", "bg-muted text-muted-foreground"],
  ["accent / accent-foreground", "bg-accent text-accent-foreground"],
  ["popover / popover-foreground", "bg-popover text-popover-foreground"],
] as const;
export function ThemePreviewSwatch({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col justify-center gap-1 rounded-md border border-border px-3 py-2",
        className,
      )}
      {...props}
    />
  );
}
export function ThemePreviewPalette({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)} {...props}>
      {children ??
        colors.map(([name, color]) => (
          <ThemePreviewSwatch key={name} className={color}>
            {name.split(" / ").map((token) => (
              <code key={token} className="break-all text-xs">
                {token}
              </code>
            ))}
          </ThemePreviewSwatch>
        ))}
    </div>
  );
}
export function ThemePreviewAccents({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)} {...props}>
      {children ?? (
        <>
          <ThemePreviewSwatch className="border-border">
            border
          </ThemePreviewSwatch>
          <ThemePreviewSwatch className="border-input">
            input
          </ThemePreviewSwatch>
          <ThemePreviewSwatch className="ring-2 ring-ring ring-inset">
            ring
          </ThemePreviewSwatch>
          <ThemePreviewSwatch className="text-destructive">
            destructive
          </ThemePreviewSwatch>
        </>
      )}
    </div>
  );
}
export function ThemePreviewCharts({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={cn("flex gap-2", className)} {...props}>
      {children ??
        [
          "bg-chart-1",
          "bg-chart-2",
          "bg-chart-3",
          "bg-chart-4",
          "bg-chart-5",
        ].map((color, index) => (
          <div key={color} className="flex min-w-0 flex-1 flex-col gap-1">
            <div className={cn("h-8 rounded-sm", color)} />
            <code className="text-xs">{index + 1}</code>
          </div>
        ))}
    </div>
  );
}
export function ThemePreviewBadges({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} {...props}>
      {children ?? (
        <>
          <Badge>默认标签</Badge>
          <Badge variant="secondary">次要标签</Badge>
          <Badge variant="outline">边框标签</Badge>
          <Badge variant="destructive">错误标签</Badge>
        </>
      )}
    </div>
  );
}
export function ThemePreviewActions({
  className,
  children,
  ...props
}: ComponentProps<typeof CardFooter>) {
  return (
    <CardFooter className={cn("flex flex-wrap gap-2", className)} {...props}>
      {children ?? (
        <>
          <Button type="button">主要操作</Button>
          <Button type="button" variant="secondary">
            次要操作
          </Button>
          <Button type="button" variant="outline">
            边框按钮
          </Button>
          <Button type="button" variant="ghost">
            轻量按钮
          </Button>
        </>
      )}
    </CardFooter>
  );
}
export function ThemePreview({
  children,
  ...props
}: ComponentProps<typeof Card>) {
  const id = useId();
  return (
    <Card size="sm" aria-label="配色预览" {...props}>
      {children ?? (
        <>
          <CardHeader>
            <CardTitle>配色预览</CardTitle>
            <CardDescription>
              随明暗模式、组件风格和配色实时变化。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ThemePreviewBadges />
            <FieldGroup>
              <FormField
                id={id}
                label="输入框"
                description="点击输入框可查看聚焦轮廓。"
              >
                {(control) => (
                  <Input {...control} placeholder="试着输入一些文字" />
                )}
              </FormField>
            </FieldGroup>
            <ExpandableNote title="查看主题变量">
              <div className="flex flex-col gap-3">
                <ThemePreviewPalette />
                <ThemePreviewAccents />
                <ThemePreviewCharts />
              </div>
            </ExpandableNote>
          </CardContent>
          <ThemePreviewActions />
        </>
      )}
    </Card>
  );
}
