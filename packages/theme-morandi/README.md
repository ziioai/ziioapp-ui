# @ziioapp/theme-morandi

ZiioApp 的莫兰迪主题族，包含鼠尾草、尘粉与雾蓝三个浅色/深色语义 token 主题。

```ts
import { morandiThemes } from "@ziioapp/theme-morandi";
import {
  defineThemeConfig,
  ziioappTheme,
} from "@ziioapp/vite-plugin-theme";

ziioappTheme(
  defineThemeConfig({
    themes: morandiThemes,
  }),
);
```

为兼容 NexLife 旧内容，CSS 仍接受 `morandi-olive`、`morandi-rose` 与 `morandi-blue` 别名；主题选择器只公开三个规范名称。
