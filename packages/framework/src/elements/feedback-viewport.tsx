import { Toaster } from "@ziioapp/ui/components/toast";

export type FeedbackViewportProps = React.ComponentProps<typeof Toaster>;

/** The single application-level mount point for transient feedback. */
export function FeedbackViewport(props: FeedbackViewportProps) {
  return <Toaster {...props} />;
}
