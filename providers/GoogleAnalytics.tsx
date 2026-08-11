"use client";

import { useEffect } from "react";

// Read from the environment rather than hardcoding: this repo is public, so an
// ID committed here ships to every fork. A fork deployed without this variable
// set collects nothing, which is the correct default - the operator of a fork
// should be pointing at their own property, not ours.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Second line of defence, against copies of the *built* site rather than the
// repo. A scraper who lifts our HTML inherits the ID baked into the bundle at
// build time; gating on hostname means their copy disables itself.
const ALLOWED_HOSTS = ["ui.8starlabs.com"];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_ID) return;
    if (!ALLOWED_HOSTS.includes(window.location.hostname)) return;

    const src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = src;
      document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];
    // Must push the `arguments` object, not an array. gtag.js only treats a
    // dataLayer entry as a command when it is `[object Arguments]`; a rest
    // parameter produces `[object Array]`, which is discarded without error.
    function gtag() {
      window.dataLayer?.push(arguments);
    }
    window.gtag = gtag as unknown as (...args: unknown[]) => void;
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }, []);

  return null;
}
