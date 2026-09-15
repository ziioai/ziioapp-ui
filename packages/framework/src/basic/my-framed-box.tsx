import { cn } from "../utils/cn";

interface MyFramedBoxProps extends React.ComponentProps<"div"> {
  innerClassName?: string;
}

function MyFramedBox({
  className,
  innerClassName,
  children,
  ...props
}: MyFramedBoxProps) {
  return (
    <div
      data-slot="my-framed-box"
      className={cn(
        "min-h-0 flex-1",
        "sm:p-2",
        "print:px-0 print:pb-0",
        "overflow-hidden",
        "print:overflow-visible",
        // "border border-amber-200",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "p-0",
          // "sm:px-2",
          // "pb-20 sm:pb-0",
          // "sm:border print:border-0",
          "bg-muted sm:rounded-md",
          "print:bg-transparent",
          "size-full overflow-auto",
          "print:overflow-visible print:h-auto",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { MyFramedBox };
