"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@ziioapp/ui/components/button";
import { GripVertical, ImagePlus, Trash2 } from "lucide-react";
import { type ReactNode, useId } from "react";

export type MediaCollectionProps<T> = {
  value: readonly T[];
  onValueChange: (value: T[]) => void;
  getItemKey: (item: T) => string;
  renderPreview: (item: T, index: number) => ReactNode;
  onView: (item: T) => void;
  onReplace?: (item: T) => void;
  disabled?: boolean;
  label: string;
};

export function MediaCollection<T>({
  value,
  onValueChange,
  getItemKey,
  renderPreview,
  onView,
  onReplace,
  disabled = false,
  label,
}: MediaCollectionProps<T>) {
  const id = useId();
  const keys = value.map(getItemKey);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const position = (key: string | number) => keys.indexOf(String(key)) + 1;
  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "按空格键拿起媒体，方向键调整位置，再按空格键放下，Escape 取消。",
        },
        announcements: {
          onDragStart: ({ active }) =>
            `已拿起第 ${position(active.id)} 项媒体。`,
          onDragOver: ({ over }) =>
            over ? `移动至第 ${position(over.id)} 位。` : undefined,
          onDragEnd: ({ over }) =>
            over ? `已放至第 ${position(over.id)} 位。` : "顺序未更改。",
          onDragCancel: () => "已取消排序。",
        },
      }}
      onDragEnd={({ active, over }) => {
        if (disabled || !over || active.id === over.id) return;
        const from = keys.indexOf(String(active.id));
        const to = keys.indexOf(String(over.id));
        if (from >= 0 && to >= 0)
          onValueChange(arrayMove([...value], from, to));
      }}
    >
      <SortableContext items={keys} strategy={rectSortingStrategy}>
        <ol
          data-slot="media-collection"
          className="grid grid-cols-2 gap-3"
          aria-label={label}
        >
          {value.map((item, index) => (
            <MediaCollectionItem
              key={getItemKey(item)}
              id={getItemKey(item)}
              index={index}
              disabled={disabled}
              onView={() => onView(item)}
              onReplace={onReplace ? () => onReplace(item) : undefined}
              onRemove={() =>
                onValueChange(
                  value.filter(
                    (candidate) => getItemKey(candidate) !== getItemKey(item),
                  ),
                )
              }
            >
              {renderPreview(item, index)}
            </MediaCollectionItem>
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}

function MediaCollectionItem({
  id,
  index,
  disabled,
  onView,
  onReplace,
  onRemove,
  children,
}: {
  id: string;
  index: number;
  disabled: boolean;
  onView: () => void;
  onReplace?: () => void;
  onRemove: () => void;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });
  return (
    <li
      ref={setNodeRef}
      data-slot="media-collection-item"
      data-dragging={isDragging || undefined}
      className="relative flex min-w-0 flex-col gap-2 rounded-lg border bg-background p-2 data-[dragging]:opacity-70"
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <button
        type="button"
        className="overflow-hidden rounded-md"
        disabled={disabled}
        aria-label={`查看媒体 ${index + 1}`}
        onClick={onView}
      >
        {children}
      </button>
      <div className="flex items-center justify-between gap-1">
        <Button
          ref={setActivatorNodeRef}
          type="button"
          variant="ghost"
          size="icon-lg"
          className="touch-none"
          disabled={disabled}
          {...attributes}
          {...listeners}
          onPointerDown={(event) => {
            event.stopPropagation();
            listeners?.onPointerDown?.(event);
          }}
          aria-label={`拖动媒体 ${index + 1} 排序`}
        >
          <GripVertical data-icon="inline-start" />
        </Button>
        {onReplace && (
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            disabled={disabled}
            aria-label={`更换媒体 ${index + 1}`}
            onClick={onReplace}
          >
            <ImagePlus data-icon="inline-start" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          disabled={disabled}
          aria-label={`删除媒体 ${index + 1}`}
          onClick={onRemove}
        >
          <Trash2 data-icon="inline-start" />
        </Button>
      </div>
    </li>
  );
}
