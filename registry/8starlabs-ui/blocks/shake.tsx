"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Injects the `shake-error` keyframes once. It is rendered automatically by the
 * `Shake` component, so you only need to render it yourself when you drive the
 * animation through the `useShake` hook on your own element.
 */
export function ShakeStyles() {
  return (
    <style jsx global>{`
      @keyframes shake-error {
        0% {
          transform: perspective(700px) translate3d(0, 0, 0) rotateY(0deg);
        }
        12% {
          transform: perspective(700px) translate3d(-7px, 0, 0) rotateY(-5deg);
        }
        26% {
          transform: perspective(700px) translate3d(6px, 0, 0) rotateY(4deg);
        }
        41% {
          transform: perspective(700px) translate3d(-5px, 0, 0) rotateY(-3deg);
        }
        56% {
          transform: perspective(700px) translate3d(4px, 0, 0) rotateY(2deg);
        }
        70% {
          transform: perspective(700px) translate3d(-2px, 0, 0) rotateY(-1deg);
        }
        84% {
          transform: perspective(700px) translate3d(1px, 0, 0) rotateY(0.5deg);
        }
        100% {
          transform: perspective(700px) translate3d(0, 0, 0) rotateY(0deg);
        }
      }

      .shake-error {
        animation: shake-error 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        transform-style: preserve-3d;
        backface-visibility: hidden;
      }

      @media (prefers-reduced-motion: reduce) {
        .shake-error {
          animation: none;
        }
      }
    `}</style>
  );
}

/**
 * Imperative API. Attach `ref` to an element and call `shake()` to replay a
 * Stripe-style perspective error wobble. Remember to render `<ShakeStyles />`
 * once when using the hook on its own.
 *
 *   const { ref, shake } = useShake<HTMLFormElement>();
 *   <form ref={ref} onSubmit={(e) => { if (bad) { e.preventDefault(); shake(); } }}>
 */
export function useShake<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const shake = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("shake-error");
    // Force a reflow so re-adding the class restarts the animation every time.
    void el.offsetWidth;
    el.classList.add("shake-error");
  }, []);
  return { ref, shake };
}

interface ShakeProps {
  /**
   * Change this to a new truthy value to trigger a shake (e.g. pass your error
   * message or an incrementing error counter).
   */
  signal: unknown;
  children: ReactNode;
  className?: string;
}

/**
 * Declarative wrapper. Replays the shake whenever `signal` changes to a new
 * truthy value. Respects `prefers-reduced-motion`.
 */
export default function Shake({ signal, children, className }: ShakeProps) {
  const { ref, shake } = useShake<HTMLDivElement>();
  const prev = useRef(signal);

  useEffect(() => {
    if (prev.current !== signal && signal) shake();
    prev.current = signal;
  }, [signal, shake]);

  return (
    <>
      <ShakeStyles />
      <div ref={ref} className={cn(className)}>
        {children}
      </div>
    </>
  );
}
