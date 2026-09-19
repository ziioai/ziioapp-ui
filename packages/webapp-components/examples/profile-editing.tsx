"use client";

import { Button } from "@ziioapp/ui/components/button";
import { FieldGroup } from "@ziioapp/ui/components/field";
import { Input } from "@ziioapp/ui/components/input";
import { useId, useState } from "react";
import { FormField } from "../src/components/form-field";
import {
  InputDrawer,
  InputDrawerActions,
  InputDrawerBody,
} from "../src/components/input-drawer";
import {
  PropertyList,
  PropertyRow,
  PropertyRowAction,
  PropertyRowLabel,
  PropertyRowValue,
} from "../src/components/property-list";

export function ProfileEditingExample({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  return (
    <>
      <PropertyList aria-label="资料">
        <PropertyRow
          render={
            <button
              type="button"
              onClick={() => {
                setDraft(value);
                setOpen(true);
              }}
            />
          }
        >
          <PropertyRowLabel>名字</PropertyRowLabel>
          <PropertyRowValue placeholder="未填写">{value}</PropertyRowValue>
          <PropertyRowAction />
        </PropertyRow>
      </PropertyList>
      <InputDrawer
        title="名字"
        closeLabel="取消编辑"
        open={open}
        onOpenChange={setOpen}
      >
        <InputDrawerBody>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onValueChange(draft);
              setOpen(false);
            }}
          >
            <FieldGroup>
              <FormField id={id} label="名字">
                {(control) => (
                  <Input
                    {...control}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                  />
                )}
              </FormField>
              <InputDrawerActions>
                <Button type="submit">完成</Button>
              </InputDrawerActions>
            </FieldGroup>
          </form>
        </InputDrawerBody>
      </InputDrawer>
    </>
  );
}
