import { createSignal, onCleanup, onMount, type Accessor } from "solid-js";

/**
 * prefersReducedMotion reads the OS setting once on the client. Returns false
 * during SSR so markup renders in its final (un-animated) state either way.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * useInView flips to true the first time the element scrolls into view. Under
 * reduced-motion (or without IntersectionObserver) it starts true so nothing
 * depends on an animation that will never run.
 */
export function useInView(options?: IntersectionObserverInit): {
  ref: (el: Element) => void;
  inView: Accessor<boolean>;
} {
  const [inView, setInView] = createSignal(false);
  let el: Element | undefined;

  onMount(() => {
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      options ?? { rootMargin: "0px 0px -20% 0px", threshold: 0.15 },
    );
    if (el) observer.observe(el);
    onCleanup(() => observer.disconnect());
  });

  return {
    ref: (node: Element) => {
      el = node;
    },
    inView,
  };
}
