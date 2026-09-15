import { type ExternalToast, toast as sonnerToast } from "sonner";

export type FeedbackMessage = Parameters<typeof sonnerToast>[0];
export type FeedbackOptions = ExternalToast;

function messageFromUnknown(cause: unknown, fallback = "操作失败") {
  if (cause instanceof Error && cause.message.trim()) return cause.message;
  if (typeof cause === "string" && cause.trim()) return cause;
  return fallback;
}

/**
 * 应用级瞬时反馈入口。调用方依赖此契约，而不是直接依赖具体 Toast 实现。
 */
export const notify = {
  success(message: FeedbackMessage, options?: FeedbackOptions) {
    return sonnerToast.success(message, options);
  },
  error(message: FeedbackMessage, options?: FeedbackOptions) {
    return sonnerToast.error(message, options);
  },
  warning(message: FeedbackMessage, options?: FeedbackOptions) {
    return sonnerToast.warning(message, options);
  },
  info(message: FeedbackMessage, options?: FeedbackOptions) {
    return sonnerToast.info(message, options);
  },
  fromError(cause: unknown, fallback = "操作失败", options?: FeedbackOptions) {
    const description = messageFromUnknown(cause, "");
    return sonnerToast.error(fallback, {
      ...(description ? { description } : {}),
      ...options,
    });
  },
  dismiss(id?: string | number) {
    return sonnerToast.dismiss(id);
  },
};

export { messageFromUnknown };
