"use client";

import { useEffect, useState } from "react";

export function useVisualViewport() {
  const [viewport, setViewport] = useState<{ height: number; top: number }>();
  useEffect(() => {
    const target = window.visualViewport;
    if (!target) return;
    const update = () =>
      setViewport({ height: target.height, top: target.offsetTop });
    update();
    target.addEventListener("resize", update);
    target.addEventListener("scroll", update);
    return () => {
      target.removeEventListener("resize", update);
      target.removeEventListener("scroll", update);
    };
  }, []);
  return viewport;
}
