"use client";
import { Badge } from "@ziioapp/ui/components/badge";
import { Button } from "@ziioapp/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ziioapp/ui/components/dialog";
import { FieldGroup } from "@ziioapp/ui/components/field";
import { MessageCircle, Palette, User } from "lucide-react";
import { useState } from "react";
import { BottomNavigationBackdrop } from "../src/blocks/bottom-navigation-backdrop.js";
import { ConversationItem } from "../src/blocks/conversation-item.js";
import { MessageComposer } from "../src/blocks/message-composer.js";
import { SearchablePageHeader } from "../src/blocks/searchable-page-header.js";
import { ThemePreview } from "../src/blocks/theme-preview.js";
import { SegmentedChoice, SelectChoice } from "../src/components/choice.js";
import { ConfirmationDialog } from "../src/components/confirmation-dialog.js";
import { DialogBody } from "../src/components/dialog-body.js";
import { ExpandableNote } from "../src/components/expandable-note.js";
import { FloatingBar } from "../src/components/floating-bar.js";
import { ParticipantAvatar } from "../src/components/participant-avatar.js";
import { SearchInput } from "../src/components/search-input.js";
import { SecretInput } from "../src/components/secret-input.js";
import {
  SettingsField,
  SettingsGroup,
  SettingsRow,
} from "../src/components/settings-layout.js";
import {
  SettingsNavigationGroup,
  SettingsNavigationItem,
} from "../src/components/settings-navigation.js";
import { ThemeModeButton } from "../src/components/theme-mode-button.js";
import { UnreadBadge } from "../src/components/unread-badge.js";
import { useConfirmation } from "../src/hooks/use-confirmation.js";
import { LayeredExamples } from "./migration-layered.js";

export const exampleParticipants = [
  "玲",
  "夏",
  "林",
  "安",
  "洛",
  "艾",
  "雪",
  "晴",
].map((name, i) => ({ id: String(i), name }));
const options = [
  { value: "standard", label: "标准" },
  { value: "large", label: "较大" },
  { value: "larger", label: "更大" },
];
/** Theme state and all data operations belong to the host; this file is a demo only. */
export function MigrationShowcase({
  mode,
  onToggle,
}: {
  mode: "light" | "dark";
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState(""),
    [secret, setSecret] = useState("demo-key"),
    [size, setSize] = useState("standard"),
    [draft, setDraft] = useState(""),
    [active, setActive] = useState(false),
    [sent, setSent] = useState(0),
    [result, setResult] = useState("未确认");
  const [secretVisible, setSecretVisible] = useState(false);
  const confirmation = useConfirmation();
  return (
    <div className="wac-mobile-page pb-32">
      <SearchablePageHeader
        title="会话"
        searchLabel="搜索会话"
        placeholder="名称、角色或消息"
        query={query}
        onQueryChange={setQuery}
        searchOpen={open}
        onSearchOpenChange={setOpen}
        actions={<ThemeModeButton mode={mode} onToggle={onToggle} />}
      />
      <main className="wac-page-content flex flex-col gap-6">
        <section
          aria-label="组合头像"
          className="flex flex-wrap items-center gap-3"
        >
          {[0, 1, 2, 3, 4, 8].map((n) => (
            <ParticipantAvatar
              key={n}
              participants={exampleParticipants.slice(0, n)}
              data-count-example={n}
            />
          ))}
          {[0, 1, 9, 12, 99, 100].map((n) => (
            <UnreadBadge key={n} count={n} />
          ))}
        </section>
        <section aria-label="会话列表" className="flex flex-col gap-1">
          {Array.from({ length: 6 }, (_, i) => (
            <ConversationItem
              key={exampleParticipants[i].id}
              avatar={
                <ParticipantAvatar
                  participants={exampleParticipants.slice(0, i % 2 ? 8 : 1)}
                />
              }
              title={i % 2 ? "午后咖啡馆" : "玲"}
              titleBadge={
                <Badge variant="outline">{i % 2 ? "群聊" : "单聊"}</Badge>
              }
              preview="雨停了，我们一起等下一班车吧。"
              time={
                <span className="text-xs text-muted-foreground">14:32</span>
              }
              previewTrailing={<UnreadBadge count={i % 2 ? 12 : 1} />}
            />
          ))}
          <ConversationItem
            avatar={
              <ParticipantAvatar
                participants={exampleParticipants.slice(0, 1)}
              />
            }
            title="旧接口示例"
            preview="原有 badge 与 trailing 保持可用"
            badge={<Badge>旧标签</Badge>}
            trailing={
              <Button size="icon" variant="ghost" aria-label="打开旧会话">
                <MessageCircle />
              </Button>
            }
          />
        </section>
        <SettingsNavigationGroup>
          <SettingsNavigationItem icon={User} label="账号" trailing="未登录" />
          <SettingsNavigationItem icon={Palette} label="外观与阅读" />
        </SettingsNavigationGroup>
        <SettingsGroup title="输入与选择">
          <SettingsField id="search-example" label="搜索">
            {(control) => (
              <SearchInput
                {...control}
                value={query}
                onValueChange={setQuery}
                aria-label="搜索示例"
                trailingAction={{ kind: "clear", onClick: () => setQuery("") }}
              />
            )}
          </SettingsField>
          <SettingsField id="secret-example" label="密钥">
            {(control) => (
              <SecretInput
                visible={secretVisible}
                onVisibleChange={setSecretVisible}
                {...control}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
              />
            )}
          </SettingsField>
          <SettingsRow
            id="reading-example"
            label="正文字号"
            description="仅影响正文。"
            grouped
          >
            {(control) => (
              <SegmentedChoice
                {...control}
                items={options}
                value={size}
                onValueChange={setSize}
              />
            )}
          </SettingsRow>
          <SettingsRow id="choice-example" label="选择">
            {(control) => (
              <SelectChoice
                {...control}
                items={options}
                groups={[{ group: "字号", items: options }]}
                value={size}
                onValueChange={setSize}
              />
            )}
          </SettingsRow>
        </SettingsGroup>
        <ExpandableNote title="可展开说明">
          第一行说明。
          <br />
          第二行说明。
          <br />
          第三行说明。
        </ExpandableNote>
        <FieldGroup>
          <MessageComposer
            id="message-example-form"
            value={draft}
            onValueChange={setDraft}
            canSubmit={draft.trim().length > 0}
            active={active}
            onSend={() => {
              setSent((n) => n + 1);
              setDraft("");
              setActive(true);
            }}
            onStop={() => setActive(false)}
            placeholder="输入消息，Enter 发送，Shift+Enter 换行"
          />
          <output aria-live="polite" data-testid="sent">
            已发送 {sent} 条
          </output>
        </FieldGroup>
        <Button
          onClick={async () =>
            setResult(
              (await confirmation.confirm({
                title: "确认操作？",
                description: "这里只展示确认交互。",
              }))
                ? "已确认"
                : "已取消",
            )
          }
        >
          打开确认
        </Button>
        <output data-testid="confirmation-result">{result}</output>
        <ConfirmationDialog
          request={confirmation.request}
          onResolve={confirmation.finish}
        />
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>
            打开滚动表单
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>独立的表单容器</DialogTitle>
            </DialogHeader>
            <DialogBody className="max-h-64">
              <p>滚动内容保持独立，表单可以放在页面、对话框或抽屉中。</p>
              <ThemePreview />
            </DialogBody>
          </DialogContent>
        </Dialog>
        <ThemePreview />
        <LayeredExamples />
      </main>
      <FloatingBar>
        <BottomNavigationBackdrop />
        <div className="relative flex justify-center rounded-xl bg-background/70 p-2 backdrop-blur-md">
          <Button variant="ghost">
            <MessageCircle data-icon="inline-start" />
            会话
          </Button>
          <ThemeModeButton mode={mode} onToggle={onToggle} />
        </div>
      </FloatingBar>
    </div>
  );
}
