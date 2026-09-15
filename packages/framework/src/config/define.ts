import type { ZiioAppConfig } from "./types";

export function defineZiioAppConfig<const TConfig extends ZiioAppConfig>(
  config: TConfig,
) {
  return config;
}
