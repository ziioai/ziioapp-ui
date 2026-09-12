# @ziioapp/ui

[English](README.md) | [简体中文](README-cn.md) · [npm](https://www.npmjs.com/package/@ziioapp/ui)

基于 Base UI 和固定版本 shadcn/ui 源码的 React 组件库，支持运行时风格与配色切换。由 **ziioai** 维护。

## 特性

- 62 个 Base UI 组件，提供 ESM 导出和 TypeScript 类型声明。
- 8 套风格：Vega、Nova、Maia、Lyra、Mira、Luma、Sera、Rhea。
- 24 套主题配色，支持明暗模式和图表配色。
- 通过 body 类名切换风格，无需重新挂载组件。
- 提供全量及按风格拆分的预编译 CSS，使用时无需 Tailwind 构建。
- 使用 Lucide 图标，不附带字体文件或其他图标库。
- 保留上游原件、文件哈希与可重复执行的生成流程。

## 安装

```sh
pnpm add @ziioapp/ui react react-dom
```

需要 **React 19.2.4 及以上的 React 19 版本**，React DOM 同样适用。仅提供 ESM。使用预编译 CSS 时无需安装 Tailwind；使用源码 CSS 时需要 Tailwind CSS 4.3。

## 快速开始

在应用入口导入一次样式：

```tsx
import "@ziioapp/ui/styles.css";
import { Button } from "@ziioapp/ui/components/button";

export function App() {
  return <Button>开始使用</Button>;
}
```

在 HTML 中设置初始主题类名，确保首次绘制前生效：

```html
<html class="light base-color-zinc theme-color-indigo">
  <body class="style-mira">
    <div id="root"></div>
  </body>
</html>
```

深色模式使用 `dark` 替换 `light`。全量样式包含 Tailwind reset、组件工具类、默认 Zinc 变量、全部官方配色与八套风格，不包含字体文件，也不会为应用自身的页面代码生成工具类。

## 风格与配色

在 `body` 上设置一个 `style-*` 类名，在 `html` 上设置 `base-color-*`、`theme-color-*` 及可选的 `chart-color-*`。切换时替换同类别的旧类名。Portal 组件共享整个文档的 body 风格。

```js
document.body.classList.replace("style-mira", "style-nova");
document.documentElement.classList.replace("light", "dark");
document.documentElement.classList.replace(
  "theme-color-indigo",
  "theme-color-emerald",
);
```

风格：`vega`、`nova`、`maia`、`lyra`、`mira`、`luma`、`sera`、`rhea`。

基础配色：`neutral`、`stone`、`zinc`、`mauve`、`olive`、`mist`、`taupe`。

主题配色：`neutral`、`stone`、`zinc`、`mauve`、`olive`、`mist`、`taupe`、`amber`、`blue`、`cyan`、`emerald`、`fuchsia`、`green`、`indigo`、`lime`、`orange`、`pink`、`purple`、`red`、`rose`、`sky`、`teal`、`violet`、`yellow`。

可从 `@ziioapp/ui/lib/official-themes` 导入风格与配色列表。组件的局部 `size` 属性独立于全局风格。主题持久化及系统明暗模式检测由应用负责。

### 按需加载风格

用基础 CSS 和所需风格替换全量导入：

```tsx
import "@ziioapp/ui/base.css";
import "@ziioapp/ui/styles/compiled/mira.css";
import "@ziioapp/ui/styles/compiled/nova.css";
```

此时不要再导入 `@ziioapp/ui/styles.css`。基础文件提供共享工具类与配色，每个风格文件提供对应的风格规则。

## 组件导入

通过独立子路径导入组件：

```tsx
import { Button } from "@ziioapp/ui/components/button";
import { Input } from "@ziioapp/ui/components/input";
import { Card, CardContent } from "@ziioapp/ui/components/card";
import { cn } from "@ziioapp/ui/lib/utils";
```

组件使用 **Base UI** API，自定义触发器时使用组件支持的 `render` API。Date Picker、Data Table 和 Typography 属于组合方案，不提供独立的通用组件导出。

## 本地开发

仓库采用 pnpm monorepo，组件库位于 `packages/ui`。

| 工具 | 版本 |
| --- | --- |
| Node.js | 24.19.0 |
| pnpm | 11.23.0 |
| TypeScript | 6.0.3 |
| Biome（全局） | 2.4.12 |

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm upstream:check
pnpm build
pnpm pack:ui
```

根 workspace 命令遍历各包；单独操作组件库可使用 `pnpm --filter @ziioapp/ui <command>`。`pack:ui` 完成校验后在 `artifacts/` 生成 tarball，不执行发布。

工作区导出指向源码，`pnpm pack` 将发布入口转换为编译后的 JavaScript、类型声明与 CSS。请使用 pnpm 打包此仓库。

### 上游维护

`packages/ui/upstream/lock.json` 记录源码版本及哈希。保持上游原件不变，审核升级候选后通过 `pnpm --filter @ziioapp/ui upstream:apply` 重新生成，并使用 `pnpm upstream:check` 校验。生成组件位于 `src/shadcn`；`src/components` 为历史参考文件，不对外导出。

构建还会生成本地 shadcn Registry 条目 `packages/ui/dist/registry/ziio-ui.json`，安装目标为消费项目的 `src/components/ziio-ui` 和 `src/styles/ziio-ui.css`。本仓库不提供托管 Registry 地址。

## 许可

[MIT](LICENSE) © ziioai。包含 shadcn/ui 代码并保留其原始版权声明，详见[第三方说明](packages/ui/THIRD_PARTY_NOTICES.md)。
