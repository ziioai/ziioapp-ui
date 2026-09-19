"use client";

import { useState } from "react";
import { ImageViewer } from "../src/components/image-viewer";
import { MediaCollection } from "../src/components/media-collection";
import { MediaPicker } from "../src/components/media-picker";

/** The host owns file staging, validation and the lifetime of all preview URLs. */
export function MediaEditingExample({
  value,
  onValueChange,
  onFilesSelected,
  onReplace,
  busy,
}: {
  value: { key: string; src: string; alt: string }[];
  onValueChange: (value: { key: string; src: string; alt: string }[]) => void;
  onFilesSelected: (files: File[]) => void;
  onReplace: (key: string) => void;
  busy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  return (
    <div className="flex flex-col gap-4">
      <MediaCollection
        value={value}
        onValueChange={onValueChange}
        getItemKey={(item) => item.key}
        label="媒体"
        disabled={busy}
        onView={(item) => {
          setIndex(value.indexOf(item));
          setOpen(true);
        }}
        onReplace={(item) => onReplace(item.key)}
        renderPreview={(item) => (
          <img
            src={item.src}
            alt={item.alt}
            draggable={false}
            className="aspect-square w-full object-cover"
          />
        )}
      />
      <MediaPicker
        label="添加图片"
        accept="image/*"
        multiple
        busy={busy}
        onFilesSelected={onFilesSelected}
      />
      <ImageViewer
        images={value}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
      />
    </div>
  );
}
