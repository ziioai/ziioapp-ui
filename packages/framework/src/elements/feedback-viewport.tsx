import { Toaster } from "@ziioapp/ui/components/sonner";

import { useTheme } from "../providers/theme-provider";

export type FeedbackViewportProps = Omit<
  React.ComponentProps<typeof Toaster>,
  "theme"
>;

/** The single application-level mount point for transient feedback. */
export function FeedbackViewport(props: FeedbackViewportProps) {
  const { resolvedTheme } = useTheme();
  return <Toaster theme={resolvedTheme} {...props} />;
}
