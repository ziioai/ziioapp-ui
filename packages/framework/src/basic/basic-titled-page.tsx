import { useRouter } from "@tanstack/react-router";
import { Button } from "@ziioapp/ui/components/button";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronLeft } from "lucide-react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../utils/cn";
import { MyResponsiveWidthBox } from "./my-responsive-width-box";

const basicTitledPageVariants = cva(
  "group/basic-titled-page h-full flex flex-col overflow-hidden",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface BasicTitledPageConfig {
  alwaysTitle: boolean;
}

const BasicTitledPageConfigContext = createContext<BasicTitledPageConfig>({
  alwaysTitle: false,
});

interface BasicTitledPageConfigProviderProps {
  alwaysTitle?: boolean;
  children: React.ReactNode;
}

function BasicTitledPageConfigProvider({
  alwaysTitle = false,
  children,
}: BasicTitledPageConfigProviderProps) {
  return (
    <BasicTitledPageConfigContext.Provider value={{ alwaysTitle }}>
      {children}
    </BasicTitledPageConfigContext.Provider>
  );
}

interface BasicTitledPageProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof basicTitledPageVariants> {
  titleBoxClassName?: string;
  contentBoxClassName?: string;
  pageClassName?: string;
  icon?: React.ReactNode;
  title?: string;
  canGoBack?: boolean;
  goBackTo?: string;
  alwaysTitle?: boolean;
}

function BasicTitledPage({
  className,
  titleBoxClassName,
  contentBoxClassName,
  pageClassName,
  variant = "default",
  icon,
  title,
  canGoBack = false,
  goBackTo,
  alwaysTitle,
  children,
  ...props
}: BasicTitledPageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const config = useContext(BasicTitledPageConfigContext);
  const [headerTextVisible, setHeaderTextVisible] = useState(false);
  const [headerUsesViewport, setHeaderUsesViewport] = useState(false);
  const effectiveAlwaysTitle = alwaysTitle ?? config.alwaysTitle;

  // Progress driven by either scroll position or titleEnd resize
  const rawProgress = useMotionValue(0);

  const HEADER_TEXT_THRESHOLD = 0.98;

  const getScrollSource = useCallback((): HTMLElement | Window => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return window;

    let element: HTMLElement | null = scrollEl;
    while (element && element !== document.body) {
      const { overflowY } = window.getComputedStyle(element);
      const canScroll = ["auto", "scroll", "overlay"].includes(overflowY);
      if (canScroll && element.scrollHeight > element.clientHeight + 1) {
        return element;
      }
      element = element.parentElement;
    }

    return window;
  }, []);

  const updateProgress = useCallback(() => {
    const titleEl = titleRef.current;
    const scrollEl = scrollRef.current;
    const headerEl = headerRef.current;
    if (!(titleEl && scrollEl && headerEl)) return;

    const scrollSource = getScrollSource();
    const scrollSourceIsElement = scrollSource instanceof HTMLElement;
    setHeaderUsesViewport((current) => {
      const next = !scrollSourceIsElement;
      return current === next ? current : next;
    });
    const scrollTop = scrollSourceIsElement
      ? scrollSource.scrollTop
      : window.scrollY;
    const scrollViewportTop = scrollSourceIsElement
      ? scrollSource.getBoundingClientRect().top
      : 0;

    // Total scroll distance needed for title bottom to reach header bottom.
    // Adding scrollTop cancels out the current scroll offset, giving a constant
    // per layout — so progress = scrollTop / totalScrollNeeded is always linear.
    const totalScrollNeeded =
      titleEl.getBoundingClientRect().top -
      scrollViewportTop +
      scrollTop +
      titleEl.offsetHeight -
      headerEl.offsetHeight;

    rawProgress.jump(
      Math.max(0, Math.min(scrollTop / (totalScrollNeeded || 1), 1)),
    );
  }, [getScrollSource, rawProgress]);

  // Also refresh on mount, resize, and element size changes.
  useLayoutEffect(() => {
    const scrollEl = scrollRef.current;
    const titleEl = titleRef.current;
    const headerEl = headerRef.current;
    if (!(scrollEl && titleEl && headerEl)) return;
    updateProgress();

    const scrollTargets = new Set<EventTarget>([window]);
    let element: HTMLElement | null = scrollEl;
    while (element) {
      scrollTargets.add(element);
      element = element.parentElement;
    }

    for (const target of scrollTargets) {
      target.addEventListener("scroll", updateProgress, { passive: true });
    }

    const observer = new ResizeObserver(updateProgress);
    observer.observe(scrollEl);
    observer.observe(titleEl);
    observer.observe(headerEl);
    window.addEventListener("resize", updateProgress);
    return () => {
      for (const target of scrollTargets) {
        target.removeEventListener("scroll", updateProgress);
      }
      observer.disconnect();
      window.removeEventListener("resize", updateProgress);
    };
  }, [updateProgress]);

  const headerOpacity = useTransform(rawProgress, [0, 1], [0, 1]);

  useMotionValueEvent(rawProgress, "change", (latest) => {
    setHeaderTextVisible(latest >= HEADER_TEXT_THRESHOLD);
  });

  function handleGoBack() {
    const target = goBackTo?.trim();
    if (target) {
      router.navigate({ to: target as never });
      return;
    }
    router.history.back();
  }

  return (
    <div
      data-slot="basic-titled-page"
      className={cn(basicTitledPageVariants({ variant }), className)}
      {...props}
    >
      <div ref={scrollRef} className={cn("min-h-0 flex-1 overflow-y-auto")}>
        {title && (
          <div
            className={cn(
              headerUsesViewport
                ? "fixed inset-x-0 top-0 z-10 h-0 overflow-visible"
                : "sticky top-0 z-10 h-0 overflow-visible",
              effectiveAlwaysTitle ? null : "block sm:hidden",
            )}
          >
            <motion.div
              ref={headerRef}
              className={cn(
                "h-12 items-center bg-card/40 backdrop-blur-sm",
                canGoBack
                  ? "grid grid-cols-[1fr_auto_1fr]"
                  : "flex justify-center",
                headerTextVisible && "border-b sm:border-b-0",
              )}
              style={{ opacity: headerOpacity }}
            >
              {canGoBack && (
                <div
                  className="flex justify-start pl-2 transition-opacity duration-500"
                  style={{ opacity: headerTextVisible ? 1 : 0 }}
                >
                  <Button variant="ghost" size="icon-lg" onClick={handleGoBack}>
                    <ChevronLeft data-icon="inline-start" />
                  </Button>
                </div>
              )}
              <span
                className="flex items-center gap-2 text-base font-normal transition-opacity duration-500 [&_svg]:size-4"
                style={{ opacity: headerTextVisible ? 1 : 0 }}
              >
                {icon}
                {title}
              </span>
            </motion.div>
          </div>
        )}

        <div ref={titleRef} className={cn("relative")}>
          <motion.div
            className={cn(
              "absolute inset-0 border-b sm:border-b-0 border-border bg-background",
              effectiveAlwaysTitle ? null : "block sm:hidden",
            )}
            style={{ opacity: headerOpacity }}
          />
          <MyResponsiveWidthBox
            className={cn(
              "relative flex items-center text-2xl gap-2 pt-8 [&_svg]:size-6",
              titleBoxClassName,
            )}
          >
            {canGoBack && (
              <Button variant="ghost" size="icon-lg" onClick={handleGoBack}>
                <ChevronLeft data-icon="inline-start" />
              </Button>
            )}
            {icon}
            {title && <div className="font-bold">{title}</div>}
          </MyResponsiveWidthBox>
        </div>
        <MyResponsiveWidthBox className={contentBoxClassName}>
          <div className={cn("flex flex-col gap-6 pb-6", pageClassName)}>
            {children}
          </div>
        </MyResponsiveWidthBox>
      </div>
    </div>
  );
}

export {
  BasicTitledPage,
  BasicTitledPageConfigProvider,
  basicTitledPageVariants,
};
