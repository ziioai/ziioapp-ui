import { useLayoutEffect, useRef } from "react";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smootherstep = (value: number) => {
  const t = clamp(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/** Align the fade with the actual control and padding, including style changes.
 * Only the mask is updated; the observer never writes layout dimensions.
 */
export function useHeaderMask() {
  const header = useRef<HTMLDivElement>(null);
  const searchRegion = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = header.current;
    const region = searchRegion.current;
    const surface = backdrop.current;
    const control = region?.querySelector<HTMLElement>(
      "[data-slot=input-group]",
    );
    const content = region?.querySelector<HTMLElement>(
      "[data-slot=field-group]",
    );
    if (!container || !region || !surface || !control || !content) return;

    const update = () => {
      const bounds = container.getBoundingClientRect();
      if (!bounds.height) return;
      const progress = clamp(
        region.getBoundingClientRect().height /
          Math.max(content.getBoundingClientRect().height, Number.EPSILON),
      );
      const controlEnd = clamp(
        (control.getBoundingClientRect().bottom - bounds.top) / bounds.height,
      );
      // Sample both the whole surface and the short, real padding below the
      // input. Never compress the tail into a single coarse gradient segment.
      const positions = new Set<number>();
      for (let i = 0; i <= 20; i++) positions.add(i / 20);
      for (let i = 0; i <= 12; i++)
        positions.add(controlEnd + ((1 - controlEnd) * i) / 12);
      const stops = [...positions]
        .sort((a, b) => a - b)
        .map((position) => {
          const closed = 1 - smootherstep(position ** 3);
          // A small continuous fade above the input edge, then a smooth tail.
          // Both pieces meet with zero slope and curvature; there is no kink.
          const opened =
            position <= controlEnd
              ? 1 -
                0.01 *
                  smootherstep(position / Math.max(controlEnd, Number.EPSILON))
              : 0.99 *
                (1 -
                  smootherstep(
                    (position - controlEnd) /
                      Math.max(1 - controlEnd, Number.EPSILON),
                  ));
          const alpha = closed + (opened - closed) * progress;
          return `rgb(0 0 0 / ${alpha.toFixed(5)}) ${(position * 100).toFixed(4)}%`;
        });
      surface.style.setProperty(
        "--search-header-mask",
        `linear-gradient(to bottom, ${stops.join(", ")})`,
      );
    };
    const observer = new ResizeObserver(update);
    for (const element of [container, region, control, content])
      observer.observe(element);
    update();
    return () => observer.disconnect();
  }, []);

  return { header, searchRegion, backdrop };
}
