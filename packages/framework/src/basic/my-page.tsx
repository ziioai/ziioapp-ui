import { cn } from "../utils/cn";

function MyPage({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="my-page"
      className={cn(
        "min-h-[60vh]",
        "sm:rounded-md",
        "transition-[padding] duration-300 ease-in-out",
        "px-4 py-6",
        "sm:px-8 sm:py-8",
        "md:px-12 md:py-8",
        "lg:px-16 lg:py-16",
        "xl:px-32 xl:py-20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { MyPage };
