import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@ziioapp/ui/components/field";
import { Separator } from "@ziioapp/ui/components/separator";
import { cn } from "@ziioapp/ui/lib/utils";
import { Children, type ComponentProps, Fragment, type ReactNode } from "react";
import {
  FormField,
  type FormFieldControlProps,
  type FormFieldProps,
} from "./form-field.js";

export { FieldLegend as SettingsGroupTitle } from "@ziioapp/ui/components/field";
export function SettingsGroupRoot({
  className,
  ...props
}: ComponentProps<typeof FieldSet>) {
  return <FieldSet className={cn("min-w-0 gap-3", className)} {...props} />;
}
export function SettingsGroupContent({
  className,
  ...props
}: ComponentProps<typeof FieldGroup>) {
  return (
    <FieldGroup
      className={cn(
        "min-w-0 gap-0 rounded-xl border bg-card text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}
export function SettingsSeparator({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={cn("px-4", className)} {...props}>
      <Separator />
    </div>
  );
}
export function SettingsGroup({
  title,
  children,
  ...props
}: Omit<ComponentProps<typeof SettingsGroupRoot>, "title"> & {
  title?: ReactNode;
}) {
  return (
    <SettingsGroupRoot {...props}>
      {title && <FieldLegend variant="label">{title}</FieldLegend>}
      <SettingsGroupContent>
        {Children.toArray(children).map((child, index) => (
          <Fragment
            key={
              typeof child === "object" && "key" in child ? child.key : index
            }
          >
            {index > 0 && <SettingsSeparator />}
            {child}
          </Fragment>
        ))}
      </SettingsGroupContent>
    </SettingsGroupRoot>
  );
}
export function SettingsField({ className, ...props }: FormFieldProps) {
  return <FormField className={cn("min-w-0 p-4", className)} {...props} />;
}
export function SettingsRowRoot({
  className,
  ...props
}: ComponentProps<typeof Field>) {
  return (
    <Field
      orientation="horizontal"
      className={cn(
        "group/settings-row min-w-0 flex-wrap gap-3 p-4",
        className,
      )}
      {...props}
    />
  );
}
export function SettingsRowContent({
  className,
  ...props
}: ComponentProps<typeof FieldContent>) {
  return (
    <FieldContent
      className={cn("min-w-0 basis-28 self-center", className)}
      {...props}
    />
  );
}
export function SettingsRowControl({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="settings-row-control"
      className={cn(
        "flex min-w-0 max-w-full flex-[1_1_10rem] items-center justify-end sm:w-56 sm:flex-none [&>[data-slot=toggle-group]]:justify-end group-data-[grouped=true]/settings-row:w-full group-data-[grouped=true]/settings-row:basis-full sm:group-data-[grouped=true]/settings-row:basis-auto",
        className,
      )}
      {...props}
    />
  );
}
export function SettingsRowActions({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="settings-row-actions"
      className={cn("ml-auto flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  );
}
export type SettingsRowProps = Omit<
  ComponentProps<typeof SettingsRowRoot>,
  "children" | "id"
> & {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  grouped?: boolean;
  children: (control: FormFieldControlProps) => ReactNode;
};
export function SettingsRow({
  id,
  label,
  description,
  error,
  disabled,
  grouped = false,
  children,
  ...props
}: SettingsRowProps) {
  const describedBy =
    [
      description && `${id}-help`,
      error && `${id}-error`,
      props["aria-describedby"],
    ]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <SettingsRowRoot
      {...props}
      data-grouped={grouped}
      data-invalid={!!error || undefined}
      data-disabled={disabled || undefined}
    >
      <SettingsRowContent>
        {grouped ? (
          <FieldTitle id={`${id}-label`}>{label}</FieldTitle>
        ) : (
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
        )}
        {description && (
          <FieldDescription id={`${id}-help`}>{description}</FieldDescription>
        )}
      </SettingsRowContent>
      <SettingsRowControl>
        {children({
          id,
          disabled,
          "aria-invalid": !!error,
          "aria-describedby": describedBy,
          "aria-labelledby": grouped ? `${id}-label` : undefined,
        })}
      </SettingsRowControl>
      {error && (
        <FieldError id={`${id}-error`} className="basis-full">
          {error}
        </FieldError>
      )}
    </SettingsRowRoot>
  );
}
