# Webapp Components 本地迁移版

版本：`@ziioapp/webapp-components@0.1.1-local.1`。

## 已完成

- 迁入搜索、密钥、组合头像、未读徽章、设置分组与表单行、设置导航、搜索标题栏、渐变模糊与防误触、受控明暗切换、可展开说明、Promise 确认和可滚动对话框内容区。
- 增强现有 ConversationItem 与 Composer，保留原接口；提供完整 MessageComposer。
- 整理 ThemePreview 和数据化 SelectChoice／SegmentedChoice。
- 内部可定制区域独立导出，支持 className、原生属性及 React 19 ref；组合官方 UI 基础组件，不增加样式参数或 xxxClassName 参数组。
- 完整／分层用法见包内 README、examples/migration-showcase.tsx 和 examples/migration-layered.tsx。未迁移 SettingsPage、SettingsDialog 的页面壳。

## 验证

- 上游工作区 `pnpm typecheck`：六个包全部通过。
- `biome check packages/webapp-components`、`git diff --check` 通过。
- 包 `prepack` 类型检查和构建通过，ESM、声明文件、CSS、hooks 子路径齐全；所有相对 JS 导入能解析，tarball 不包含 TSX、应用业务代码或 Continuity 依赖。
- 独立 Chromium 预览检查了 Rhea、Vega、Nova、Maia、Lyra、Mira、Luma、Sera × 亮暗 × 320／1024 CSS 像素，合计 32 组；每组检查搜索展开与设置区。未发现横向溢出。
- 搜索栏采用实际高度测量。不同风格展开后总高度约 120–132px，渐隐尾部落在搜索框下方的实际留白；静止时下方内容从遮罩结束处开始。另检查了滚动后效果。
- 0／1／2／3／4／8 人头像布局与边框一致；个位徽章实测宽高相等，多位及 99+ 自动扩宽。
- Escape 关闭搜索、清空并归还焦点；显隐不改密钥；Enter 仅发送一次、Shift+Enter 换行、IME 组合阶段不发送；停止生成保留新草稿；长输入增高至上限后滚动。
- 确认对话框聚焦内部，Escape 返回 false、确认返回 true；展开说明使用高度过渡。键盘选择和 reduced-motion 降级另行检查。
- 解包后的实际 ESM/CSS 在独立预览正常加载，搜索测量与组件样式正常。

验证使用独立示例页面，不涉及 Continuity 业务数据；此次未进行 Safari/Firefox 真机验证。

## 交付边界

本地 tarball 放入 Continuity `.local-packages/ziioapp-webapp-components-0.1.1-local.1.tgz`。

按用户要求，以下等待下一次口令：修改 Continuity 依赖和锁文件、替换引用或转导出、删除重复实现，以及应用类型检查、lint 与业务页面回归。本次未发布 npm、未提交 Git。
