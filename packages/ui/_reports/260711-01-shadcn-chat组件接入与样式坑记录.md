# 背景

- 目标：
  - 将 shadcn 2026-06 chat components 接入 `@ziioapp/ui` 包，作为后续聊天界面备用组件。
  - 在 `ziioui-storybook` 中新增完整演示页，展示这些组件组合成真实聊天应用界面的方式。
  - 验证 `scroll-fade` 与 `shimmer` 这两个 shadcn 新 utility 是否真实生效。

- 参考资料：
  - `_outer_docs/shadcn-chat/2026-06-chat-components.mdx`
  - `_outer_docs/shadcn-chat/message-scroller.mdx`
  - `_outer_docs/shadcn-chat/message.mdx`
  - `_outer_docs/shadcn-chat/bubble.mdx`
  - `_outer_docs/shadcn-chat/attachment.mdx`
  - `_outer_docs/shadcn-chat/marker.mdx`
  - `_outer_docs/shadcn-chat/scroll-fade.mdx`
  - `_outer_docs/shadcn-chat/shimmer.mdx`

# 已接入的 UI 组件

- 新增到 `packages/ui/src/components`：
  - `message-scroller.tsx`
  - `message.tsx`
  - `bubble.tsx`
  - `attachment.tsx`
  - `marker.tsx`

- 组件来源：
  - 使用 `shadcn` CLI 针对 `packages/ui` workspace 添加。
  - CLI 过程中提示 `button.tsx` 已存在。
    - 处理方式：拒绝覆盖既有 `Button`。
    - 原因：`@ziioapp/ui` 已有 Base UI 风格 Button，不能被 chat 组件安装过程顺手覆盖。

- 新增依赖：
  - `@shadcn/react`
    - 用于 `message-scroller` 的 headless scroll behavior。

# Storybook 演示页

- 新增页面：
  - `apps/ziioui-storybook/src/components/pages/chat-page.tsx`

- 新增路由：
  - `apps/ziioui-storybook/src/routes/_app/chat.tsx`
  - 路径：`/chat`

- 导航入口：
  - `apps/ziioui-storybook/ziioapp.config.ts`
    - main menu 增加 `Chat Components`
  - `apps/ziioui-storybook/src/components/pages/home-page.tsx`
    - 首页增加进入 `/chat` 的入口。

- 页面定位：
  - 不是 API 列表。
  - 不是 `BasicTitledPage` 包裹的文档页。
  - 是一个完整聊天工作区：
    - 左侧 conversation list。
    - 中间 chat transcript。
    - 底部 composer。
    - 右侧 thread state / utilities panel。

# 页面结构调整

- 已移除：
  - `BasicTitledPage`
  - 外层大卡片壳。
  - 额外阴影和过度装饰。
  - 自己加工的头像 fallback 彩色样式。

- 当前高度策略：
  - 页面根使用 `h-full min-h-0`。
  - 不再使用 `h-[calc(100vh-...)]` 硬猜高度。
  - 依据 `AppShell -> MyFramedBox` 已提供的 `h-full` 高度链路。

- 当前头像策略：
  - 参考官方示例结构：
    - `Avatar`
    - `AvatarImage`
    - `AvatarFallback`
  - 当前示例路径：
    - `/avatars/10.png`
    - `/avatars/02.png`
  - 当前项目暂无真实 avatar 资源时，fallback 负责兜底。

# Chat 组件展示点

- `MessageScroller`
  - 用作完整 transcript 容器。
  - 使用 `MessageScrollerProvider`。
  - 使用 `scrollPreviousItemPeek={56}`。
  - 用户消息所在 turn 使用 `scrollAnchor`。
  - 保留 `MessageScrollerButton` 用于滚动回最新/边界控制。

- `Message`
  - 用作消息行布局。
  - 展示 start/end 对齐。
  - 展示 avatar/header/content/footer。

- `Bubble`
  - 展示多种变体：
    - `default`
    - `secondary`
    - `ghost`
    - `outline`
    - `tinted`
  - 展示 `BubbleGroup`。
  - 展示 `BubbleReactions`。
  - 展示 `BubbleContent render={<button />}` 的交互内容形式。

- `Attachment`
  - 展示 `AttachmentGroup`。
  - 展示不同 attachment 状态：
    - `done`
    - `processing`
    - `error`
  - 展示 horizontal / vertical 两种 orientation。
  - 展示 `AttachmentAction`。
  - 展示 `AttachmentTrigger`。

- `Marker`
  - 展示 date separator。
  - 展示 bordered status row。
  - 展示 `role="status"` streaming marker。
  - 展示 shimmer 状态文本。

# scroll-fade 与 shimmer

- 文档要求：
  - `scroll-fade`
    - 用于滚动容器边缘渐隐。
    - 支持 y/x 方向。
    - 支持 `scroll-fade-t/b/s/e-*` 尺寸控制。
  - `shimmer`
    - 用于流式状态文本。
    - 支持 `shimmer-duration-*`。
    - 支持 `shimmer-spread-*`。
    - 支持 `shimmer-once`。
    - 支持 `shimmer-reverse`。

- 当前页面使用：
  - `MessageScrollerViewport`
    - 组件内部自带 `scroll-fade-b`。
  - `AttachmentGroup`
    - 组件内部自带 `scroll-fade-x`。
  - conversation list 滚动区：
    - `scroll-fade`
  - 右侧状态栏滚动区：
    - `scroll-fade scroll-fade-t-2 scroll-fade-b-8`
  - streaming marker：
    - `shimmer`
  - 右侧 utility panel：
    - `shimmer shimmer-duration-1000 shimmer-spread-24`
    - `shimmer shimmer-once shimmer-duration-1100`
    - `shimmer shimmer-reverse`
  - `AttachmentTitle`
    - 在 `processing` / `uploading` 时由组件内部自动加 shimmer。

# 样式坑

- 坑 1：误以为类名写上就等于样式生效。
  - 实际问题：
    - 页面里有 `.shimmer` / `.scroll-fade` 类名。
    - 浏览器 computed style 一开始显示：
      - `animationName = none`
      - `maskImage = none`
      - `backgroundClip = border-box`
  - 结论：
    - 类名存在不代表 Tailwind utility 已生成。
    - 必须用浏览器 computed style 验证。

- 坑 2：错误地在 app 侧直接扫别的包源码。
  - 错误写法：
    - `@source "../../../../packages/ui/src";`
  - 问题：
    - app 样式文件越过包边界，直接引用 workspace 内部相对路径。
    - 维护上不稳定，也破坏包的自描述能力。
  - 正确做法：
    - 在 `@ziioapp/ui` 包内提供公开 source 入口：
      - `packages/ui/src/styles/source.css`
      - 内容：`@source "../";`
    - app 侧通过包名导入：
      - `@import "@ziioapp/ui/styles/source.css";`

- 坑 3：`shadcn` 版本太旧。
  - 旧状态：
    - workspace package.json 里普遍是 `shadcn: ^4.7.0`
    - lock 解析到 `shadcn@4.7.0`
  - 问题：
    - `shadcn@4.7.0` 的 `dist/tailwind.css` 不包含 `scroll-fade` / `shimmer`。
    - 文档中说这两个 utility 来自 `shadcn/tailwind.css`，但旧版本并没有。
  - 修复：
    - 全 workspace 更新到 `shadcn@4.13.0`。
    - 当前 `npm view shadcn version` 为 `4.13.0`。
    - 当前 lock 已解析到 `shadcn@4.13.0`。
  - 结果：
    - `shadcn@4.13.0/dist/tailwind.css` 已包含官方 `scroll-fade` / `shimmer`。

- 坑 4：不要手写官方 utility 的重复实现。
  - 曾短暂手补：
    - `@utility shimmer`
    - `@utility scroll-fade`
    - `@keyframes tw-shimmer`
  - 纠正：
    - 升级到 `shadcn@4.13.0` 后删除重复实现。
    - 保留 `@import "shadcn/tailwind.css";` 作为唯一来源。

# 当前样式入口

- `packages/ui/src/styles/shadcn.css`
  - 保留：
    - `@import "tailwindcss";`
    - `@import "tw-animate-css";`
    - `@import "shadcn/tailwind.css";`
    - `@import "@fontsource-variable/inter";`
    - `@source "../components";`

- `packages/ui/src/styles/source.css`
  - 新增：
    - `@source "../";`

- `apps/ziioui-storybook/src/styles/index.css`
  - 当前导入：
    - `@import "./theme.gen.css";`
    - `@import "@ziioapp/ui/styles/source.css";`
    - `@import "@ziioapp/ziioui/styles/source.css";`
    - `@source "../";`

# 版本更新

- 已统一更新 workspace app 中的 `shadcn`：
  - 从 `^4.7.0`
  - 到 `^4.13.0`

- 涉及 app：
  - `apps/base`
  - `apps/demo-2d-game`
  - `apps/demo-chat-viewer`
  - `apps/demo-landing-components`
  - `apps/demo-ling-tools`
  - `apps/demo-loveofqshow`
  - `apps/demo-ocr`
  - `apps/demo-opfs-finder`
  - `apps/demo-paper-town-babylon`
  - `apps/demo-tools`
  - `apps/demo-treasure`
  - `apps/ziioui-storybook`

# 实际验证

- 静态检查：
  - `biome check packages/ui/src/styles/shadcn.css packages/ui/src/styles/source.css apps/ziioui-storybook/src/styles/index.css apps/ziioui-storybook/src/components/pages/chat-page.tsx`
  - 结果：通过。

- 类型检查：
  - `pnpm --filter @ziio-agent-app-monorepo/ziioui-storybook typecheck`
  - 结果：通过。

- 浏览器 computed style 验证：
  - `.shimmer`
    - `animationName = tw-shimmer`
    - `animationDuration = 2s`
    - `backgroundClip = text`
    - `webkitTextFillColor = rgba(0, 0, 0, 0)`
  - `.scroll-fade-b`
    - `maskImage` 已存在。
    - `animationName = scroll-fade-reveal-b`
    - `animationTimeline = scroll(self y)`
  - `.scroll-fade-x`
    - `maskImage` 已存在。
    - `animationName = scroll-fade-reveal-s, scroll-fade-reveal-e`
    - `animationTimeline = scroll(self inline), scroll(self inline)`

# 遗留注意

- `@ziioapp/ui` 全包 typecheck 仍可能被既有组件问题挡住。
  - 已观察到的旧问题位置：
    - `chart.tsx`
    - `field.tsx`
    - `toggle-group.tsx`
  - 这些不是 chat components 本轮新增导致。

- `/avatars/10.png` 和 `/avatars/02.png` 当前只是按官方示例路径使用。
  - 如果项目需要真实头像展示，需要补 public 资源。
  - 否则 fallback 会正常兜底。

- `shadcn` CLI 在不同调用方式下有差异。
  - `pnpm --filter @ziioapp/ui dlx ...` 在当前 pnpm 版本中会出现参数问题。
  - 实际可用方式：
    - `npm exec --yes shadcn@latest -- add ... -c packages/ui`
  - 遇到覆盖基础组件提示时，需要明确拒绝覆盖已有组件。

# 当前结论

- chat components 已进入 `@ziioapp/ui`。
- `ziioui-storybook` 已有 `/chat` 综合演示页。
- `scroll-fade` / `shimmer` 已确认真实生效。
- 样式 source 扫描已按包边界修正。
- `shadcn` 已升级到包含新 utilities 的 `4.13.0`。
