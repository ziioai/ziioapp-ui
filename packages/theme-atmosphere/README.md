# @ziioapp/theme-atmosphere

ZiioApp 的氛围主题族，包含樱花、咖啡、万圣节与人文四个浅色/深色语义 token 主题。

```ts
import { atmosphereThemes } from "@ziioapp/theme-atmosphere";
import {
  defineThemeConfig,
  ziioappTheme,
} from "@ziioapp/vite-plugin-theme";

ziioappTheme(
  defineThemeConfig({
    themes: atmosphereThemes,
  }),
);
```
