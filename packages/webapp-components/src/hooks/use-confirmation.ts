"use client";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
export type ConfirmationRequest = {
  title?: ReactNode;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};
/** Headless: the host renders ConfirmationDialog or composes AlertDialog itself. */
export function useConfirmation() {
  const [request, setRequest] = useState<ConfirmationRequest | null>(null);
  const pending = useRef<((confirmed: boolean) => void) | null>(null);
  const finish = useCallback((confirmed: boolean) => {
    pending.current?.(confirmed);
    pending.current = null;
    setRequest(null);
  }, []);
  useEffect(
    () => () => {
      pending.current?.(false);
      pending.current = null;
    },
    [],
  );
  const confirm = useCallback(
    (next: ConfirmationRequest | string) =>
      new Promise<boolean>((resolve) => {
        pending.current?.(false);
        pending.current = resolve;
        setRequest(typeof next === "string" ? { description: next } : next);
      }),
    [],
  );
  return { request, confirm, finish };
}
