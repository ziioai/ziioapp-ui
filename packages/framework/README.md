# @ziioapp/framework

ZiioApp 的应用壳层、主题运行时与通用页面。组件层来自 `@ziioapp/ui`，应用通过 `@ziioapp/vite-plugin-theme` 声明需要打包的主题资源。

```tsx
import { AppShell } from "@ziioapp/framework";

<AppShell config={ziioAppConfig}>{children}</AppShell>;
```

样式入口应导入 `@ziioapp/framework/styles/source.css`；主题插件会自动生成该导入。
