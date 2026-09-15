import { Button } from "@ziioapp/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ziioapp/ui/components/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@ziioapp/ui/components/item";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import type { ZiioAppConfig } from "../config/types";
import type {} from "../types/electron";

interface AppInfo {
  version: string;
  name: string;
  platform: string;
  electronVersion?: string;
  nodeVersion?: string;
}

interface AboutViewProps {
  config: ZiioAppConfig;
  version?: string;
}

export function AboutView({ config, version }: AboutViewProps) {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const isElectron = typeof window !== "undefined" && "electronAPI" in window;
  const resolvedVersion = appInfo?.version ?? version ?? config.app.version;

  useEffect(() => {
    if (isElectron && window.electronAPI) {
      window.electronAPI.getAppInfo().then(setAppInfo);
    }
  }, [isElectron]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{config.app.description}</CardTitle>
          <CardDescription>{config.app.aboutDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle>运行模式</ItemTitle>
                <ItemDescription>
                  {isElectron ? "桌面端 (Electron)" : "浏览器 (Web)"}
                </ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle>应用名称</ItemTitle>
                <ItemDescription>{config.app.title}</ItemDescription>
              </ItemContent>
            </Item>
            {resolvedVersion && (
              <Item variant="muted" size="sm">
                <ItemContent>
                  <ItemTitle>版本</ItemTitle>
                  <ItemDescription>v{resolvedVersion}</ItemDescription>
                </ItemContent>
              </Item>
            )}
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle>包名</ItemTitle>
                <ItemDescription>{config.packageName}</ItemDescription>
              </ItemContent>
            </Item>

            {appInfo && (
              <>
                <Item variant="muted" size="sm">
                  <ItemContent>
                    <ItemTitle>平台</ItemTitle>
                    <ItemDescription>{appInfo.platform}</ItemDescription>
                  </ItemContent>
                </Item>
                {appInfo.electronVersion && (
                  <Item variant="muted" size="sm">
                    <ItemContent>
                      <ItemTitle>Electron 版本</ItemTitle>
                      <ItemDescription>
                        {appInfo.electronVersion}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                )}
                {appInfo.nodeVersion && (
                  <Item variant="muted" size="sm">
                    <ItemContent>
                      <ItemTitle>Node 版本</ItemTitle>
                      <ItemDescription>{appInfo.nodeVersion}</ItemDescription>
                    </ItemContent>
                  </Item>
                )}
              </>
            )}
          </ItemGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>技术栈</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            {[
              "React 19 + TypeScript 6",
              "TanStack Router + TanStack Start (SSG)",
              "Tailwind CSS v4 + shadcn/ui",
              "Electron (桌面端)",
              "Vite (构建工具)",
            ].map((tech) => (
              <Item key={tech} variant="muted" size="sm">
                <ItemContent>
                  <ItemTitle>{tech}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <a
              href={config.app.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看源码"
            >
              <span className="sr-only">查看源码</span>
            </a>
          }
        >
          <ExternalLink data-icon="inline-start" />
          查看源码
        </Button>
      </div>
    </>
  );
}
