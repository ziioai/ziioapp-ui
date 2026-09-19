"use client";

import { cn } from "@ziioapp/ui/lib/utils";
import {
  type ComponentProps,
  type CSSProperties,
  type Key,
  type ReactNode,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";

/** Shortest-column layout, adapted from tavern-dev's Masonry.
 * Keep chronological DOM order and remeasure when cards or images resize.
 */
export function Masonry<T>({
  items,
  renderItem,
  getItemKey,
  columns = 2,
  gap = 12,
  style,
  ref,
  className,
  ...props
}: {
  items: readonly T[];
  getItemKey: (item: T) => Key;
  columns?: number;
  gap?: number;
  renderItem: (item: T) => ReactNode;
} & Omit<ComponentProps<"div">, "children">) {
  const columnCount = Number.isFinite(columns)
    ? Math.max(1, Math.floor(columns))
    : 2;
  const gutter = Number.isFinite(gap) ? Math.max(0, gap) : 12;
  const container = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => container.current as HTMLDivElement);
  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    const cards = Array.from(root.children) as HTMLElement[];
    if (cards.length !== items.length) return;
    let frame = 0;
    let lastWidth = 0;
    const layout = () => {
      frame = 0;
      const width = root.clientWidth;
      if (!width) return;
      lastWidth = width;
      const gap = gutter;
      const columnWidth = Math.max(
        0,
        (width - gap * (columnCount - 1)) / columnCount,
      );
      for (const card of cards) card.style.width = `${columnWidth}px`;
      const heights = Array<number>(columnCount).fill(0);
      for (const card of cards) {
        const column = heights.indexOf(Math.min(...heights));
        card.style.left = `${column * (columnWidth + gap)}px`;
        card.style.top = `${heights[column]}px`;
        heights[column] += card.getBoundingClientRect().height + gap;
      }
      root.style.height = `${Math.max(0, ...heights) - (cards.length ? gap : 0)}px`;
      root.dataset.ready = "true";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(layout);
    };
    const observer = new ResizeObserver((entries) => {
      if (
        entries.some(
          ({ target, contentRect }) =>
            target !== root || contentRect.width !== lastWidth,
        )
      )
        schedule();
    });
    layout();
    observer.observe(root);
    for (const card of cards) observer.observe(card);
    root.addEventListener("load", schedule, true);
    root.addEventListener("error", schedule, true);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      root.removeEventListener("load", schedule, true);
      root.removeEventListener("error", schedule, true);
      delete root.dataset.ready;
      root.style.removeProperty("height");
      for (const card of cards) {
        card.style.removeProperty("width");
        card.style.removeProperty("left");
        card.style.removeProperty("top");
      }
    };
  }, [items, columnCount, gutter]);

  return (
    <div
      {...props}
      ref={container}
      data-slot="masonry"
      className={cn("wac-masonry", className)}
      style={
        {
          "--masonry-columns": columnCount,
          "--masonry-gap": `${gutter}px`,
          ...style,
        } as CSSProperties
      }
    >
      {items.map((item) => (
        <div key={getItemKey(item)} data-slot="masonry-item">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
