# UI 包 Tailwind 扫描修复记录

## 问题

删除 `apps/base/src/components/ui` 后，dev 中基础字体、背景、尺寸等样式看起来失效，但主题配色仍能生效。

根因是：主题变量通过 `@import "@ziioapp/ui/styles/shadcn.css"` 仍然进入了 app CSS，所以配色变量还在；但 Tailwind v4 的 utility 扫描没有包含 `packages/ui/src/components`，导致 UI 包组件里使用的 class 没有被生成。

一个明显信号是：删除重复组件后 Web build 的主 CSS 从约 207KB 降到约 79KB。

## 修复

在 `packages/ui/src/styles/shadcn.css` 增加：

```css
@source "../components";
```

这样 UI 包自带自己的 Tailwind source 声明。app 只需要继续 import UI 包样式，不需要硬编码 `../../../../packages/ui/src` 这类路径。

## 验证

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm build` 的主 CSS 恢复到约 207KB。
- `pnpm build:electron` 通过。

## 备注

这次修复说明：拆出 `packages/ui` 后，组件文件迁移只是第一步；Tailwind v4 的扫描边界也必须跟着迁移，否则变量会在、utility 会缺。
