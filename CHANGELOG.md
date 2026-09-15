# Changelog

## 0.2.1 — 2026-09-15

- 将 `@ziioapp/ui/lib/feedback` 的内部实现从 Sonner 切换为 Base UI Toast，并保留现有 `notify` 调用入口。
- 更新主题插件的 Framework peer 范围，使其兼容 `@ziioapp/framework@0.2.0`。

## 0.2.0 — 2026-09-15

- 新增统一瞬时反馈入口 `@ziioapp/ui/lib/feedback`，将 Sonner 保持为 UI 包内部实现。
- 移除源码样式入口中的硬编码页面底色与全元素 transition，页面视觉状态改由消费方主题和组件负责。

## 0.1.0 — 2026-09-13

- 从 ziio-agent-app 迁入 @ziioapp/ui。
- 包含 62 个官方 Base UI 基础组件、8 套风格、24 套主题。
- 提供 ESM、TypeScript declarations、全量及按风格 CSS、独立 Registry。
- 保留官方源码、锁定版本、哈希与生成流程。
