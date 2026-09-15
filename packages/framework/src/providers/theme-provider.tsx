import {
  officialColorOptions,
  officialStyles,
} from "@ziioapp/ui/lib/official-themes";
import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { isElectron } from "../platform/runtime";

export const themeModes = [
  { value: "light", label: "浅色" },
  { value: "dark", label: "深色" },
  { value: "system", label: "跟随系统" },
] as const;

export const baseColors = [
  { value: "zinc", label: "锌灰" },
  { value: "neutral", label: "中性灰" },
  { value: "stone", label: "暖灰" },
  { value: "mauve", label: "淡紫灰" },
  { value: "olive", label: "橄榄灰" },
  { value: "mist", label: "雾灰" },
  { value: "taupe", label: "褐灰" },
] as const;

const colorThemeItems = [
  ...officialColorOptions,
  { value: "base", label: "同基础色" },
] as const;

export const themeColorGroups = [
  { group: "色彩", items: colorThemeItems },
] as const;

export type ThemeColor = string;

export const themeColors = colorThemeItems;

export const chartColors = [
  ...officialColorOptions,
  { value: "base", label: "跟随主题" },
] as const;

export type Theme = (typeof themeModes)[number]["value"];
export type BaseColor = string;
export type ChartColor = string;

export type UiStyle = string;
export interface ThemeOption {
  value: string;
  label: string;
  group?: string;
}
export type ThemeOptionRef = string | ThemeOption;

const RESOURCE_NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

function resolveOptions(
  refs: readonly ThemeOptionRef[] | undefined,
  builtins: readonly ThemeOption[],
): ThemeOption[] {
  const options = new Map<string, ThemeOption>();
  for (const ref of refs ?? builtins) {
    const value = typeof ref === "string" ? ref : ref.value;
    if (!RESOURCE_NAME.test(value))
      throw new Error(`Invalid theme option: ${value}`);
    const builtin = builtins.find((item) => item.value === value);
    options.set(value, {
      ...builtin,
      ...(typeof ref === "string"
        ? { value, label: builtin?.label ?? value }
        : ref),
    });
  }
  return [...options.values()];
}
export const uiStyles = officialStyles.map((value) => ({
  value,
  label: value[0].toUpperCase() + value.slice(1),
}));
interface ThemeSettings {
  mode: Theme;
  base: BaseColor;
  theme: ThemeColor;
  chart: ChartColor;
  uiStyle: UiStyle;
}
export interface ThemeProviderProps {
  children: React.ReactNode;
  storageKey?: string;
  defaultTheme?: Theme;
  defaultBaseColor?: BaseColor;
  defaultThemeColor?: ThemeColor;
  defaultChartColor?: ChartColor;
  defaultUiStyle?: UiStyle;
  /** 路由级基础色覆盖，不会写入用户保存的应用设置。 */
  baseColorOverride?: BaseColor;
  /** 路由级主题色覆盖，不会写入用户保存的应用设置。 */
  themeColorOverride?: ThemeColor;
  /** 路由级图表色覆盖，不会写入用户保存的应用设置。 */
  chartColorOverride?: ChartColor;
  /** 路由级组件风格覆盖，不会写入用户保存的应用设置。 */
  uiStyleOverride?: UiStyle;
  availableBaseColors?: readonly ThemeOptionRef[];
  availableThemeColors?: readonly ThemeOptionRef[];
  availableChartColors?: readonly ThemeOptionRef[];
  availableUiStyles?: readonly ThemeOptionRef[];
}
interface ThemeProviderState {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  baseColor: BaseColor;
  baseColorOverridden: boolean;
  themeColor: ThemeColor;
  themeColorOverridden: boolean;
  chartColor: ChartColor;
  chartColorOverridden: boolean;
  uiStyle: UiStyle;
  uiStyleOverridden: boolean;
  setTheme: (value: Theme) => void;
  setBaseColor: (value: BaseColor) => void;
  setThemeColor: (value: ThemeColor) => void;
  setChartColor: (value: ChartColor) => void;
  setUiStyle: (value: UiStyle) => void;
  baseColors: readonly { value: BaseColor; label: string }[];
  themeColorGroups: readonly {
    group: string;
    items: readonly { value: ThemeColor; label: string }[];
  }[];
  chartColors: readonly { value: ChartColor; label: string }[];
  uiStyles: readonly { value: UiStyle; label: string }[];
}
const ThemeProviderContext = createContext<ThemeProviderState | null>(null);
function replaceClass(root: HTMLElement, prefix: string, value: string) {
  for (const name of Array.from(root.classList))
    if (name.startsWith(prefix)) root.classList.remove(name);
  root.classList.add(prefix + value);
}
export function ThemeProvider({
  children,
  storageKey = "theme",
  defaultTheme = "system",
  defaultBaseColor = "zinc",
  defaultThemeColor = "indigo",
  defaultChartColor = "base",
  defaultUiStyle = "mira",
  baseColorOverride,
  themeColorOverride,
  chartColorOverride,
  uiStyleOverride,
  availableBaseColors,
  availableThemeColors,
  availableChartColors,
  availableUiStyles,
}: ThemeProviderProps) {
  const policy = useMemo(() => {
    const options = {
      base: resolveOptions(availableBaseColors, baseColors),
      theme: resolveOptions(
        availableThemeColors,
        themeColorGroups.flatMap((g) =>
          g.items.map((item) => ({ ...item, group: g.group })),
        ),
      ),
      chart: resolveOptions(availableChartColors, chartColors),
      uiStyle: resolveOptions(availableUiStyles, uiStyles),
    };
    if (!options.theme.some((x) => x.value === "base"))
      options.theme.unshift({
        value: "base",
        label: "同基础色",
        group: "色彩",
      });
    if (!options.chart.some((x) => x.value === "base"))
      options.chart.unshift({ value: "base", label: "跟随主题" });
    const groups = new Map<string, ThemeOption[]>();
    for (const option of options.theme) {
      const group = option.group ?? "自定义";
      groups.set(group, [...(groups.get(group) ?? []), option]);
    }
    const allowed = {
      mode: themeModes.map((x) => x.value) as readonly string[],
      base: options.base.map((x) => x.value),
      theme: options.theme.map((x) => x.value),
      chart: options.chart.map((x) => x.value),
      uiStyle: options.uiStyle.map((x) => x.value),
    };
    const defaults: ThemeSettings = {
      mode: defaultTheme,
      base: defaultBaseColor,
      theme: defaultThemeColor,
      chart: defaultChartColor,
      uiStyle: defaultUiStyle,
    };
    for (const key of Object.keys(defaults) as (keyof ThemeSettings)[]) {
      if (!allowed[key].includes(defaults[key]))
        Object.assign(defaults, { [key]: allowed[key][0] ?? defaults[key] });
    }
    if (allowed.uiStyle.length === 0 || allowed.base.length === 0)
      throw new Error(
        "ThemeProvider requires at least one bundled UI style and base color",
      );
    const normalize = (value: unknown): ThemeSettings => {
      const next = { ...defaults };
      if (!value || typeof value !== "object" || Array.isArray(value))
        return next;
      for (const key of Object.keys(defaults) as (keyof ThemeSettings)[]) {
        const item = (value as Record<string, unknown>)[key];
        if (typeof item === "string" && allowed[key].includes(item))
          Object.assign(next, { [key]: item });
      }
      return next;
    };
    return {
      allowed,
      defaults,
      normalize,
      options,
      groups: [...groups].map(([group, items]) => ({ group, items })),
    };
  }, [
    defaultTheme,
    defaultBaseColor,
    defaultThemeColor,
    defaultChartColor,
    defaultUiStyle,
    availableBaseColors,
    availableThemeColors,
    availableChartColors,
    availableUiStyles,
  ]);
  const [settings, setSettings] = useState(policy.defaults);
  const [ready, setReady] = useState(false);
  const [systemDark, setSystemDark] = useState(false);
  useLayoutEffect(() => {
    let initial: unknown;
    try {
      initial = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    } catch {
      /* Defaults also work with blocked storage. */
    }
    setSettings(policy.normalize(initial));
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(media.matches);
    const systemChanged = () => setSystemDark(media.matches);
    const storageChanged = (event: StorageEvent) => {
      if (event.key !== storageKey && event.key !== null) return;
      try {
        setSettings(policy.normalize(JSON.parse(event.newValue ?? "null")));
      } catch {
        setSettings(policy.defaults);
      }
    };
    media.addEventListener("change", systemChanged);
    window.addEventListener("storage", storageChanged);
    setReady(true);
    return () => {
      media.removeEventListener("change", systemChanged);
      window.removeEventListener("storage", storageChanged);
    };
  }, [policy, storageKey]);
  const resolvedTheme =
    settings.mode === "system"
      ? systemDark
        ? "dark"
        : "light"
      : settings.mode;
  const effectiveBaseColor = baseColorOverride ?? settings.base;
  const effectiveThemeColor = themeColorOverride ?? settings.theme;
  const effectiveChartColor = chartColorOverride ?? settings.chart;
  const effectiveUiStyle = uiStyleOverride ?? settings.uiStyle;

  useLayoutEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.dataset.ziioRuntime = isElectron ? "electron" : "web";
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;
    replaceClass(root, "base-color-", effectiveBaseColor);
    replaceClass(root, "theme-color-", effectiveThemeColor);
    replaceClass(root, "chart-color-", effectiveChartColor);
    const changingStyle = !root.classList.contains(`style-${effectiveUiStyle}`);
    const freeze = changingStyle ? document.createElement("style") : null;
    if (freeze) {
      freeze.textContent =
        "body *, body *::before, body *::after { transition: none !important; }";
      document.head.appendChild(freeze);
    }
    for (const name of Array.from(document.body.classList)) {
      if (name.startsWith("style-")) document.body.classList.remove(name);
    }
    replaceClass(root, "style-", effectiveUiStyle);
    if (!freeze) return;
    void document.body.offsetHeight;
    const frame = requestAnimationFrame(() => freeze.remove());
    return () => {
      cancelAnimationFrame(frame);
      freeze.remove();
    };
  }, [
    effectiveBaseColor,
    effectiveChartColor,
    effectiveThemeColor,
    effectiveUiStyle,
    ready,
    resolvedTheme,
  ]);
  function update(patch: Partial<ThemeSettings>) {
    setSettings((current) => {
      const next = policy.normalize({ ...current, ...patch });
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* In-memory changes remain available. */
      }
      return next;
    });
  }
  return (
    <ThemeProviderContext
      value={{
        theme: settings.mode,
        resolvedTheme,
        baseColor: effectiveBaseColor,
        baseColorOverridden: baseColorOverride !== undefined,
        themeColor: effectiveThemeColor,
        themeColorOverridden: themeColorOverride !== undefined,
        chartColor: effectiveChartColor,
        chartColorOverridden: chartColorOverride !== undefined,
        uiStyle: effectiveUiStyle,
        uiStyleOverridden: uiStyleOverride !== undefined,
        setTheme: (mode) => update({ mode }),
        setBaseColor: (base) => update({ base }),
        setThemeColor: (theme) => update({ theme }),
        setChartColor: (chart) => update({ chart }),
        setUiStyle: (uiStyle) => update({ uiStyle }),
        baseColors: policy.options.base,
        themeColorGroups: policy.groups,
        chartColors: policy.options.chart,
        uiStyles: policy.options.uiStyle,
      }}
    >
      {ready ? children : null}
    </ThemeProviderContext>
  );
}
export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
