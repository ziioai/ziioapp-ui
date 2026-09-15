import { cn } from "../utils/cn";

function MyPageContainer({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="my-page-container"
      className={cn(
        "mx-auto w-full max-w-full transition-[max-width] duration-300 ease-in-out",
        "sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { MyPageContainer };
