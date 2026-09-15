import { Button } from "@ziioapp/ui/components/button";
import { Minus, Square, X } from "lucide-react";
import { useEffect, useState } from "react";
import type {} from "../types/electron";
import { cn } from "../utils/cn";

const isMac = navigator.userAgent.includes("Mac");

export function Titlebar({ className }: React.ComponentProps<"div">) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [zoomFactor, setZoomFactor] = useState(() => {
    return window.electronAPI?.getZoomFactor() ?? 1;
  });

  useEffect(() => {
    if (!window.electronAPI) return;
    const cleanup = window.electronAPI.onZoomFactorChange(setZoomFactor);
    return cleanup;
  }, []);

  useEffect(() => {
    if (!window.electronAPI) return;
    const cleanup = window.electronAPI.onMaximizeChange(setIsMaximized);
    return cleanup;
  }, []);

  // Compensate for browser zoom so the capsule's physical rendering matches
  // the fixed native traffic light position.
  const capsuleStyle: React.CSSProperties = {
    left: `${10 / zoomFactor}px`,
    top: `${10 / zoomFactor}px`,
    width: `${64 / zoomFactor}px`,
    height: `${24 / zoomFactor}px`,
  };
  const spacerWidth = `${70 / zoomFactor}px`;

  return (
    <div
      className={cn(
        "relative flex h-10 shrink-0 items-center border-b pr-1 bg-card/40 backdrop-blur-sm",
        className,
      )}
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      {/* macOS: traffic light background pill */}
      {isMac && (
        <>
          <div
            className="pointer-events-none absolute z-10 rounded-lg bg-muted/90"
            style={capsuleStyle}
          />
          <div style={{ width: spacerWidth }} />
        </>
      )}

      {/* Drag area fills remaining space */}
      <div className="flex-1" />

      {/* Windows/Linux: window controls */}
      <div
        className="flex items-center gap-0.5"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.electronAPI?.minimizeWindow()}
        >
          <Minus data-icon="inline-start" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.electronAPI?.toggleMaximizeWindow()}
        >
          <Square
            data-icon="inline-start"
            className={cn(isMaximized && "opacity-60")}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-destructive/15 hover:text-destructive"
          onClick={() => window.electronAPI?.closeWindow()}
        >
          <X data-icon="inline-start" />
        </Button>
      </div>
    </div>
  );
}
