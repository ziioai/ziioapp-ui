# shadcn 拆包与组件 Registry 评估

> 【部分废弃】本报告关于“拆 `packages/ui` 值得做、registry 只作为分发层”的结论仍然有效；但对 create CLI 的影响评估不足。实测 shadcn monorepo 后，`packages/ui` 会把创建器从“复制单 app”推向“创建/管理规范 monorepo”。当前创建模式与推进清单以 [_reports/260617-06-模板创建模式重新定界.md](./260617-06-模板创建模式重新定界.md) 为准。

## 结论

建议把 shadcn 相关内容拆到独立 package，但要控制边界：第一阶段只拆 `components/ui`、`lib/utils`、shadcn 样式入口和设计 token，不要把业务组件、AppShell、finder、layout、pages 一起放进去。

也建议把组件库做成 shadcn GitHub registry，但它更适合作为“可选安装/升级/分发通道”，不应替代 `ziioapp` / `create-ziioapp` 创建器。CLI 负责创建完整应用，registry 负责分发 UI 组件、主题、约定文件和功能包。

## 对 shadcn monorepo 文档的判断

`shadcn-monorepo.mdx` 的核心信息是：shadcn CLI 已经理解 monorepo，可以在 app workspace 运行 `shadcn add`，然后把底层 UI 组件、依赖和 registry 依赖安装到 shared UI package，并自动处理 app 侧导入。

这正好匹配当前项目正在做的产品化方向：

- 当前仓库已经是 `apps/*` + `packages/*` 的 pnpm monorepo。
- 当前 `apps/base/components.json` 仍把 `ui` 指向 `@/components/ui`，把 `utils` 指向 `@/lib/utils`。
- 当前 shadcn 组件、`cn` 工具、`src/styles/shadcn.css` 仍在 app 内。
- 这会让模板使用者把“业务应用”和“供应商 UI 层”混在一起理解。

文档里生成示例使用 Turborepo，但本项目备注明确“实际使用不要擅自引入 Turborepo”。因此建议只采用 shadcn 的 workspace 布局和 `components.json` 约定，不引入 Turborepo。

## 是否应该拆成 packages/ui

建议拆。原因如下：

1. 符合 shadcn CLI 的 monorepo 支持方式。
2. 可以把 `components/ui` 明确标为 Vendor/UI Kit，而不是业务代码。
3. 有利于 blank/opfs/dashboard 等 preset 共用一份 UI 基础。
4. 有利于未来 `ziioapp add page`、`ziioapp add feature` 生成代码时统一导入路径。
5. 有利于将 UI kit 单独做 registry，让模板用户按需安装额外组件或主题。

但拆包不应该追求“一步到位全部搬走”。当前项目里很多组件虽然放在 `src/components`，但语义不同：

- `components/ui`：shadcn/Base UI 风格基础组件，适合拆到 `packages/ui`。
- `src/lib/utils.ts`：`cn` 工具，适合拆到 `packages/ui/src/lib/utils.ts`。
- `src/styles/shadcn.css`、`theme-base.css`、`bases/*`、`themes/*`、`charts/*`：可以拆到 `packages/ui/src/styles`，由 app 的 `index.css` 引入。
- `components/basic`、`components/elements`、`components/layouts`：更偏模板 shell，不建议第一阶段拆进 UI 包。
- `components/finder`：属于 opfs preset/feature，不应进入基础 UI 包。
- `components/pages`、`components/views`：属于应用页面，不应进入 UI 包。
- `components/aceternity`、`magicui`、`bits`：更像第三方示例或可选视觉包，不建议进入基础 UI 包。

## 建议的目标结构

```txt
apps/
  base/
    components.json
    src/
      styles/
        index.css
      components/
        basic/
        elements/
        layouts/
        pages/
        views/
        finder/
packages/
  ui/
    package.json
    components.json
    src/
      components/
        button.tsx
        card.tsx
        ...
      lib/
        utils.ts
      styles/
        shadcn.css
        theme-base.css
        bases/
        themes/
        charts/
```

推荐包名：

```json
{
  "name": "@ziioapp/ui",
  "private": true,
  "type": "module",
  "exports": {
    "./components/*": "./src/components/*.tsx",
    "./lib/*": "./src/lib/*.ts",
    "./styles/*": "./src/styles/*",
    "./styles.css": "./src/styles/shadcn.css"
  }
}
```

app 侧导入建议逐步变成：

```tsx
import { Button } from "@ziioapp/ui/components/button"
import { cn } from "@ziioapp/ui/lib/utils"
```

样式入口建议变成：

```css
@import "@ziioapp/ui/styles/shadcn.css";
@import "@ziioapp/ui/styles/theme-base.css";
```

如果 Vite/Tailwind 对 package CSS 子路径处理不理想，可以先保留 app 侧 `src/styles/index.css`，只把具体 token 文件放入 `packages/ui/src/styles`。

## components.json 应如何调整

app workspace 需要继续保留 `components.json`，但 aliases 应指向 shared UI package：

```json
{
  "aliases": {
    "components": "@/components",
    "hooks": "@/hooks",
    "lib": "@/lib",
    "utils": "@ziioapp/ui/lib/utils",
    "ui": "@ziioapp/ui/components"
  }
}
```

`packages/ui/components.json` 则用于告诉 shadcn CLI 在 UI 包内如何安装基础组件：

```json
{
  "aliases": {
    "components": "@ziioapp/ui/components",
    "utils": "@ziioapp/ui/lib/utils",
    "hooks": "@ziioapp/ui/hooks",
    "lib": "@ziioapp/ui/lib",
    "ui": "@ziioapp/ui/components"
  }
}
```

两边要保持一致的字段包括：

- `style`
- `iconLibrary`
- `tailwind.baseColor`
- Tailwind v4 下 `tailwind.config` 继续为空

当前项目使用 `style: "base-mira"`、`rsc: false`、`iconLibrary: "lucide"`，这些应同步到 app 和 UI package。

## 改动规模评估

> 【补充修正】本节列出的拆包工作仍有效，但遗漏了一个关键后果：只要 app 依赖 `@ziioapp/ui: workspace:*`，创建器就不能再只复制 `apps/base`。同时 app 根 `tsconfig.json` 必须暴露本地 alias，让 shadcn CLI 能把 block 写到 `src/components`，否则可能写成字面目录 `@/components`。

这是中等规模改造，不是简单移动目录。

主要工作：

1. 新增 `packages/ui` package、`components.json`、`package.json`、tsconfig。
2. 移动 `apps/base/src/components/ui/**` 到 `packages/ui/src/components/**`。
3. 移动 `apps/base/src/lib/utils.ts` 到 `packages/ui/src/lib/utils.ts`。
4. 评估并移动 shadcn 样式和主题 token。
5. 修改 app 侧所有 `@/components/ui/*` 和 `@/lib/utils` 导入。
6. 修改 `apps/base/components.json`。
7. 给 `apps/base/package.json` 增加 `@ziioapp/ui: workspace:*`。
8. 确认 Vite、TS、Tailwind v4、Electron renderer 都能解析 package exports。
9. 跑 `typecheck`、`build`、`build:electron`。

当前引用数量较多，`@/components/ui` 和 `@/lib/utils` 在 UI 组件内部、finder、layout、views、basic 组件中都有使用。机械替换不难，但需要注意 UI 包内部组件互相引用也要改成包内稳定路径。

建议把这个改造列为 P1，不要插到 P0 create CLI 之前。P0 配置中心已经完成，不受影响。

> 【废弃说明】“不要插到 P0 create CLI 之前”这个顺序判断已经废弃。实际拆包后，create CLI 的语义必须回头重定界：默认创建规范 monorepo，而不是单独 app。

## 是否应该做 GitHub registry

建议做，但作为第二阶段。

`shadcn-github-registries.mdx` 的关键点是：任何 public GitHub repo 只要在根目录提供 `registry.json`，就可以被 shadcn CLI 直接安装：

```bash
npx shadcn@latest add owner/repo/item
```

它不要求自建 registry server，也不要求预生成 JSON 文件。这对本项目非常合适，因为我们可以把组件、主题、约定文件、功能包都作为 registry item 暴露出去。

可行的 registry item：

- `ui-core`：基础 UI 组件、`cn`、核心样式。
- `theme-pack`：主题 token、chart token、主题 Provider 相关约定。
- `opfs-finder`：OPFS finder feature 文件。
- `electron-shell`：标题栏、Electron window shell、preload 类型声明。
- `project-conventions`：`AGENTS.md`、Biome/ESLint/README 约定。
- `app-config`：`ziioapp.config.ts` 示例和配置类型。

但 registry 不适合承担完整应用创建职责。完整创建仍需要：

- 项目目录创建。
- package manager 选择。
- preset 选择。
- 变量替换。
- 依赖瘦身。
- Electron/Web 目标选择。
- `.ziioapp/manifest.json` 写入。
- git/init/install 等流程。

这些是 `ziioapp` CLI 的职责，不是 shadcn registry 的强项。

## registry 怎么做

最小版本只需要在仓库根目录新增 `registry.json`：

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "ziioapp",
  "homepage": "https://github.com/ziioai/ziio-agent-app",
  "items": [
    {
      "name": "ui-core",
      "type": "registry:item",
      "title": "Ziio UI Core",
      "description": "Base UI + shadcn styled components for Ziio apps.",
      "files": [
        {
          "path": "packages/ui/src/components/button.tsx",
          "type": "registry:ui",
          "target": "@ui/button.tsx"
        },
        {
          "path": "packages/ui/src/lib/utils.ts",
          "type": "registry:lib",
          "target": "@lib/utils.ts"
        }
      ]
    }
  ]
}
```

这里建议优先使用 registry schema 支持的 target placeholder：

- `@ui/`：写入用户 `components.json` 里配置的 UI 目录。
- `@components/`：写入用户配置的普通组件目录。
- `@lib/`：写入用户配置的 lib 目录。
- `@hooks/`：写入用户配置的 hooks 目录。

不要用 `@utils/`，因为 shadcn schema 里 `utils` 是文件入口，不是目录 placeholder。`cn` 这类工具可以用 `@lib/utils.ts`。

实际建议不要把所有组件都塞进一个超大的 item。可以拆成：

- `button`
- `card`
- `field`
- `dialog`
- `menubar`
- `sonner`
- `theme-base`
- `theme-indigo`
- `opfs-finder`

如果某个 item 依赖另一个 item，可以用 `registryDependencies`。

随着 item 增多，建议使用 include：

```txt
registry.json
packages/ui/registry.json
features/opfs/registry.json
conventions/registry.json
```

根目录：

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "ziioapp",
  "homepage": "https://github.com/ziioai/ziio-agent-app",
  "include": [
    "packages/ui/registry.json",
    "features/opfs/registry.json",
    "conventions/registry.json"
  ]
}
```

## registry 改动大不大

第一版 registry 改动不大：可以先只新增 `registry.json`，选择少量稳定文件作为 item，然后跑：

```bash
npx shadcn@latest registry validate ziioai/ziio-agent-app
```

但如果想做成长期可维护的组件库 registry，改动会变大，因为要先解决这些问题：

- 文件路径要稳定，最好先完成 `packages/ui` 拆包。
- 组件内部导入路径要适配安装目标，不能只适配当前仓库。
- registry item 要声明依赖、registryDependencies、target。
- 大型 feature item 要避免覆盖用户已有业务文件。
- 需要决定 registry 安装目标是“普通 app 的 `src/components/ui`”还是“monorepo 的 `packages/ui`”。
- 发布命令最好使用 tag 或 commit SHA，保证可复现。

所以建议顺序是：

1. 先拆 `packages/ui`。
2. 再做 registry 的 `ui-core` 和少量基础组件。
3. 再把 OPFS finder、Electron shell 这类 feature 做成 registry item。
4. 最后让 `ziioapp add` 可以包装 shadcn registry 安装命令，给用户更稳定的体验。

## 对上一份报告的影响

> 【补充修正】本节当时只提出“目录结构升级为 monorepo workspace”，但没有充分展开“创建完整 monorepo”和“创建单独 app”是两种不同产品。现在应以 260617-06 的三种场景为准：从 0 创建规范 monorepo、在规范 monorepo 中新增 app、外部 monorepo 先诊断不默认写入。

上一份《模板产品化改造建议》的主线仍然成立，但需要补充三点。

第一，目录结构建议应从“app 内部划分”升级为“monorepo workspace 划分”。也就是除了 `apps/base`，还应明确 `packages/ui`、`packages/create-ziioapp`、未来可选的 `packages/ziioapp`。

第二，Managed/User/Vendor 边界要调整。`components/ui` 不再只是 app 内 vendor 目录，而应优先成为 `packages/ui` 这个 shared UI package。用户项目中如果选择复制式模板，也可以保留 `src/components/ui`；但模板仓库自身应使用 package 形态维护。

> 【废弃说明】“用户项目中如果选择复制式模板，也可以保留 `src/components/ui`”暂不作为当前推进事项。standalone / 复制式模板先不做。

第三，`ziioapp add` 不必全部手写生成逻辑。对于 UI 组件、主题、OPFS feature，可以复用 shadcn registry 作为底层分发机制。`ziioapp add` 负责更友好的参数、preset 判断、冲突检查和 manifest 更新。

## 建议更新后的优先级

### P0：配置中心

已经完成第一步。继续把更多运行期信息从配置读取。

### P0：create CLI

> 【废弃说明】create CLI 仍必要，但不再是“最小复制 app 模板”。它首先要支持创建 ziioapp 规范 monorepo，并正确包含 `packages/ui` 与 workspace manifest。

仍然是必要项。它解决完整应用创建问题，registry 替代不了。

### P1：拆出 `packages/ui`

这一步应放在 registry 之前。它能让 shadcn monorepo、依赖瘦身、preset 复用和 UI registry 都更顺。

### P1：preset 和依赖瘦身

> 【260617 二次修订】这里的“preset”不再指 app 复制/删文件方案。拆出 UI 包后，真正要清楚的是三层边界：`apps/base` 作为 blank 基础 app；`apps/demo-*` 作为可运行示例；`packages/*` / registry item 作为可复用能力。OPFS Finder 不应作为 `opfs preset` 直接注入新 app，而应先作为 demo，未来再评估是否拆为 feature package。

> 【补充，260617】第三方视觉组件已经不建议留在 `apps/base`，也不应塞入基础 `packages/ui`。Aceternity、Aceternity demo、React Bits、Magic UI 已按方向迁往独立 `packages/ui-3rd`：它们属于可选视觉素材包 / showcase 包，不进入 `blank` 或 `opfs` 默认 preset。这样 `packages/ui` 继续保持 shadcn/Base UI 基础层，`apps/base` 保持模板 app，`packages/ui-3rd` 承担重型视觉依赖边界。

### P2：GitHub registry

先做 UI core 和主题，再做 feature kits。不要一开始把整个 app 都 registry 化。

### P2：doctor/upgrade

manifest 需要知道哪些文件来自模板、哪些来自 registry、哪些属于用户业务。registry item 名称和 ref 可以记录进 `.ziioapp/manifest.json`，方便后续升级。

## 最终建议

拆 `packages/ui` 是值得的，它会让模板更像产品，而不是一个 app 仓库。GitHub registry 也值得做，但它应该是 UI/feature 分发层，而不是创建器本身。

最稳的路线是：

1. 保持现有 P0 配置中心。
2. 先做 create CLI 的最小版本。
3. 拆 `packages/ui`，接入 shadcn monorepo components.json。
4. 做最小 registry，只发布少量稳定 UI item。
5. 让 `ziioapp add` 在背后调用或兼容 shadcn registry。

> 【废弃说明】以上路线中的第 2 步已经过时。新的顺序应先完成“创建模式重新定界”，再实现 create CLI 的 monorepo init，而不是继续沿用复制单 app 的最小版本。

这样既不会让当前模板产品化路线失焦，也能把 shadcn 生态的新能力变成未来升级和扩展的杠杆。
