"use client";

import { Tabs, TabsList, TabsTrigger } from "@ziioapp/ui/components/tabs";
import { cn } from "@ziioapp/ui/lib/utils";
import { type ComponentProps, createContext, useContext } from "react";

const NavigationValue = createContext<string | null>(null);

/** Reuse the complete upstream Tabs appearance, including runtime style presets. */
export function BottomNavigation({
  value,
  children,
  className,
  ...props
}: ComponentProps<"nav"> & { value: string }) {
  return (
    <NavigationValue value={value}>
      <nav data-slot="bottom-navigation" {...props}>
        <Tabs value={value}>
          <TabsList
            role="presentation"
            activateOnFocus={false}
            className={cn(
              "relative h-auto w-full gap-1 bg-muted/25 backdrop-blur-[20px]",
              className,
            )}
          >
            {children}
          </TabsList>
        </Tabs>
      </nav>
    </NavigationValue>
  );
}

/** Keep link semantics while letting Tabs supply theme classes and active state. */
export function BottomNavigationItem({
  value,
  className,
  ...props
}: ComponentProps<typeof TabsTrigger> & { value: string }) {
  const selected = useContext(NavigationValue);
  return (
    <TabsTrigger
      {...props}
      value={value}
      role="link"
      aria-current={selected === value ? "page" : undefined}
      aria-selected={undefined}
      aria-controls={undefined}
      tabIndex={0}
      className={cn(
        "min-h-11 min-w-0 flex-1 flex-col gap-1 px-2 py-1 text-xs data-active:bg-foreground/5 data-active:border-foreground/5 data-active:text-foreground hover:bg-foreground/6 data-active:hover:bg-foreground/14 dark:data-active:bg-foreground/5 dark:data-active:border-foreground/5 dark:data-active:text-foreground dark:data-active:hover:bg-foreground/14",
        className,
      )}
    />
  );
}
