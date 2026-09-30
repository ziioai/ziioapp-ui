"use client";
import { Button } from "@ziioapp/ui/components/button";
import { Moon, Sun } from "lucide-react";
import type { ComponentProps } from "react";
export function ThemeModeButton({
  mode,
  onToggle,
  lightLabel = "切换到亮色",
  darkLabel = "切换到暗色",
  onClick,
  children,
  ...props
}: ComponentProps<typeof Button> & {
  mode: "light" | "dark";
  onToggle: () => void;
  lightLabel?: string;
  darkLabel?: string;
}) {
  const label = mode === "dark" ? lightLabel : darkLabel;
  const Icon = mode === "dark" ? Sun : Moon;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onToggle();
      }}
    >
      {children ?? <Icon />}
    </Button>
  );
}
