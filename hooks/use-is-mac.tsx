import { useMemo } from "react";

export function useIsMac() {
  return useMemo(() => {
    return navigator.userAgent.includes("Mac");
  }, []);
}
