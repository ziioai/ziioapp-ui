import { TanStackDevtools } from "@tanstack/react-devtools";
import { useHydrated, useLocation, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@ziioapp/ui/components/menubar";
import { useEffect, useMemo, useState } from "react";
import { MyFramedBox } from "../basic/my-framed-box";
import type { ZiioAppConfig } from "../config/types";
import {
  FeedbackViewport,
  type FeedbackViewportProps,
} from "../elements/feedback-viewport";
import { Titlebar } from "../elements/titlebar";
import { isElectron } from "../platform/runtime";
import type { ThemeProviderProps } from "../providers/theme-provider";
import {
  ThemeProvider,
  themeModes,
  useTheme,
} from "../providers/theme-provider";
import type {} from "../types/electron";
import { cn } from "../utils/cn";
import { AppLoadingView } from "../views/app-loading-view";

export type RouteShellMode = "standard" | "custom" | "immersive" | "standalone";
export type AppShellMode = Exclude<RouteShellMode, "standalone">;
export type AppShellSurface = "framed" | "flat";

interface AppShellFrameBaseProps<
  TConfig extends ZiioAppConfig = ZiioAppConfig,
> {
  children: React.ReactNode;
  config: TConfig;
  /** 覆盖 mode 的默认表面；仅用于确有混合需求的页面。 */
  surface?: AppShellSurface;
  /** 关闭当前壳层的反馈挂载点，供更高层统一挂载时使用。 */
  renderToaster?: boolean;
  /** 通知出现的位置，省略时使用反馈组件默认值。 */
  toasterPosition?: FeedbackViewportProps["position"];
}

export type AppShellFrameProps<TConfig extends ZiioAppConfig = ZiioAppConfig> =
  AppShellFrameBaseProps<TConfig> &
    (
      | { mode?: "standard"; header?: never }
      | { mode: "custom"; header: React.ReactNode }
      | { mode: "immersive"; header?: never }
    );

type AppShellThemeProps = Omit<
  ThemeProviderProps,
  "children" | "defaultTheme" | "storageKey"
>;

export type AppShellProps<TConfig extends ZiioAppConfig = ZiioAppConfig> =
  AppShellThemeProps & AppShellFrameProps<TConfig>;

const maxRecentRoutes = 12;

export function AppShell<TConfig extends ZiioAppConfig>({
  children,
  config,
  mode = "standard",
  header,
  surface,
  renderToaster,
  toasterPosition,
  defaultUiStyle,
  availableUiStyles,
  defaultBaseColor,
  defaultThemeColor,
  defaultChartColor,
  themeColorOverride,
  baseColorOverride,
  chartColorOverride,
  uiStyleOverride,
  availableBaseColors,
  availableThemeColors,
  availableChartColors,
}: AppShellProps<TConfig>) {
  const hydrated = useHydrated();

  const frameProps = { config, surface, renderToaster, toasterPosition };
  const frame =
    mode === "custom" ? (
      <AppShellFrame {...frameProps} mode="custom" header={header}>
        {children}
      </AppShellFrame>
    ) : mode === "immersive" ? (
      <AppShellFrame {...frameProps} mode="immersive">
        {children}
      </AppShellFrame>
    ) : (
      <AppShellFrame {...frameProps} mode="standard">
        {children}
      </AppShellFrame>
    );

  const content = hydrated ? (
    <ThemeProvider
      defaultTheme="system"
      storageKey="theme"
      defaultUiStyle={defaultUiStyle}
      availableUiStyles={availableUiStyles}
      defaultBaseColor={defaultBaseColor}
      defaultThemeColor={defaultThemeColor}
      defaultChartColor={defaultChartColor}
      baseColorOverride={baseColorOverride}
      themeColorOverride={themeColorOverride}
      chartColorOverride={chartColorOverride}
      uiStyleOverride={uiStyleOverride}
      availableBaseColors={availableBaseColors}
      availableThemeColors={availableThemeColors}
      availableChartColors={availableChartColors}
    >
      {frame}
    </ThemeProvider>
  ) : (
    <AppLoadingView
      initialTheme={{
        storageKey: "theme",
        defaultTheme: "system",
        defaultUiStyle,
        defaultBaseColor,
        defaultThemeColor,
        defaultChartColor,
        baseColorOverride,
        themeColorOverride,
        chartColorOverride,
        uiStyleOverride,
        availableBaseColors,
        availableThemeColors,
        availableChartColors,
        availableUiStyles,
      }}
    />
  );

  return content;
}

export function AppShellFrame<TConfig extends ZiioAppConfig>({
  children,
  config,
  mode = "standard",
  header,
  surface,
  renderToaster = true,
  toasterPosition,
}: AppShellFrameProps<TConfig>) {
  const effectiveSurface = surface ?? (mode === "standard" ? "framed" : "flat");
  const flatSurface = effectiveSurface === "flat";
  const devtools = import.meta.env.DEV && (
    <TanStackDevtools
      config={{ position: "bottom-right" }}
      plugins={[
        {
          name: "Tanstack Router",
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  );

  return (
    <>
      <div
        data-shell-mode={mode}
        data-shell-surface={effectiveSurface}
        className={cn(
          isElectron
            ? ["h-screen flex flex-col overflow-hidden"]
            : [
                "min-h-screen sm:min-h-0",
                "h-auto overflow-auto",
                "sm:h-screen sm:flex sm:flex-col sm:overflow-hidden",
              ],
          "print:h-auto print:overflow-visible",
          "text-foreground",
          flatSurface ? "bg-background" : "bg-card",
        )}
      >
        {isElectron ? <Titlebar /> : null}
        {mode === "custom" ? (
          <div className="order-1 print:hidden">{header}</div>
        ) : mode === "standard" ? (
          <div className="order-1 hidden print:hidden sm:block">
            <AppShellMenubar config={config} />
          </div>
        ) : null}
        <MyFramedBox
          className={cn(
            "order-1 sm:order-2",
            flatSurface ? "sm:p-0" : "sm:p-0 sm:px-2 sm:pb-2",
          )}
          innerClassName={
            flatSurface ? "bg-background sm:rounded-none" : undefined
          }
        >
          {children}
        </MyFramedBox>
        {mode === "standard" ? (
          <div className="order-2 border-t border-border print:hidden sm:hidden sm:border-t-0">
            <AppShellMenubar config={config} />
          </div>
        ) : null}
        {devtools}
      </div>
      {renderToaster ? <FeedbackViewport position={toasterPosition} /> : null}
    </>
  );
}

function AppShellMenubar<TConfig extends ZiioAppConfig>({
  config,
}: {
  config: TConfig;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    theme,
    baseColor,
    baseColorOverridden,
    themeColor,
    themeColorOverridden,
    chartColor,
    chartColorOverridden,
    uiStyle,
    uiStyleOverridden,
    setTheme,
    setBaseColor,
    setThemeColor,
    setChartColor,
    setUiStyle,
    baseColors,
    themeColorGroups,
    chartColors,
    uiStyles,
  } = useTheme();
  const recentRoutes = useRecentRoutes(config.packageName, location.pathname);
  const routeLabels = useMemo(() => buildRouteLabels(config), [config]);

  const openRoute = (to: string, electronWindow?: string) => {
    if (electronWindow === "settings" && isElectron) {
      window.electronAPI?.openSettingsWindow();
      return;
    }

    navigate({ to: to as never });
  };

  return (
    <Menubar className="gap-0.5 rounded-none border-0">
      <RouteMenu
        label={config.navigation.appMenu.label}
        items={config.navigation.appMenu.items}
        onOpenRoute={openRoute}
      />
      <RouteMenu
        label={config.navigation.mainMenu.label}
        items={config.navigation.mainMenu.items}
        onOpenRoute={openRoute}
      />
      <HistoryMenu
        recentRoutes={recentRoutes}
        routeLabels={routeLabels}
        onOpenRoute={openRoute}
      />
      <ViewMenu
        theme={theme}
        baseColor={baseColor}
        baseColorOverridden={baseColorOverridden}
        themeColor={themeColor}
        themeColorOverridden={themeColorOverridden}
        chartColor={chartColor}
        chartColorOverridden={chartColorOverridden}
        uiStyle={uiStyle}
        uiStyleOverridden={uiStyleOverridden}
        setTheme={setTheme}
        setBaseColor={setBaseColor}
        setThemeColor={setThemeColor}
        setChartColor={setChartColor}
        setUiStyle={setUiStyle}
        baseColors={baseColors}
        themeColorGroups={themeColorGroups}
        chartColors={chartColors}
        uiStyles={uiStyles}
      />
    </Menubar>
  );
}

function useRecentRoutes(packageName: string, pathname: string) {
  const historyStorageKey = `${packageName}:recent-routes`;
  const [recentRoutes, setRecentRoutes] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(historyStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setRecentRoutes(
          parsed
            .filter((item): item is string => typeof item === "string")
            .slice(0, maxRecentRoutes),
        );
      }
    } catch {
      localStorage.removeItem(historyStorageKey);
    }
  }, [historyStorageKey]);

  useEffect(() => {
    setRecentRoutes((current) => {
      const next = [
        pathname,
        ...current.filter((item) => item !== pathname),
      ].slice(0, maxRecentRoutes);
      try {
        localStorage.setItem(historyStorageKey, JSON.stringify(next));
      } catch {
        // Ignore unavailable or full localStorage.
      }
      return next;
    });
  }, [historyStorageKey, pathname]);

  return recentRoutes;
}

function HistoryMenu({
  recentRoutes,
  routeLabels,
  onOpenRoute,
}: {
  recentRoutes: string[];
  routeLabels: Map<string, string>;
  onOpenRoute: (to: string) => void;
}) {
  return (
    <MenubarMenu>
      <MenubarTrigger>历史</MenubarTrigger>
      <MenubarContent>
        <MenubarGroup>
          <MenubarLabel>最近页面</MenubarLabel>
          {recentRoutes.length > 0 ? (
            recentRoutes.map((route) => (
              <MenubarItem key={route} onClick={() => onOpenRoute(route)}>
                {routeLabels.get(route) ?? route}
              </MenubarItem>
            ))
          ) : (
            <MenubarItem disabled>暂无历史页面</MenubarItem>
          )}
        </MenubarGroup>
      </MenubarContent>
    </MenubarMenu>
  );
}

function ViewMenu({
  theme,
  baseColor,
  baseColorOverridden,
  themeColor,
  themeColorOverridden,
  chartColor,
  chartColorOverridden,
  uiStyle,
  uiStyleOverridden,
  setTheme,
  setBaseColor,
  setThemeColor,
  setChartColor,
  setUiStyle,
  baseColors,
  themeColorGroups,
  chartColors,
  uiStyles,
}: Pick<
  ReturnType<typeof useTheme>,
  | "theme"
  | "baseColor"
  | "baseColorOverridden"
  | "themeColor"
  | "themeColorOverridden"
  | "chartColor"
  | "chartColorOverridden"
  | "uiStyle"
  | "uiStyleOverridden"
  | "setTheme"
  | "setBaseColor"
  | "setThemeColor"
  | "setChartColor"
  | "setUiStyle"
  | "baseColors"
  | "themeColorGroups"
  | "chartColors"
  | "uiStyles"
>) {
  return (
    <MenubarMenu>
      <MenubarTrigger>视图</MenubarTrigger>
      <MenubarContent>
        <MenubarGroup>
          <MenubarSub>
            <MenubarSubTrigger>主题模式</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarRadioGroup value={theme}>
                {themeModes.map((mode) => (
                  <MenubarRadioItem
                    key={mode.value}
                    value={mode.value}
                    onClick={() => setTheme(mode.value)}
                  >
                    {mode.label}
                  </MenubarRadioItem>
                ))}
              </MenubarRadioGroup>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          {uiStyleOverridden ? (
            <MenubarItem disabled>界面风格由当前页面决定</MenubarItem>
          ) : (
            <SimpleThemeMenu
              label="界面风格"
              value={uiStyle}
              items={uiStyles}
              onSelect={setUiStyle}
            />
          )}
          {themeColorOverridden ? (
            <MenubarItem disabled>主题色由当前页面决定</MenubarItem>
          ) : (
            <ThemeColorMenu
              themeColor={themeColor}
              setThemeColor={setThemeColor}
              groups={themeColorGroups}
            />
          )}
          {baseColorOverridden ? (
            <MenubarItem disabled>基础色由当前页面决定</MenubarItem>
          ) : (
            <SimpleThemeMenu
              label="基础色"
              value={baseColor}
              items={baseColors}
              onSelect={setBaseColor}
            />
          )}
          {chartColorOverridden ? (
            <MenubarItem disabled>图表色由当前页面决定</MenubarItem>
          ) : (
            <SimpleThemeMenu
              label="图表色"
              value={chartColor}
              items={chartColors}
              onSelect={setChartColor}
            />
          )}
        </MenubarGroup>
      </MenubarContent>
    </MenubarMenu>
  );
}

function ThemeColorMenu({
  themeColor,
  setThemeColor,
  groups,
}: Pick<ReturnType<typeof useTheme>, "themeColor" | "setThemeColor"> & {
  groups: ReturnType<typeof useTheme>["themeColorGroups"];
}) {
  return (
    <MenubarSub>
      <MenubarSubTrigger>主题色</MenubarSubTrigger>
      <MenubarSubContent>
        {groups.map((group) => (
          <MenubarSub key={group.group}>
            <MenubarSubTrigger>{group.group}</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarRadioGroup value={themeColor}>
                {group.items.map((item) => (
                  <MenubarRadioItem
                    key={item.value}
                    value={item.value}
                    onClick={() => setThemeColor(item.value)}
                  >
                    {item.label}
                  </MenubarRadioItem>
                ))}
              </MenubarRadioGroup>
            </MenubarSubContent>
          </MenubarSub>
        ))}
      </MenubarSubContent>
    </MenubarSub>
  );
}

function SimpleThemeMenu<TValue extends string>({
  label,
  value,
  items,
  onSelect,
}: {
  label: string;
  value: TValue;
  items: readonly { value: TValue; label: string }[];
  onSelect: (value: TValue) => void;
}) {
  return (
    <MenubarSub>
      <MenubarSubTrigger>{label}</MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarRadioGroup value={value}>
          {items.map((item) => (
            <MenubarRadioItem
              key={item.value}
              value={item.value}
              onClick={() => onSelect(item.value)}
            >
              {item.label}
            </MenubarRadioItem>
          ))}
        </MenubarRadioGroup>
      </MenubarSubContent>
    </MenubarSub>
  );
}

function RouteMenu({
  label,
  items,
  onOpenRoute,
}: {
  label: string;
  items: ZiioAppConfig["navigation"]["appMenu"]["items"];
  onOpenRoute: (to: string, electronWindow?: string) => void;
}) {
  return (
    <MenubarMenu>
      <MenubarTrigger>{label}</MenubarTrigger>
      <MenubarContent>
        <MenubarGroup>
          <MenubarLabel>{label}</MenubarLabel>
          {items.map((item) => (
            <MenubarItem
              key={`${item.to}-${item.electronWindow ?? "route"}`}
              onClick={() => onOpenRoute(item.to, item.electronWindow)}
            >
              {item.label}
            </MenubarItem>
          ))}
        </MenubarGroup>
      </MenubarContent>
    </MenubarMenu>
  );
}

function buildRouteLabels(config: ZiioAppConfig) {
  const labels = new Map<string, string>();
  for (const menu of [config.navigation.appMenu, config.navigation.mainMenu]) {
    for (const item of menu.items) labels.set(item.to, item.label);
  }
  return labels;
}
