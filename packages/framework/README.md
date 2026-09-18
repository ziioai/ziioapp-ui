# @ziioapp/framework

ZiioApp 的应用壳层、主题运行时与通用页面。组件层来自 `@ziioapp/ui`，应用通过 `@ziioapp/vite-plugin-theme` 声明需要打包的主题资源。

```tsx
import { AppShell, ThemeScript } from "@ziioapp/framework";

<AppShell config={ziioAppConfig}>{children}</AppShell>;
```

样式入口应导入 `@ziioapp/framework/styles/source.css`；主题插件会自动生成该导入。

Web/SSG 应用必须在根文档的 `<head>` 中挂载 `ThemeScript`，并在 `<html>` 上设置 `suppressHydrationWarning`。脚本会在 React hydration 前恢复本地主题，避免错误配色闪烁；Electron 应用继续在 renderer 入口调用 `applyInitialTheme`。

```tsx
<html lang="zh-CN" suppressHydrationWarning>
  <head>
    <ThemeScript
      storageKey="theme"
      defaultTheme="system"
      defaultUiStyle={themeManifest.defaultStyle}
      defaultBaseColor={themeManifest.defaultBase}
      defaultThemeColor={themeManifest.defaultTheme}
      availableUiStyles={themeManifest.styles}
      availableBaseColors={themeManifest.bases}
      availableThemeColors={themeManifest.themes}
      availableChartColors={themeManifest.charts}
      runtime="web"
    />
  </head>
</html>
```
