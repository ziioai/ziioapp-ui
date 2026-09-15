import { cn } from "../utils/cn";

function MyResponsiveWidthBox({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="my-responsive-width-box"
      className={cn(
        // 'bg-red-500/10',
        // 'bg-muted',
        // 'sm:border sm:border-border',
        "sm:rounded-md",
        "mx-auto w-full",
        "max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl",
        "transition-[max-width,padding] duration-300 ease-in-out",
        "px-4",
        "sm:px-8",
        "md:px-12",
        "lg:px-16",
        "xl:px-32",
        "py-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { MyResponsiveWidthBox };
