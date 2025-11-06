import { useLayoutEffect } from "react";

export function useLockBodyScroll(lock: boolean) {
  useLayoutEffect(() => {
    if (lock) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden"; // lock scroll
      return () => {
        document.body.style.overflow = originalStyle; // unlock on cleanup
      };
    }
  }, [lock]);
}
