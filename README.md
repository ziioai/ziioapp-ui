# @ziioapp/ui

[English](README.md) | [简体中文](README-cn.md) · [npm](https://www.npmjs.com/package/@ziioapp/ui)

React components built on Base UI and a pinned shadcn/ui source baseline, with runtime styles and color palettes. Maintained by **ziioai**.

## Features

- 62 Base UI components with ESM exports and TypeScript declarations.
- 8 styles: Vega, Nova, Maia, Lyra, Mira, Luma, Sera, and Rhea.
- 24 theme palettes, light and dark modes, and chart colors.
- Switch styles with a body class without remounting components.
- Full or per-style precompiled CSS. No Tailwind build is required to use the precompiled styles.
- Lucide icons; no bundled fonts or additional icon families.
- Locked upstream sources, file hashes, and a reproducible generation workflow.

## Install

```sh
pnpm add @ziioapp/ui react react-dom
```

Requires React and React DOM **19.2.4 or later within React 19**. The package is ESM-only. Tailwind CSS is optional when using precompiled CSS; source CSS requires Tailwind CSS 4.3.

## Quick start

Import the stylesheet once in your application entry:

```tsx
import "@ziioapp/ui/styles.css";
import { Button } from "@ziioapp/ui/components/button";

export function App() {
  return <Button>Get started</Button>;
}
```

Set the initial theme classes in your HTML before the first paint:

```html
<html class="light base-color-zinc theme-color-indigo">
  <body class="style-mira">
    <div id="root"></div>
  </body>
</html>
```

Use `dark` instead of `light` for dark mode. The full stylesheet includes a Tailwind reset, component utilities, default Zinc variables, all official palettes, and all eight styles. It does not include font files or generate utilities for your own application markup.

## Styles and colors

Place one `style-*` class on `body`; place `base-color-*`, `theme-color-*`, and optional `chart-color-*` classes on `html`. Replace the previous class in each category when switching. Portaled components share the document's body style.

```js
document.body.classList.replace("style-mira", "style-nova");
document.documentElement.classList.replace("light", "dark");
document.documentElement.classList.replace(
  "theme-color-indigo",
  "theme-color-emerald",
);
```

Available styles: `vega`, `nova`, `maia`, `lyra`, `mira`, `luma`, `sera`, `rhea`.

Base colors: `neutral`, `stone`, `zinc`, `mauve`, `olive`, `mist`, `taupe`.

Theme colors: `neutral`, `stone`, `zinc`, `mauve`, `olive`, `mist`, `taupe`, `amber`, `blue`, `cyan`, `emerald`, `fuchsia`, `green`, `indigo`, `lime`, `orange`, `pink`, `purple`, `red`, `rose`, `sky`, `teal`, `violet`, `yellow`.

Programmatic palette and style lists are available from `@ziioapp/ui/lib/official-themes`. Local component `size` props remain independent of the global style. Theme persistence and system color-scheme detection belong to the consuming application.

### Load only the styles you need

Replace the full stylesheet import with the base CSS and selected styles:

```tsx
import "@ziioapp/ui/base.css";
import "@ziioapp/ui/styles/compiled/mira.css";
import "@ziioapp/ui/styles/compiled/nova.css";
```

Do not also import `@ziioapp/ui/styles.css`. The base stylesheet provides shared utilities and palettes; each additional file supplies one style.

## Component imports

Import components through individual subpaths:

```tsx
import { Button } from "@ziioapp/ui/components/button";
import { Input } from "@ziioapp/ui/components/input";
import { Card, CardContent } from "@ziioapp/ui/components/card";
import { cn } from "@ziioapp/ui/lib/utils";
```

Components use **Base UI** APIs. For custom triggers, use the component's `render` API where supported. Date Picker, Data Table, and Typography are compositions rather than separate generic component exports.

## Development

This repository is a pnpm monorepo. The library lives in `packages/ui`.

| Tool | Version |
| --- | --- |
| Node.js | 24.19.0 |
| pnpm | 11.23.0 |
| TypeScript | 6.0.3 |
| Biome (global) | 2.4.12 |

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm upstream:check
pnpm build
pnpm pack:ui
```

Root workspace commands run across packages; use `pnpm --filter @ziioapp/ui <command>` for the library alone. `pack:ui` runs validation and creates a tarball in `artifacts/`. It does not publish.

Workspace exports point to source files. `pnpm pack` rewrites published exports to compiled JavaScript, declarations, and CSS. Use pnpm to pack this repository.

### Upstream maintenance

`packages/ui/upstream/lock.json` records the source version and hashes. Keep upstream originals unchanged. Review candidate updates, then regenerate with `pnpm --filter @ziioapp/ui upstream:apply` and validate with `pnpm upstream:check`. Generated components live in `src/shadcn`; `src/components` contains legacy reference files and is not exported.

The build also generates a local shadcn Registry item at `packages/ui/dist/registry/ziio-ui.json`. It targets `src/components/ziio-ui` and `src/styles/ziio-ui.css` in consuming projects. The repository does not provide a hosted Registry endpoint.

## License

[MIT](LICENSE) © ziioai. Includes shadcn/ui code with its original copyright notice. See [third-party notices](packages/ui/THIRD_PARTY_NOTICES.md).
