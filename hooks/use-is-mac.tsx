import { useEffect, useState } from "react";

export function useIsMac() {
  // Start `false` so the first client render matches the server (which has no
  // `navigator`). Detect the real platform after mount to avoid a hydration
  // mismatch, then re-render with the correct value.
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent;
    setIsMac(/Macintosh|Mac OS X/.test(ua) && !/iPhone|iPad|iPod/.test(ua));
  }, []);

  return isMac;
}
