import { useHydrated } from "@tanstack/react-router";
import { BasicTitledPageConfigProvider } from "../basic/basic-titled-page";
import { MyFramedBox } from "../basic/my-framed-box";
import {
  FeedbackViewport,
  type FeedbackViewportProps,
} from "../elements/feedback-viewport";
import { Titlebar } from "../elements/titlebar";
import { isElectron } from "../platform/runtime";
import {
  ThemeProvider,
  type ThemeProviderProps,
} from "../providers/theme-provider";
import { cn } from "../utils/cn";
import { AppLoadingView } from "../views/app-loading-view";

export type AloneWindowShellProps = Omit<ThemeProviderProps, "children"> & {
  children: React.ReactNode;
  renderToaster?: boolean;
  toasterPosition?: FeedbackViewportProps["position"];
};

export function AloneWindowShell({
  children,
  renderToaster = true,
  toasterPosition,
  ...themeProps
}: AloneWindowShellProps) {
  const hydrated = useHydrated();

  const content = hydrated ? (
    <ThemeProvider defaultTheme="system" storageKey="theme" {...themeProps}>
      <div
        data-shell-mode="standalone"
        className={cn("flex h-screen flex-col overflow-hidden", "bg-card")}
      >
        {isElectron && <Titlebar className="border-b sm:border-b-0" />}

        <BasicTitledPageConfigProvider alwaysTitle>
          <MyFramedBox className="sm:px-2 sm:pb-2">{children}</MyFramedBox>
        </BasicTitledPageConfigProvider>
      </div>
      {renderToaster ? <FeedbackViewport position={toasterPosition} /> : null}
    </ThemeProvider>
  ) : (
    <AppLoadingView
      initialTheme={{
        defaultTheme: "system",
        storageKey: "theme",
        ...themeProps,
      }}
    />
  );

  return content;
}
