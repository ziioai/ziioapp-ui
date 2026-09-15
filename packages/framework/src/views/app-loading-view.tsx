import { isElectron } from "../platform/runtime";
import {
  type InitialThemeOptions,
  ThemeScript,
} from "../providers/theme-script";
import { cn } from "../utils/cn";
import "../styles/app-loading.css";

export interface AppLoadingViewProps {
  initialTheme?: InitialThemeOptions;
}

export function AppLoadingView({ initialTheme }: AppLoadingViewProps = {}) {
  return (
    <>
      <ThemeScript
        {...initialTheme}
        runtime={isElectron ? "electron" : "web"}
      />
      <div className={cn("app-loading", isElectron && "electron")}>
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="app-loading-text">...加载中...</div>
        </div>
      </div>
    </>
  );
}
