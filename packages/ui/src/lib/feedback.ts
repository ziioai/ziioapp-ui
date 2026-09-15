import type { MouseEventHandler, ReactNode } from "react";
import { toast as baseToast } from "../shadcn/components/toast";

type BaseToastOptions = Parameters<typeof baseToast.add>[0];

export type FeedbackMessage = ReactNode;
export type FeedbackOptions = Omit<
  BaseToastOptions,
  "id" | "timeout" | "title" | "type"
> & {
  /** Sonner-compatible alias retained for existing consumers. */
  duration?: number;
  id?: string | number;
  timeout?: number;
  action?: {
    label: ReactNode;
    onClick: MouseEventHandler<HTMLButtonElement>;
  };
};

type FeedbackType = "success" | "error" | "warning" | "info";

function messageFromUnknown(cause: unknown, fallback = "操作失败") {
  if (cause instanceof Error && cause.message.trim()) return cause.message;
  if (typeof cause === "string" && cause.trim()) return cause;
  return fallback;
}

function addFeedback(
  type: FeedbackType,
  title: FeedbackMessage,
  options: FeedbackOptions = {},
) {
  const { action, duration, id, timeout, ...toastOptions } = options;
  return baseToast.add({
    ...toastOptions,
    title,
    type,
    ...(id === undefined ? {} : { id: String(id) }),
    ...(timeout === undefined && duration === undefined
      ? {}
      : { timeout: timeout ?? duration }),
    ...(action
      ? {
          actionProps: {
            children: action.label,
            onClick: action.onClick,
          },
        }
      : {}),
  });
}

/**
 * 应用级瞬时反馈入口。调用方依赖此契约，而不是直接依赖具体 Toast 实现。
 */
export const notify = {
  success(message: FeedbackMessage, options?: FeedbackOptions) {
    return addFeedback("success", message, options);
  },
  error(message: FeedbackMessage, options?: FeedbackOptions) {
    return addFeedback("error", message, options);
  },
  warning(message: FeedbackMessage, options?: FeedbackOptions) {
    return addFeedback("warning", message, options);
  },
  info(message: FeedbackMessage, options?: FeedbackOptions) {
    return addFeedback("info", message, options);
  },
  fromError(cause: unknown, fallback = "操作失败", options?: FeedbackOptions) {
    const description = messageFromUnknown(cause, "");
    return addFeedback("error", fallback, {
      ...(description ? { description } : {}),
      ...options,
    });
  },
  dismiss(id?: string | number) {
    return baseToast.close(id === undefined ? undefined : String(id));
  },
};

export { messageFromUnknown };
