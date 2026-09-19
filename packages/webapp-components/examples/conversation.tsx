"use client";

import { FieldGroup } from "@ziioapp/ui/components/field";
import { useId, useState } from "react";
import {
  Composer,
  ComposerActions,
  ComposerInput,
  ComposerSubmit,
} from "../src/components/composer";
import { FormField } from "../src/components/form-field";

export function ConversationInputExample({
  onSend,
  busy,
}: {
  onSend: (body: string) => void;
  busy: boolean;
}) {
  const id = useId();
  const [value, setValue] = useState("");
  const submit = () => {
    if (!busy && value.trim()) onSend(value);
  };
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <FieldGroup>
        <FormField id={id} label="消息" labelHidden disabled={busy}>
          {(control) => (
            <Composer>
              <ComposerInput
                {...control}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onSubmitShortcut={submit}
              />
              <ComposerActions>
                <ComposerSubmit
                  aria-label="发送消息"
                  busy={busy}
                  disabled={!value.trim()}
                />
              </ComposerActions>
            </Composer>
          )}
        </FormField>
      </FieldGroup>
    </form>
  );
}
