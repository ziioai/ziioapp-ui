"use client";

import { Button } from "@ziioapp/ui/components/button";
import { cn } from "@ziioapp/ui/lib/utils";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useState,
} from "react";

export type MediaSlideshowProps<T> = Omit<ComponentProps<"div">, "children"> & {
  items: readonly T[];
  renderItem: (
    item: T,
    state: { index: number; playing: boolean },
  ) => ReactNode;
  isAnimated?: (item: T) => boolean;
  interval?: number;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
};

export function MediaSlideshow<T>({
  items,
  renderItem,
  isAnimated,
  interval = 5000,
  index: controlledIndex,
  defaultIndex = 0,
  onIndexChange,
  className,
  ...props
}: MediaSlideshowProps<T>) {
  const [internalIndex, setIndex] = useState(defaultIndex);
  const [playRequested, setPlayRequested] = useState<boolean>();
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(true);
  const index = Math.max(
    0,
    Math.min(controlledIndex ?? internalIndex, items.length - 1),
  );
  const playing = (playRequested ?? !reducedMotion) && visible;
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    const visibility = () => setVisible(!document.hidden);
    update();
    visibility();
    query.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      query.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const change = (next: number) => {
    if (controlledIndex === undefined) setIndex(next);
    onIndexChange?.(next);
  };
  useEffect(() => {
    if (!playing || items.length < 2 || interval <= 0) return;
    const timer = window.setTimeout(() => {
      const next = (index + 1) % items.length;
      if (controlledIndex === undefined) setIndex(next);
      onIndexChange?.(next);
    }, interval);
    return () => window.clearTimeout(timer);
  }, [playing, index, items.length, interval, controlledIndex, onIndexChange]);
  const current = items[index];
  return (
    <div
      data-slot="media-slideshow"
      className={cn("relative min-w-0", className)}
      {...props}
    >
      {current !== undefined && renderItem(current, { index, playing })}
      {current !== undefined && (items.length > 1 || isAnimated?.(current)) && (
        <div
          data-slot="media-slideshow-controls"
          className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-background p-1 text-xs"
        >
          {items.length > 1 && (
            <Button
              type="button"
              variant="secondary"
              size="icon-lg"
              aria-label="上一张图片"
              onClick={() => change((index + items.length - 1) % items.length)}
            >
              <ChevronLeft data-icon="inline-start" />
            </Button>
          )}
          <span>
            {index + 1} / {items.length}
          </span>
          <Button
            type="button"
            variant="secondary"
            size="icon-lg"
            aria-label={playing ? "暂停轮播" : "播放轮播"}
            onClick={() => setPlayRequested(!playing)}
          >
            {playing ? (
              <Pause data-icon="inline-start" />
            ) : (
              <Play data-icon="inline-start" />
            )}
          </Button>
          {items.length > 1 && (
            <Button
              type="button"
              variant="secondary"
              size="icon-lg"
              aria-label="下一张图片"
              onClick={() => change((index + 1) % items.length)}
            >
              <ChevronRight data-icon="inline-start" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
