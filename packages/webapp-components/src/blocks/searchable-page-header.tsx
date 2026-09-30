"use client";
import { Button } from "@ziioapp/ui/components/button";
import { FieldGroup } from "@ziioapp/ui/components/field";
import { cn } from "@ziioapp/ui/lib/utils";
import { Search } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
} from "react";
import { FadedBackdrop, TouchGuard } from "../components/faded-backdrop.js";
import { FormField } from "../components/form-field.js";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderTitle,
} from "../components/page-header.js";
import { SearchInput } from "../components/search-input.js";
import { useHeaderMask } from "../internal/use-header-mask.js";
import { useMergedRef } from "../internal/use-merged-ref.js";

const Context = createContext<{
  mask: ReturnType<typeof useHeaderMask>;
  open: boolean;
  id: string;
  close: () => void;
  toggle: () => void;
  trigger: ReturnType<typeof useRef<HTMLButtonElement | null>>;
} | null>(null);
function useHeader() {
  const value = useContext(Context);
  if (!value) throw Error("SearchHeader parts require SearchHeaderRoot");
  return value;
}
export function SearchHeaderRoot({
  searchOpen,
  onSearchOpenChange,
  className,
  children,
  ref,
  ...props
}: ComponentProps<"div"> & {
  searchOpen: boolean;
  onSearchOpenChange: (open: boolean) => void;
}) {
  const mask = useHeaderMask(),
    trigger = useRef<HTMLButtonElement>(null),
    id = useId();
  const merged = useMergedRef(mask.header, ref);
  useEffect(() => {
    if (searchOpen)
      mask.searchRegion.current
        ?.querySelector<HTMLInputElement>("input")
        ?.focus({ preventScroll: true });
  }, [searchOpen, mask.searchRegion]);
  const close = () => {
    onSearchOpenChange(false);
    trigger.current?.focus({ preventScroll: true });
  };
  return (
    <Context.Provider
      value={{
        mask,
        open: searchOpen,
        id,
        trigger,
        close,
        toggle: () => (searchOpen ? close() : onSearchOpenChange(true)),
      }}
    >
      <div
        data-slot="search-header"
        className={cn(
          "sticky top-0 z-20 isolate pt-[env(safe-area-inset-top)]",
          className,
        )}
        {...props}
        ref={merged}
      >
        {children}
      </div>
    </Context.Provider>
  );
}
export function SearchHeaderBackdrop({
  className,
  ref,
  ...props
}: ComponentProps<typeof FadedBackdrop>) {
  const { mask } = useHeader();
  const merged = useMergedRef(mask.backdrop, ref);
  return (
    <FadedBackdrop
      data-slot="search-header-backdrop"
      className={cn(
        "absolute inset-y-0 left-1/2 -z-10 w-[min(100vw,var(--mobile-page-width,768px))] -translate-x-1/2 bg-background/20 mask-[var(--search-header-mask)]",
        className,
      )}
      {...props}
      ref={merged}
    />
  );
}
export function SearchHeaderTouchGuard({
  className,
  ...props
}: ComponentProps<typeof TouchGuard>) {
  return (
    <TouchGuard
      data-slot="search-header-touch-guard"
      className={cn("absolute inset-0 -z-10", className)}
      {...props}
    />
  );
}
export function SearchHeaderTrigger({
  onClick,
  ref,
  children,
  ...props
}: ComponentProps<typeof Button>) {
  const context = useHeader();
  const merged = useMergedRef(context.trigger, ref);
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      aria-label="搜索"
      aria-expanded={context.open}
      aria-controls={context.id}
      {...props}
      ref={merged}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) context.toggle();
      }}
    >
      {children ?? <Search />}
    </Button>
  );
}
export function SearchHeaderSearch({
  className,
  ref,
  onKeyDown,
  ...props
}: ComponentProps<"div">) {
  const context = useHeader();
  const merged = useMergedRef(context.mask.searchRegion, ref);
  return (
    <div
      data-slot="search-header-search"
      className={cn(
        "grid transition-[grid-template-rows] duration-250 ease-in-out motion-reduce:transition-none",
        context.open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className,
      )}
      {...props}
      id={context.id}
      ref={merged}
      inert={!context.open}
      aria-hidden={!context.open}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (!e.defaultPrevented && e.key === "Escape") {
          e.preventDefault();
          context.close();
        }
      }}
    />
  );
}
export function SearchHeaderSearchClip({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={cn("min-h-0 overflow-hidden", className)} {...props} />
  );
}
export function SearchHeaderSearchContent({
  className,
  ...props
}: ComponentProps<typeof FieldGroup>) {
  return (
    <FieldGroup
      className={cn("px-5 pt-1 pb-3 sm:px-8", className)}
      {...props}
    />
  );
}
export function SearchHeaderClose({
  onClick,
  children,
  ...props
}: ComponentProps<typeof Button>) {
  const { close } = useHeader();
  return (
    <Button
      type="button"
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) close();
      }}
    >
      {children ?? "关闭搜索"}
    </Button>
  );
}
export type SearchablePageHeaderProps = ComponentProps<"div"> & {
  title: string;
  searchLabel: string;
  placeholder?: string;
  query: string;
  onQueryChange: (query: string) => void;
  searchOpen: boolean;
  onSearchOpenChange: (open: boolean) => void;
  actions?: ReactNode;
};
export function SearchablePageHeader({
  title,
  searchLabel,
  placeholder,
  query,
  onQueryChange,
  searchOpen,
  onSearchOpenChange,
  actions,
  ...props
}: SearchablePageHeaderProps) {
  const inputId = useId();
  const close = () => {
    onQueryChange("");
    onSearchOpenChange(false);
  };
  return (
    <SearchHeaderRoot
      {...props}
      searchOpen={searchOpen}
      onSearchOpenChange={(open) => (open ? onSearchOpenChange(true) : close())}
    >
      <SearchHeaderBackdrop />
      <SearchHeaderTouchGuard />
      <PageHeader className="items-center justify-between">
        <PageHeaderTitle className="my-0 self-center">{title}</PageHeaderTitle>
        <PageHeaderActions className="self-center">
          <SearchHeaderTrigger aria-label={searchLabel} />
          {actions}
        </PageHeaderActions>
      </PageHeader>
      <SearchHeaderSearch>
        <SearchHeaderSearchClip>
          <SearchHeaderSearchContent>
            <FormField id={inputId} label={searchLabel} labelHidden>
              {(control) => (
                <SearchHeaderDefaultInput
                  {...control}
                  value={query}
                  onValueChange={onQueryChange}
                  placeholder={placeholder}
                />
              )}
            </FormField>
          </SearchHeaderSearchContent>
        </SearchHeaderSearchClip>
      </SearchHeaderSearch>
    </SearchHeaderRoot>
  );
}
function SearchHeaderDefaultInput(props: ComponentProps<typeof SearchInput>) {
  const { close } = useHeader();
  return (
    <SearchInput
      {...props}
      trailingAction={{ kind: "close", onClick: close }}
    />
  );
}
