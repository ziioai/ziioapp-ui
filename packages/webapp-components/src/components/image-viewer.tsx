"use client";

import { Button } from "@ziioapp/ui/components/button";
import { Spinner } from "@ziioapp/ui/components/spinner";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { useRef } from "react";
import Lightbox, {
  type ControllerRef,
  type SlideImage,
} from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

export type ViewerSlide = SlideImage & { error?: boolean };
export type ImageViewerProps = {
  images: readonly ViewerSlide[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  index: number;
  onIndexChange?: (index: number) => void;
  onExited?: () => void;
  labels?: Record<string, string>;
};

/** Receives resolved URLs; cache, credentials and URL leases belong to the caller. */
export function ImageViewer({
  images,
  open,
  onOpenChange,
  index,
  onIndexChange,
  onExited,
  labels,
}: ImageViewerProps) {
  const controller = useRef<ControllerRef>(null);
  const slides = [...images];
  const messages = {
    Close: "关闭图片浏览",
    Previous: "上一张",
    Next: "下一张",
    "Zoom in": "放大图片",
    "Zoom out": "缩小图片",
    Lightbox: "图片浏览",
    "Photo gallery": "图片列表",
    Slide: "图片",
    Carousel: "图片列表",
    "{index} of {total}": "第 {index} 张，共 {total} 张",
    Loading: "正在加载图片",
    Unavailable: "图片暂不可用",
    ...labels,
  };

  return (
    <Lightbox
      open={open}
      close={() => onOpenChange(false)}
      index={index}
      slides={slides}
      plugins={[Zoom]}
      className="wac-image-viewer"
      carousel={{ finite: true, imageFit: "contain", padding: 0 }}
      controller={{
        ref: controller,
        aria: true,
        closeOnPullDown: true,
        closeOnBackdropClick: true,
      }}
      zoom={{ maxZoomPixelRatio: 3 }}
      on={{
        view: ({ index: next }) => onIndexChange?.(next),
        exited: onExited,
      }}
      labels={messages}
      toolbar={{
        buttons: [
          <span
            key="counter"
            className="mr-auto px-2 text-sm tabular-nums"
            aria-live="polite"
          >
            {index + 1} / {images.length}
          </span>,
          "zoom",
          "close",
        ],
      }}
      render={{
        slide: ({ slide }) => {
          if (slide.src) return undefined;
          return (slide as ViewerSlide).error ? (
            <p role="status">{messages.Unavailable}</p>
          ) : (
            <Spinner aria-label={messages.Loading} />
          );
        },
        buttonClose: () => (
          <Button
            variant="secondary"
            size="icon-lg"
            aria-label={messages.Close}
            onClick={() => onOpenChange(false)}
          >
            <X data-icon="inline-start" />
          </Button>
        ),
        buttonZoom: ({ zoom, minZoom, maxZoom, zoomIn, zoomOut, disabled }) => (
          <>
            <Button
              variant="secondary"
              size="icon-lg"
              aria-label={messages["Zoom out"]}
              disabled={disabled || zoom <= minZoom}
              onClick={() => zoomOut()}
            >
              <ZoomOut data-icon="inline-start" />
            </Button>
            <Button
              variant="secondary"
              size="icon-lg"
              aria-label={messages["Zoom in"]}
              disabled={disabled || zoom >= maxZoom}
              onClick={() => zoomIn()}
            >
              <ZoomIn data-icon="inline-start" />
            </Button>
          </>
        ),
        buttonPrev: () =>
          images.length > 1 && (
            <Button
              variant="secondary"
              size="icon-lg"
              className="absolute top-1/2 left-3 -translate-y-1/2"
              aria-label={messages.Previous}
              disabled={index === 0}
              onClick={() => controller.current?.prev()}
            >
              <ChevronLeft data-icon="inline-start" />
            </Button>
          ),
        buttonNext: () =>
          images.length > 1 && (
            <Button
              variant="secondary"
              size="icon-lg"
              className="absolute top-1/2 right-3 -translate-y-1/2"
              aria-label={messages.Next}
              disabled={index === images.length - 1}
              onClick={() => controller.current?.next()}
            >
              <ChevronRight data-icon="inline-start" />
            </Button>
          ),
      }}
    />
  );
}
