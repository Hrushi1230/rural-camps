/** Smooth-scrolls to a section (instant under reduced motion) and moves focus to its heading. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  target.querySelector<HTMLElement>("[data-scroll-focus]")?.focus({ preventScroll: true });
}

/** Smooth-scrolls to the top hero section (handles Lenis on desktop and native on mobile). */
export function scrollToTop() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: { immediate?: boolean }) => void } }).__lenis;
  if (lenis) {
    lenis.scrollTo(0, { immediate: reduced });
  } else {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }
}

