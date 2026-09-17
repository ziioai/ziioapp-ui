import { Button } from "@ziioapp/ui/components/button";
import { Card, CardContent } from "@ziioapp/ui/components/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@ziioapp/ui/components/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@ziioapp/ui/components/select";
import { Switch } from "@ziioapp/ui/components/switch";
import { notify } from "@ziioapp/ui/lib/feedback";
import { Monitor, Moon, Sun } from "lucide-react";
import { useId, useState } from "react";
import type {
  BaseColor,
  ChartColor,
  ThemeColor,
} from "../providers/theme-provider";
import { themeModes, useTheme } from "../providers/theme-provider";

export function SettingsView() {
  const {
    theme,
    setTheme,
    baseColor,
    setBaseColor,
    themeColor,
    setThemeColor,
    chartColor,
    setChartColor,
    baseColors,
    themeColorGroups,
    chartColors,
    uiStyle,
    setUiStyle,
    uiStyles,
  } = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const notificationsId = useId();
  const autoSaveId = useId();
  const uiStyleLabelId = useId();
  const themeModeLabelId = useId();
  const baseColorLabelId = useId();
  const themeColorLabelId = useId();
  const chartColorLabelId = useId();

  return (
    <>
      {/* 外观 */}
      <Card>
        <CardContent>
          <FieldSet>
            <FieldLegend>外观</FieldLegend>
            <FieldDescription>自定义应用的主题和配色方案</FieldDescription>
            <FieldGroup>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel id={uiStyleLabelId}>界面风格</FieldLabel>
                  <FieldDescription>选择控件的外观与间距</FieldDescription>
                </FieldContent>
                <Select
                  value={uiStyle}
                  items={uiStyles}
                  onValueChange={(value) => value && setUiStyle(value)}
                >
                  <SelectTrigger
                    className="min-w-36"
                    aria-labelledby={uiStyleLabelId}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {uiStyles.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel id={themeModeLabelId}>主题模式</FieldLabel>
                  <FieldDescription>选择应用的主题模式</FieldDescription>
                </FieldContent>
                <Select
                  value={theme}
                  onValueChange={(v) => v && setTheme(v)}
                  items={themeModes}
                >
                  <SelectTrigger
                    className="min-w-36"
                    aria-labelledby={themeModeLabelId}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {themeModes.map((mode) => (
                        <SelectItem key={mode.value} value={mode.value}>
                          <span className="flex items-center gap-2">
                            {mode.value === "light" ? (
                              <Sun aria-hidden="true" />
                            ) : mode.value === "dark" ? (
                              <Moon aria-hidden="true" />
                            ) : (
                              <Monitor aria-hidden="true" />
                            )}
                            {mode.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel id={baseColorLabelId}>基础色</FieldLabel>
                  <FieldDescription>界面的基础色调</FieldDescription>
                </FieldContent>
                <Select
                  value={baseColor}
                  onValueChange={(v) => v && setBaseColor(v as BaseColor)}
                  items={baseColors}
                >
                  <SelectTrigger
                    className="min-w-36"
                    aria-labelledby={baseColorLabelId}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {baseColors.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel id={themeColorLabelId}>主题色</FieldLabel>
                  <FieldDescription>强调色和主色调</FieldDescription>
                </FieldContent>
                <Select
                  value={themeColor}
                  onValueChange={(v) => v && setThemeColor(v as ThemeColor)}
                  items={themeColorGroups.flatMap((g) => [...g.items])}
                >
                  <SelectTrigger
                    className="min-w-36"
                    aria-labelledby={themeColorLabelId}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themeColorGroups.map((g, gi) => (
                      <SelectGroup key={g.group}>
                        {gi > 0 && <SelectSeparator />}
                        <SelectLabel>{g.group}</SelectLabel>
                        {g.items.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel id={chartColorLabelId}>图表色</FieldLabel>
                  <FieldDescription>图表和统计数据的配色</FieldDescription>
                </FieldContent>
                <Select
                  value={chartColor}
                  onValueChange={(v) => v && setChartColor(v as ChartColor)}
                  items={chartColors}
                >
                  <SelectTrigger
                    className="min-w-36"
                    aria-labelledby={chartColorLabelId}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {chartColors.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>

      {/* 偏好 */}
      <Card>
        <CardContent>
          <FieldSet>
            <FieldLegend>偏好</FieldLegend>
            <FieldDescription>管理应用的运行偏好</FieldDescription>
            <FieldGroup>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor={notificationsId}>推送通知</FieldLabel>
                  <FieldDescription>允许应用发送推送通知</FieldDescription>
                </FieldContent>
                <Switch
                  id={notificationsId}
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </Field>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor={autoSaveId}>自动保存</FieldLabel>
                  <FieldDescription>编辑时自动保存更改</FieldDescription>
                </FieldContent>
                <Switch
                  id={autoSaveId}
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>

      {/* 操作 */}
      <Card>
        <CardContent>
          <FieldSet>
            <FieldLegend>操作</FieldLegend>
            <FieldGroup>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify.info("设置已重置为默认值")}
              >
                重置为默认设置
              </Button>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>
    </>
  );
}
