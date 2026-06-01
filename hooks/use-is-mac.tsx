import { useMemo } from "react";

export function useIsMac() {
  return useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    return /Macintosh|Mac OS X/.test(ua) && !/iPhone|iPad|iPod/.test(ua);
  }, []);
}
