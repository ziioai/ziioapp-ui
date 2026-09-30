import { type Ref, type RefCallback, type RefObject, useMemo } from "react";
/** React 19 callback refs may return cleanup; preserve that contract. */
export function useMergedRef<T>(
  internal: RefObject<T | null>,
  external?: Ref<T>,
): RefCallback<T> {
  return useMemo(
    () => (node) => {
      internal.current = node;
      const cleanup =
        typeof external === "function" ? external(node) : undefined;
      if (external && typeof external !== "function") external.current = node;
      return () => {
        internal.current = null;
        if (typeof cleanup === "function") cleanup();
        else if (typeof external === "function") external(null);
        else if (external) external.current = null;
      };
    },
    [internal, external],
  );
}
