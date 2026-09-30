import { Button } from "@ziioapp/ui/components/button";
import { cn } from "@ziioapp/ui/lib/utils";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Children, type ComponentProps, Fragment, type ReactNode } from "react";
import { SettingsSeparator } from "./settings-layout.js";
export function SettingsNavigationRoot({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="settings-navigation"
      className={cn(
        "flex flex-col rounded-xl border bg-card text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}
export function SettingsNavigationGroup({
  children,
  ...props
}: ComponentProps<typeof SettingsNavigationRoot>) {
  return (
    <SettingsNavigationRoot {...props}>
      {Children.toArray(children).map((child, index) => (
        <Fragment
          key={typeof child === "object" && "key" in child ? child.key : index}
        >
          {index > 0 && <SettingsSeparator />}
          {child}
        </Fragment>
      ))}
    </SettingsNavigationRoot>
  );
}
export function SettingsNavigationItemRoot({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        "h-auto min-h-14 w-full justify-start gap-3 rounded-none px-4 py-3 first:rounded-t-[inherit] last:rounded-b-[inherit] active:translate-y-0",
        className,
      )}
      {...props}
    />
  );
}
export function SettingsNavigationLabel({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span className={cn("min-w-0 flex-1 text-left", className)} {...props} />
  );
}
export function SettingsNavigationTrailing({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      className={cn("max-w-40 truncate text-muted-foreground", className)}
      {...props}
    />
  );
}
export function SettingsNavigationArrow(
  props: ComponentProps<typeof ChevronRight>,
) {
  return <ChevronRight data-icon="inline-end" {...props} />;
}
export function SettingsNavigationItem({
  icon: Icon,
  label,
  trailing,
  children,
  ...props
}: Omit<ComponentProps<typeof SettingsNavigationItemRoot>, "children"> & {
  icon?: LucideIcon;
  label: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <SettingsNavigationItemRoot {...props}>
      {children ?? (
        <>
          {Icon && <Icon data-icon="inline-start" />}
          <SettingsNavigationLabel>{label}</SettingsNavigationLabel>
          {trailing != null && (
            <SettingsNavigationTrailing>{trailing}</SettingsNavigationTrailing>
          )}
          <SettingsNavigationArrow />
        </>
      )}
    </SettingsNavigationItemRoot>
  );
}
