import { useCallback, useRef } from "react";

const DEFAULT_DURATION_MS = 600;
const GLITCH_CLASS = "animate-glitch";

export function useGlitchEffect(durationMs: number = DEFAULT_DURATION_MS) {
  const timeoutRef = useRef<number | null>(null);

  const triggerGlitch = useCallback(() => {
    if (typeof document === "undefined") return;

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    document.body.classList.add(GLITCH_CLASS);
    timeoutRef.current = window.setTimeout(() => {
      document.body.classList.remove(GLITCH_CLASS);
      timeoutRef.current = null;
    }, durationMs);
  }, [durationMs]);

  return { triggerGlitch };
}

