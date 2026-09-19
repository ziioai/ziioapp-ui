"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@ziioapp/ui/components/field";
import type { ComponentProps, ReactNode } from "react";

export type FormFieldControlProps = {
  id: string;
  disabled?: boolean;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
};
export type FormFieldProps = Omit<ComponentProps<typeof Field>, "children"> & {
  id: string;
  label: ReactNode;
  children: ReactNode | ((props: FormFieldControlProps) => ReactNode);
  description?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  labelHidden?: boolean;
  grouped?: boolean;
  action?: ReactNode;
};

/** Field composition; typography and spacing belong to the upstream theme. */
export function FormField({
  id,
  label,
  children,
  description,
  error,
  invalid = !!error,
  disabled,
  labelHidden = false,
  grouped = false,
  action,
  ...props
}: FormFieldProps) {
  const describedBy =
    [
      description ? `${id}-help` : null,
      error ? `${id}-error` : null,
      props["aria-describedby"],
    ]
      .filter(Boolean)
      .join(" ") || undefined;
  const title = grouped ? (
    <FieldTitle
      id={`${id}-label`}
      className={labelHidden ? "sr-only" : undefined}
    >
      {label}
    </FieldTitle>
  ) : (
    <FieldLabel htmlFor={id} className={labelHidden ? "sr-only" : undefined}>
      {label}
    </FieldLabel>
  );
  return (
    <Field
      {...props}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      aria-labelledby={grouped ? `${id}-label` : props["aria-labelledby"]}
      aria-describedby={describedBy}
    >
      {action ? (
        <div className="flex items-center justify-between gap-3">
          {title}
          {action}
        </div>
      ) : (
        title
      )}
      {typeof children === "function"
        ? children({
            id,
            disabled,
            "aria-invalid": invalid,
            "aria-describedby": describedBy,
            "aria-labelledby": grouped ? `${id}-label` : undefined,
          })
        : children}
      {description && (
        <FieldDescription id={`${id}-help`}>{description}</FieldDescription>
      )}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  );
}
