"use client";

import { useEffect } from "react";

const GA_ID = "G-RHF72GM2ES";
const GA_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalytics() {
  useEffect(() => {
    if (!document.querySelector(`script[src="${GA_SRC}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = GA_SRC;
      document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }, []);

  return null;
}
