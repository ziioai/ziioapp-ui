import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/cn";

const bgBoardVariants = cva("group/bg-board block", {
  variants: {
    variant: {
      default: "bg-muted",
      alt1: "bg-background",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function BgBoard({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof bgBoardVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(bgBoardVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "bg-board",
      variant,
    },
  });
}

export { BgBoard, bgBoardVariants };
