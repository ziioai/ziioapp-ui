import { isElectron } from "../platform/runtime";
import { cn } from "../utils/cn";
import "../styles/app-loading.css";

export function AppLoadingView() {
  return (
    <div className={cn("app-loading", isElectron && "electron")}>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="app-loading-text">...加载中...</div>
      </div>
    </div>
  );
}
