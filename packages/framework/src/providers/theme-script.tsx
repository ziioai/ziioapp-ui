import type {
  BaseColor,
  ChartColor,
  Theme,
  ThemeColor,
  ThemeOptionRef,
  UiStyle,
} from "./theme-provider";

export interface InitialThemeOptions {
  storageKey?: string;
  defaultTheme?: Theme;
  defaultBaseColor?: BaseColor;
  defaultThemeColor?: ThemeColor;
  defaultChartColor?: ChartColor;
  defaultUiStyle?: UiStyle;
  baseColorOverride?: BaseColor;
  themeColorOverride?: ThemeColor;
  chartColorOverride?: ChartColor;
  uiStyleOverride?: UiStyle;
  availableBaseColors?: readonly ThemeOptionRef[];
  availableThemeColors?: readonly ThemeOptionRef[];
  availableChartColors?: readonly ThemeOptionRef[];
  availableUiStyles?: readonly ThemeOptionRef[];
  runtime?: "web" | "electron";
}

/** Applies the persisted theme before React mounts to prevent a wrong-color first paint. */
export function applyInitialTheme(options: InitialThemeOptions = {}) {
  if (typeof document === "undefined") return;

  const resourceName = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
  const optionValues = (refs: readonly ThemeOptionRef[] | undefined) =>
    refs?.map((ref) => (typeof ref === "string" ? ref : ref.value));
  const normalizeResource = (
    value: unknown,
    fallback: string,
    refs: readonly ThemeOptionRef[] | undefined,
    includeBase = false,
  ) => {
    const allowed = optionValues(refs);
    if (includeBase && allowed && !allowed.includes("base")) {
      allowed.unshift("base");
    }
    const normalizedFallback =
      allowed && !allowed.includes(fallback)
        ? (allowed[0] ?? fallback)
        : fallback;
    return typeof value === "string" &&
      resourceName.test(value) &&
      (!allowed || allowed.includes(value))
      ? value
      : normalizedFallback;
  };
  const replaceClass = (element: Element, prefix: string, value: string) => {
    for (const name of Array.from(element.classList)) {
      if (name.startsWith(prefix)) element.classList.remove(name);
    }
    element.classList.add(prefix + value);
  };

  let saved: Record<string, unknown> = {};
  try {
    const value = JSON.parse(
      localStorage.getItem(options.storageKey ?? "theme") ?? "null",
    );
    if (value && typeof value === "object" && !Array.isArray(value)) {
      saved = value;
    }
  } catch {
    // Defaults also work with blocked or invalid storage.
  }

  const defaultMode = options.defaultTheme ?? "system";
  const mode =
    saved.mode === "light" || saved.mode === "dark" || saved.mode === "system"
      ? saved.mode
      : defaultMode;
  const resolvedMode =
    mode === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : mode;
  const base =
    options.baseColorOverride ??
    normalizeResource(
      saved.base,
      options.defaultBaseColor ?? "zinc",
      options.availableBaseColors,
    );
  const theme =
    options.themeColorOverride ??
    normalizeResource(
      saved.theme,
      options.defaultThemeColor ?? "indigo",
      options.availableThemeColors,
      true,
    );
  const chart =
    options.chartColorOverride ??
    normalizeResource(
      saved.chart,
      options.defaultChartColor ?? "base",
      options.availableChartColors,
      true,
    );
  const uiStyle =
    options.uiStyleOverride ??
    normalizeResource(
      saved.uiStyle,
      options.defaultUiStyle ?? "mira",
      options.availableUiStyles,
    );

  const root = document.documentElement;
  root.dataset.ziioRuntime = options.runtime ?? "web";
  root.classList.remove("light", "dark");
  root.classList.add(resolvedMode);
  root.style.colorScheme = resolvedMode;
  replaceClass(root, "base-color-", base);
  replaceClass(root, "theme-color-", theme);
  replaceClass(root, "chart-color-", chart);
  replaceClass(root, "style-", uiStyle);
}

export function createInitialThemeScript(options: InitialThemeOptions = {}) {
  const serialized = JSON.stringify(options).replaceAll("<", "\\u003c");
  return `(${applyInitialTheme.toString()})(${serialized});`;
}

export function ThemeScript(options: InitialThemeOptions) {
  return (
    <script
      suppressHydrationWarning
      // biome-ignore lint/security/noDangerouslySetInnerHtml: The function source is static and serialized options escape HTML delimiters.
      dangerouslySetInnerHTML={{ __html: createInitialThemeScript(options) }}
    />
  );
}
