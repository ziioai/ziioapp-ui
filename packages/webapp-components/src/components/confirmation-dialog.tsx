"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ziioapp/ui/components/alert-dialog";
import { Button } from "@ziioapp/ui/components/button";
import { type ComponentProps, useState } from "react";
import type { ConfirmationRequest } from "../hooks/use-confirmation.js";
/** For custom layouts compose the original AlertDialog parts with useConfirmation. */
export function ConfirmationDialog({
  request,
  onResolve,
  children,
  ...props
}: ComponentProps<typeof AlertDialogContent> & {
  request: ConfirmationRequest | null;
  onResolve: (confirmed: boolean) => void;
}) {
  const [lastRequest, setLastRequest] = useState(request);
  if (request !== null && request !== lastRequest) setLastRequest(request);
  // Retain the resolved request during the dialog exit animation.
  const displayed = request ?? lastRequest;
  return (
    <AlertDialog
      open={request !== null}
      onOpenChange={(open) => {
        if (!open) onResolve(false);
      }}
    >
      <AlertDialogContent size="sm" {...props}>
        {children ?? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {displayed?.title ?? "确认操作"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {displayed?.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => onResolve(false)}>
                {displayed?.cancelLabel ?? "取消"}
              </AlertDialogCancel>
              <AlertDialogAction
                render={
                  <Button
                    variant={displayed?.destructive ? "destructive" : "default"}
                  />
                }
                onClick={() => onResolve(true)}
              >
                {displayed?.confirmLabel ?? "确认"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
