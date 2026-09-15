import type {} from "../types/electron";

export const isElectron =
  typeof window !== "undefined" && typeof window.electronAPI !== "undefined";

export const isWeb = !isElectron;

/**
 * 检测当前页面是否在 Electron 独立窗口中打开。
 * 独立窗口加载时会在 hash 中附加 `?standalone=1`。
 */
export function isStandaloneWindow(): boolean {
  if (typeof window === "undefined") return false;
  const hash = window.location.hash;
  const queryStart = hash.indexOf("?");
  if (queryStart === -1) return false;
  const params = new URLSearchParams(hash.slice(queryStart));
  return params.get("standalone") === "1";
}
