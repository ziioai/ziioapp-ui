# Changelog

## 0.3.0 — 2026-09-18

- 将 Web 主题初始化脚本从 `AppLoadingView` 迁移到消费端文档 `<head>`，消除重复脚本和 `<html>` hydration mismatch；Framework 升级至 `0.3.0`。
- `AppLoadingView` 恢复为纯加载视图，不再接受 `initialTheme`；消费端必须在根文档挂载 `ThemeScript` 并为 `<html>` 设置 `suppressHydrationWarning`。
- `@ziioapp/vite-plugin-theme` 升级至 `0.1.2`，扩展 Framework peer 范围至 `^0.3.0`。

## 0.2.2 — 2026-09-18

- 将 Framework 设置页的偏好开关改为官方横向 Field 组合，避免窄容器下 Switch 被拉伸为整行宽度；`@ziioapp/framework` 升级至 `0.2.1`。

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
