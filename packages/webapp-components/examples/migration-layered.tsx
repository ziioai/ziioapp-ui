"use client";
import { Button } from "@ziioapp/ui/components/button";
import { FieldDescription, FieldLabel } from "@ziioapp/ui/components/field";
import { Input } from "@ziioapp/ui/components/input";
import {
  InputGroupAddon,
  InputGroupInput,
} from "@ziioapp/ui/components/input-group";
import { MarkerIcon } from "@ziioapp/ui/components/marker";
import { useState } from "react";
import {
  ConversationItemAvatar,
  ConversationItemContent,
  ConversationItemPreview,
  ConversationItemRoot,
  ConversationItemTitle,
} from "../src/blocks/conversation-item.js";
import {
  SearchHeaderBackdrop,
  SearchHeaderClose,
  SearchHeaderRoot,
  SearchHeaderSearch,
  SearchHeaderSearchClip,
  SearchHeaderSearchContent,
  SearchHeaderTouchGuard,
  SearchHeaderTrigger,
} from "../src/blocks/searchable-page-header.js";
import {
  Composer,
  ComposerActions,
  ComposerInput,
  ComposerSubmit,
} from "../src/components/composer.js";
import {
  ExpandableNoteArrow,
  ExpandableNoteBody,
  ExpandableNoteContent,
  ExpandableNoteHeader,
  ExpandableNoteRoot,
  ExpandableNoteTitle,
  ExpandableNoteTrigger,
} from "../src/components/expandable-note.js";
import { PageHeader, PageHeaderTitle } from "../src/components/page-header.js";
import {
  ParticipantAvatarCell,
  ParticipantAvatarFallback,
  ParticipantAvatarFrame,
  ParticipantAvatarGrid,
  ParticipantAvatarOverflow,
} from "../src/components/participant-avatar.js";
import {
  SearchInputAction,
  SearchInputControl,
  SearchInputIcon,
  SearchInputRoot,
} from "../src/components/search-input.js";
import {
  SecretInputRoot,
  SecretInputToggle,
} from "../src/components/secret-input.js";
import {
  SettingsGroupContent,
  SettingsGroupRoot,
  SettingsGroupTitle,
  SettingsRowActions,
  SettingsRowContent,
  SettingsRowControl,
  SettingsRowRoot,
} from "../src/components/settings-layout.js";
import {
  SettingsNavigationArrow,
  SettingsNavigationItemRoot,
  SettingsNavigationLabel,
  SettingsNavigationRoot,
  SettingsNavigationTrailing,
} from "../src/components/settings-navigation.js";

/** Each layer accepts className, DOM props and ref. No xxxClassName style bags. */
export function LayeredExamples() {
  const [text, setText] = useState(""),
    [visible, setVisible] = useState(false),
    [open, setOpen] = useState(false);
  return (
    <section className="flex flex-col gap-5" aria-label="分层组合示例">
      <SearchInputRoot className="rounded-lg">
        <SearchInputControl
          aria-label="分层搜索"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <SearchInputIcon />
        <InputGroupAddon align="inline-end">
          <SearchInputAction onClick={() => setText("")} />
        </InputGroupAddon>
      </SearchInputRoot>
      <SecretInputRoot>
        <InputGroupInput
          type={visible ? "text" : "password"}
          aria-label="分层密钥"
        />
        <InputGroupAddon align="inline-end">
          <SecretInputToggle visible={visible} onVisibleChange={setVisible} />
        </InputGroupAddon>
      </SecretInputRoot>
      <ParticipantAvatarFrame
        className="size-16 rounded-lg"
        aria-label="玲、夏和另外六人"
      >
        <ParticipantAvatarGrid count={3}>
          <ParticipantAvatarCell>
            <ParticipantAvatarFallback>玲</ParticipantAvatarFallback>
          </ParticipantAvatarCell>
          <ParticipantAvatarCell>
            <ParticipantAvatarFallback>夏</ParticipantAvatarFallback>
          </ParticipantAvatarCell>
          <ParticipantAvatarCell>
            <ParticipantAvatarOverflow count={6} />
          </ParticipantAvatarCell>
        </ParticipantAvatarGrid>
      </ParticipantAvatarFrame>
      <SettingsGroupRoot>
        <SettingsGroupTitle>分层设置行</SettingsGroupTitle>
        <SettingsGroupContent>
          <SettingsRowRoot>
            <SettingsRowContent>
              <FieldLabel htmlFor="layered-setting">名称</FieldLabel>
              <FieldDescription>内部区域直接设置 className。</FieldDescription>
            </SettingsRowContent>
            <SettingsRowControl className="sm:w-40">
              <Input id="layered-setting" />
            </SettingsRowControl>
            <SettingsRowActions>
              <Button size="sm">保存</Button>
            </SettingsRowActions>
          </SettingsRowRoot>
        </SettingsGroupContent>
      </SettingsGroupRoot>
      <SettingsNavigationRoot>
        <SettingsNavigationItemRoot>
          <SettingsNavigationLabel>自定义条目</SettingsNavigationLabel>
          <SettingsNavigationTrailing>说明</SettingsNavigationTrailing>
          <SettingsNavigationArrow />
        </SettingsNavigationItemRoot>
      </SettingsNavigationRoot>
      <ExpandableNoteRoot>
        <ExpandableNoteHeader>
          <ExpandableNoteTrigger>
            <ExpandableNoteTitle>分层说明</ExpandableNoteTitle>
            <MarkerIcon>
              <ExpandableNoteArrow />
            </MarkerIcon>
          </ExpandableNoteTrigger>
        </ExpandableNoteHeader>
        <ExpandableNoteContent>
          <ExpandableNoteBody className="px-0">
            自定义内容区。
          </ExpandableNoteBody>
        </ExpandableNoteContent>
      </ExpandableNoteRoot>
      <SearchHeaderRoot
        className="relative"
        searchOpen={open}
        onSearchOpenChange={setOpen}
      >
        <SearchHeaderBackdrop />
        <SearchHeaderTouchGuard />
        <PageHeader>
          <PageHeaderTitle>分层标题栏</PageHeaderTitle>
          <SearchHeaderTrigger aria-label="打开分层搜索" />
        </PageHeader>
        <SearchHeaderSearch>
          <SearchHeaderSearchClip>
            <SearchHeaderSearchContent>
              <SearchInputRoot>
                <SearchInputControl aria-label="分层标题搜索" />
                <SearchInputIcon />
              </SearchInputRoot>
              <SearchHeaderClose />
            </SearchHeaderSearchContent>
          </SearchHeaderSearchClip>
        </SearchHeaderSearch>
      </SearchHeaderRoot>
      <ConversationItemRoot>
        <ConversationItemAvatar className="self-center">
          <ParticipantAvatarFrame aria-label="玲">
            <ParticipantAvatarCell>
              <ParticipantAvatarFallback>玲</ParticipantAvatarFallback>
            </ParticipantAvatarCell>
          </ParticipantAvatarFrame>
        </ConversationItemAvatar>
        <ConversationItemContent>
          <ConversationItemTitle>自定义会话条目</ConversationItemTitle>
          <ConversationItemPreview>
            内部区域均可独立调整。
          </ConversationItemPreview>
        </ConversationItemContent>
      </ConversationItemRoot>
      <Composer>
        <ComposerInput
          aria-label="分层消息"
          submitShortcut="none"
          placeholder="由调用方组合操作与行为"
        />
        <ComposerActions>
          <ComposerSubmit type="button" aria-label="发送示例" />
        </ComposerActions>
      </Composer>
    </section>
  );
}
