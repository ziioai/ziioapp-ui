# @ziioapp/vite-plugin-theme

按应用声明组合 ZiioApp 主题 CSS，并生成供 `@ziioapp/framework` 使用的运行时主题清单。

```ts
import {
  defineThemeConfig,
  ziioappTheme,
} from "@ziioapp/vite-plugin-theme";

export default defineConfig({
  plugins: [ziioappTheme(defineThemeConfig({ themes: ["indigo", "rose"] }))],
});
```

插件会确定性地生成 `src/styles/theme.gen.css` 与 `src/styles/theme.manifest.ts`；内容不变时不会写盘。
