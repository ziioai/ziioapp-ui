# @ziioapp/webapp-components

基于正式 `@ziioapp/ui` 的移动 Web 组合组件。使用 React 19、Base UI 的 `render` 组合接口和现有主题 token，不复制上游基础组件。

工作区开发时按子路径导出 TSX 源码；发布到 npm 时先构建为 ESM JavaScript 和 TypeScript 声明文件。宿主无需编译本包的 TSX，但需使用 Tailwind CSS v4 处理包内样式入口。它不依赖仓库内部路径别名，不是运行时 SSR 服务，也不包含主题 Provider、路由器、账号、网络请求、上传或本地数据库。

## 接入

从 npm 安装使用 `pnpm add @ziioapp/webapp-components @ziioapp/ui react react-dom tailwindcss`；本 monorepo 内使用 `"@ziioapp/webapp-components": "workspace:^"`。`@ziioapp/ui`、`react`、`react-dom`、Tailwind CSS v4 是 peer dependencies；拖拽、图像浏览等实现依赖由本包安装。

在宿主 Tailwind 样式入口中，沿用已有的主题和官方 UI 样式，再引入：

```css
@import "@ziioapp/webapp-components/styles.css";
/* 使用图片浏览器时额外引入；其他组件不会自动加载 lightbox CSS。 */
@import "@ziioapp/webapp-components/styles/image-viewer.css";
```

`styles.css`（也可用 `styles/source.css`）含包内组件的 `@source` 声明和局部布局规则，不修改 html/body、不安装 reset、不注入主题、不改变全站骨架屏策略。`image-viewer.css` 引入 lightbox 引擎样式。宿主仍需保证 Tailwind 能扫描自己的源码。

```tsx
import { FormField } from "@ziioapp/webapp-components/components/form-field";
import { Input } from "@ziioapp/ui/components/input";

<FormField id="name" label="名字" error={error}>
  {(control) => <Input {...control} value={name} onChange={onChange} />}
</FormField>
```

## 组件目录

| 子路径 | 导出与职责 |
| --- | --- |
| `components/mobile-page` | `MobilePage`、`MobilePageContent`、`MobileViewport`：居中容器、内容间距、跟随键盘的固定视口 |
| `components/page-header` | `PageHeader`、`PageHeaderTitle`、`PageHeaderActions`：页面头部插槽 |
| `components/floating-bar` | `FloatingBar`：悬浮位置与安全区域 |
| `components/property-list` | `PropertyList`、`PropertyListSeparator`、`PropertyRow`、`PropertyRowLabel`、`PropertyRowValue`、`PropertyRowAction`：资料摘要行 |
| `components/form-field` | `FormField`、`FormFieldProps`、`FormFieldControlProps`：基于官方 Field 的完整字段组合 |
| `components/input-drawer` | `InputDrawer`、`InputDrawerBody`、`InputDrawerActions`：使用 react-bottom-fixed 的键盘安全输入抽屉 |
| `components/masonry` | `Masonry<T>`：按实际高度排列，保留 DOM 阅读顺序 |
| `components/media-picker` | `MediaPicker`：本地文件选择和可选预览、移除入口 |
| `components/media-collection` | `MediaCollection<T>`：预览、删除、替换与 dnd-kit 排序 |
| `components/media-slideshow` | `MediaSlideshow<T>`：轮播、暂停、减少动态效果、页面不可见时暂停 |
| `components/image-viewer` | `ImageViewer`、`ViewerSlide`：基于 yet-another-react-lightbox 的图片浮层 |
| `components/composer` | `Composer`、`ComposerInput`、`ComposerActions`、`ComposerSubmit`：官方 InputGroup 的消息输入组合 |
| `blocks/bottom-navigation` | `BottomNavigation`、`BottomNavigationItem`：使用链接语义的悬浮导航内容 |
| `blocks/conversation-item` | `ConversationItem`：头像、标题、摘要、时间、标记和尾部插槽 |
| `blocks/media-card` | `MediaCard`、`MediaCardContent`：媒体卡片容器与内容区 |

## 状态与边界

- `PropertyRow` 默认是静态容器；交互时传 `render={<button type="button" />}` 或链接。不在整行按钮内嵌其他按钮。`placeholder` 由应用明确提供；数字 `0` 不视为空值。
- `FormField` 继承官方 Field 的排版，提供 `orientation` 等属性。函数子节点提供控件 id、disabled、aria-invalid、aria-describedby；普通子节点兼容复杂组合，但宿主需将对应属性设置到真正的控件上。相关字段外层继续用官方 `FieldGroup`。
- `InputDrawer` 接受官方 Drawer 的受控/非受控属性。必须提供 `title`、`closeLabel`；`contentProps` 可传初始和返回焦点。是否允许关闭、是否保存、何时结束 busy，由调用者决定。长表单继续使用独立页面。
- `Masonry` 接受 `items`、`getItemKey`、`renderItem`、`columns`（默认 2）、`gap`（默认 12）。服务端先输出网格，客户端测量后排列，不承担分页请求。
- `MediaPicker` 将文件交给 `onFilesSelected`，宿主负责校验、错误处理与 busy 状态。不会擅自创建 Blob URL 或上传。预览通过 children 注入。
- `MediaCollection` 接受受控 `value/onValueChange`，排序只在放下时提交，Escape 取消不会修改值。稳定 key 不使用数组下标。拖拽只由手柄启动，支持鼠标、触摸和键盘。查看和替换通过回调，添加使用旁边的 `MediaPicker`。
- `MediaSlideshow` 支持 `index/onIndexChange` 或 `defaultIndex`。`renderItem(item, { index, playing })` 负责实际媒体元素，视频应同步 `playing` 状态。组件不预载远端媒体；调用者管理缓存和资源租约。
- `ImageViewer` 使用受控 `open/onOpenChange` 和 `index/onIndexChange`。传入已解析的图片 URL（可为 Blob URL），`src: ""` 表示加载中，`error: true` 表示解析失败；`onExited` 在关闭动画后调用。`labels` 可覆盖引擎和工具按钮文案（包含 `Loading` / `Unavailable`）。URL 应在退出完成后再释放。
- `ComposerInput` 保留多行 Enter，支持 Ctrl/Cmd+Enter，避免中文输入法组合阶段误发。发送、限长、清空输入、身份权限由宿主控制。
- 导航用 `render` 注入宿主链接并设置 `nativeButton={false}`；容器的 `value` 指定当前路由项，每项通过 `value` 对应。完整复用官方 TabsList / TabsTrigger 的主题样式，只覆盖布局；不叠加 Button 配色或固定圆角、阴影。不依赖任何路由包。

几何参数通过 CSS 自定义属性调整：`--mobile-page-width`、`--floating-bar-width`、`--floating-bar-height`、`--floating-bar-bottom`、`--floating-bar-clearance`、`--property-label-width`。`MobilePage` 内置最大宽度 768px，宿主按页面需要预留 `--floating-bar-clearance`，避免自动给聊天或二级页面塞入 dock 空间。

## 抓抓应用中的适配层

- `social/profile-row.tsx`：未填写/未选择等业务文案与打开字段。
- `social/field-drawer.tsx`：草稿应用和取消，保存成功后关闭。
- `social/character-media-field.tsx`、`card-media-drawer.tsx`：格式/大小/数量限制、OPFS 暂存、动态视频关联。
- `social/character-card.tsx`：媒体 ID、预载、头像和资料、抓/略过手势、资料路由。
- `social/image-viewer.tsx`：缓存权限校验和 Blob URL 租约，传解析结果给纯 UI。
- 圈友/聊天/动态页面继续拥有业务请求、权限、分页和身份筛选。

抓抓卡第一项是首图、全身形象是单独字段，这些约束不进入组件库。

## 示例与检查

`examples/profile-editing.tsx`、`examples/media-editing.tsx`、`examples/conversation.tsx` 是参与类型检查的组合示例，不进入 npm tarball，也不是生产页面或测试数据。

```sh
pnpm --filter @ziioapp/webapp-components typecheck
pnpm --filter @ziioapp/webapp-components build
pnpm pack:webapp-components
```

发布产物位于 `dist/`，`pnpm pack:webapp-components` 会生成 `artifacts/ziioapp-webapp-components-0.1.1-local.3.tgz`。包的公开 JS、类型和 CSS 路径均指向 `dist/`；源码、示例与脚本不会进入 tarball。不提供根 barrel，避免只用表单时意外加载图片浏览器或拖拽模块。不复制官方 Button、Field、Item、Avatar、Message 等基础组件。

## 0.1.1 本地迁移版

所有新组件以 `className` 定制对应 DOM 层，并传递该层原生属性与 React 19 ref；需要调整内部区域时组合以下部件，不提供成套 `xxxClassName` 或颜色、间距样式参数。完整组合与分层组件使用同一实现。

| 子路径 | 完整组合 | 可组合部件／基础组件 |
| --- | --- | --- |
| `components/search-input` | `SearchInput` | `SearchInputRoot/Control/Icon/Action/Clear/Close`；尾部使用官方 `InputGroupAddon` |
| `components/secret-input` | `SecretInput` | `SecretInputRoot/Control/Toggle`；显隐由宿主管理 |
| `components/participant-avatar` | `ParticipantAvatar` | `Frame/Grid/Cell/Image/Fallback/Overflow`（均以 `ParticipantAvatar` 为前缀） |
| `components/unread-badge` | `UnreadBadge` | 继承 `Badge` 属性，零值隐藏、个位正圆、默认上限 99、读屏保留真实数量 |
| `components/settings-layout` | `SettingsGroup/SettingsRow/SettingsField` | `SettingsGroupRoot/Title/Content`、`SettingsSeparator`、`SettingsRowRoot/Content/Control/Actions`；复用官方 Field 各层 |
| `components/settings-navigation` | `SettingsNavigationGroup/Item` | `SettingsNavigationRoot/ItemRoot/Label/Trailing/Arrow`；链接通过 Button 的 render 传入 |
| `blocks/searchable-page-header` | `SearchablePageHeader` | `SearchHeaderRoot/Backdrop/TouchGuard/Trigger/Search/SearchClip/SearchContent/Close`；标题行用现有 `PageHeader/Title/Actions` |
| `components/faded-backdrop` | — | `FadedBackdrop` 视觉层、`TouchGuard` 交互阻挡层 |
| `blocks/bottom-navigation-backdrop` | `BottomNavigationBackdrop` | `BottomNavigationBackdropSurface/BottomNavigationBackdropTint/BottomNavigationTouchGuard`；放入现有 `FloatingBar`，再放导航或操作内容 |
| `components/theme-mode-button` | `ThemeModeButton` | 标准 Button 属性，受控 `mode/onToggle`，不读写主题或存储 |
| `components/expandable-note` | `ExpandableNote` | `ExpandableNoteRoot/Header/Trigger/Title/Arrow/Content/Body`，基于 Collapsible 与 Marker |
| `hooks/use-confirmation` | `useConfirmation` | Promise 状态与 UI 分离；替换请求或卸载时旧 Promise 返回 false |
| `components/confirmation-dialog` | `ConfirmationDialog` | 默认 AlertDialog 组合；原生属性、className/ref 指向 Content；完全自定义时直接组合官方 AlertDialog 部件 |
| `components/dialog-body` | — | `DialogBody` 仅负责可滚动内容区域，和官方 Dialog 各层组合 |
| `blocks/message-composer` | `MessageComposer` | 使用现有 Composer 各层；新增 `ComposerStop`，不接入业务发送逻辑 |
| `blocks/theme-preview` | `ThemePreview` | `ThemePreviewSwatch/Palette/Accents/Charts/Badges/Actions`；其余使用官方 Card 各层 |
| `components/choice` | `SelectChoice/SegmentedChoice` | 数据化选项组合；内部定制直接使用官方 Select/ToggleGroup 各层 |

### 行为与兼容约定

- `SearchInput` 的 `className`、ref 和原生输入属性指向输入元素。`trailingAction.kind` 区分清空与关闭；只读时禁止清空但可以关闭。`SecretInput` 保留原生 `value/onChange`，另用 `visible/onVisibleChange` 控制显隐。组外框、附加区域用分层部件定制。
- `ParticipantAvatar` 接收已经解析好的 `{id,name,imageUrl?}[]`；不读取角色卡、文件或数据库。0/1 人单格，2 人左右，3 人左大右两格，4 人四格，更多人前三格加余数。单人与多人共享真实边框，内部无独立圆角。
- `SearchHeaderRoot` 受控开合。展开聚焦输入；Escape／关闭操作归还触发器焦点。闭合内容 inert；CSS grid 动画自然占位，ResizeObserver 根据实际控件与留白更新透明度曲线，不写入固定输入高度。布局依赖 `SearchHeaderSearchContent` 和 InputGroup 的标准槽位，定制时保留这些部件。
- 视觉层均不截获事件；独立 TouchGuard 阻挡背景误触。默认遮罩与动画沿用 Continuity 已确认效果，几何与颜色可以在各层直接用 Tailwind class 修改。
- `ConversationItem` 原有 `avatar/title/preview/time/badge/trailing` 不变。新增 `titleBadge` 与 `previewTrailing`；使用新插槽时头像居中。`badge` 仍在摘要下方。也可用 `ConversationItemRoot/Avatar/Content/TitleRow/TitleGroup/Title/PreviewRow/Preview/Actions` 分层组合。
- `ComposerInput.submitShortcut` 支持 `mod-enter`（兼容旧默认）、`enter`、`none`；Shift+Enter 换行，输入法组词阶段不会发送。自动高度由 `field-sizing-content` 实现，超出最大高度滚动并使用 scroll-fade。`MessageComposer` 默认 Enter 发送，快捷键与按钮统一进入原生 form 提交流程。
- `MessageComposer` 不清空草稿、不等待网络、不根据内容猜测发送资格。`editable` 管理能否编辑，`active` 管理发送／停止操作，`canSubmit` 由应用业务规则提供。`onSend(value)` 后何时清空、失败如何恢复，仍由应用决定。form 的原生 id/ref 等保持原义。
- 不提供 SettingsPage；页面使用现有 MobilePage、PageHeader、内容组件组合。不迁移 SettingsDialog 的页面壳、路由和业务状态。

### 完整组合与分层示例

- [migration-showcase.tsx](examples/migration-showcase.tsx)：完整组合、旧新 ConversationItem 接口、消息发送／停止、Promise 确认、独立 DialogBody、主题预览与浮动栏。
- [migration-layered.tsx](examples/migration-layered.tsx)：搜索、密钥、头像、设置、说明、标题栏、会话条目和消息输入的内部区域组合。
- 二者参与包的 TypeScript 检查；运行时主题、业务状态与存储均由宿主提供。

本地包版本为 `0.1.1-local.3`。此阶段仅构建、打包并将 tarball 放入 Continuity 的 `.local-packages`；应用依赖与本地组件替换是独立的后续步骤。
