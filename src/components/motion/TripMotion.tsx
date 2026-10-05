import { useEffect, type RefObject } from "react";
import { SCRUB_DESKTOP, loadGsap } from "@/lib/gsap";

/**
 * Trip page choreography: hero intro + gentle scroll-out, section reveals, and the
 * scrubbed route draw. No pinning. Everything is scoped to the page root and reverted on unmount.
 * Initial CSS state is fully visible, so reduced-motion and failures never hide content.
 */
export function TripMotion({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    let cleanup = () => {};
    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (disposed) return;
      const ctx = gsap.context(() => {
        gsap
          .timeline()
          .from(".rc-trip-hero .rc-hero-eyebrow", { y: 18, opacity: 0, duration: 0.65, ease: "power3.out" }, 0.3)
          .from(".rc-trip-hero .rc-title-mask > span", { yPercent: 110, duration: 0.9, stagger: 0.12, ease: "power4.out" }, 0.45)
          .from(".rc-trip-hero .rc-hero-action > p", { y: 20, opacity: 0, duration: 0.65 }, 0.8)
          .from(".rc-trip-hero .rc-hero-action a", { y: 20, opacity: 0, duration: 0.65 }, 0.95)
          .from(".rc-trip-hero .rc-scroll-cue", { opacity: 0, duration: 0.6 }, 1.1)
          .fromTo(".rc-trip-hero .rc-hero-media", { scale: 1.02 }, { scale: 1, duration: 1.4, ease: "power2.out" }, 0);

        gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((el) => {
          gsap.from(el, {
            y: 28,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        const mm = gsap.matchMedia();
        mm.add("(min-width: 1100px)", () => {
          const out = gsap.to(".rc-trip-hero .rc-hero-media", {
            scale: 1.035,
            ease: "none",
            scrollTrigger: { trigger: ".rc-trip-hero", start: "top top", end: "bottom top", scrub: SCRUB_DESKTOP },
          });
          return () => {
            out.scrollTrigger?.kill();
            out.kill();
          };
        });
        mm.add("(min-width: 768px)", () => {
          const stops = gsap.utils.toArray<HTMLElement>(".rc-trip-stop", root);
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".rc-trip-board",
              start: "top 70%",
              end: "bottom 62%",
              scrub: SCRUB_DESKTOP,
              invalidateOnRefresh: true,
            },
          });
          tl.fromTo(".rc-trip-line", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 }, 0);
          const points = [0.06, 0.28, 0.5, 0.72, 0.92];
          stops.forEach((stop, i) => {
            tl.fromTo(stop, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.08, ease: "power2.out" }, points[i] ?? 0.9);
          });
          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        });
        mm.add("(max-width: 767px)", () => {
          gsap.utils.toArray<HTMLElement>(".rc-trip-stop", root).forEach((stop) => {
            gsap.from(stop, {
              y: 24,
              autoAlpha: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: { trigger: stop, start: "top 90%", once: true },
            });
          });
        });
        cleanup = () => {
          mm.revert();
        };
      }, root);
      const refresh = () => ScrollTrigger.refresh();
      void document.fonts?.ready.then(() => {
        if (!disposed) refresh();
      });
      root.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
        if (!img.complete) img.addEventListener("load", refresh, { once: true });
      });
      const prev = cleanup;
      cleanup = () => {
        prev();
        ctx.revert();
      };
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [rootRef]);
  return null;
}
