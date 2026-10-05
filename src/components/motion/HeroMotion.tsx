import { useEffect, type RefObject } from "react";
import { DESKTOP_QUERY, SCRUB_DESKTOP, SCRUB_TOUCH, loadGsap } from "@/lib/gsap";

export function HeroMotion({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    let cleanup = () => {};
    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (disposed) return;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();
        const siteHeader = document.querySelector<HTMLElement>(".site-header");
        if (siteHeader) tl.from(siteHeader, { y: -18, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.2);
        tl.from(".rc-hero-eyebrow", { y: 18, opacity: 0, duration: 0.65, ease: "power3.out" }, 0.35)
          .from(".rc-title-mask > span", { yPercent: 110, duration: 0.9, stagger: 0.12, ease: "power4.out" }, 0.5)
          .from(".rc-hero-action > p", { y: 20, opacity: 0, duration: 0.65 }, 0.8)
          .from(".rc-hero-action a", { y: 20, opacity: 0, duration: 0.65 }, 0.95)
          .from([".rc-scroll-cue", ".rc-destination-index"], { opacity: 0, duration: 0.6 }, 1.1)
          .fromTo(".rc-hero-media", { scale: 1.02 }, { scale: 1, duration: 1.4, ease: "power2.out" }, 0)
          .fromTo(".rc-hero-banner", { clipPath: "inset(0% 100% 0% 0% round 10px)", y: -14 }, { clipPath: "inset(0% 0% 0% 0% round 10px)", y: 0, duration: 1, ease: "power3.inOut", clearProps: "clipPath,transform" }, 0.9)
          .fromTo(".rc-banner-media img", { scale: 1.15 }, { scale: 1, duration: 1.6, ease: "power2.out" }, 0.9);
        const mm = gsap.matchMedia();
        const scrollOut = (scrub: number, withMedia: boolean) => {
          const out = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub, invalidateOnRefresh: true },
          });
          out
            .to(".rc-destination-index", { opacity: 0, y: -12 }, 0)
            .to(".rc-hero-action", { opacity: 0.35, y: -22 }, 0.05)
            .to(".rc-hero-content h1", { y: -44 }, 0);
          if (withMedia) out.to(".rc-hero-media", { scale: 1.035 }, 0);
          return () => {
            out.scrollTrigger?.kill();
            out.kill();
          };
        };
        mm.add(DESKTOP_QUERY, () => scrollOut(SCRUB_DESKTOP, true));
        mm.add(`(max-width: 1099px)`, () => scrollOut(SCRUB_TOUCH, false));
      }, root);
      const refresh = () => ScrollTrigger.refresh();
      const heroMedia = root.querySelector<HTMLImageElement>(".rc-hero-media");
      if (heroMedia && !heroMedia.complete) heroMedia.addEventListener("load", refresh, { once: true });
      void document.fonts?.ready.then(() => {
        if (!disposed) refresh();
      });
      cleanup = () => ctx.revert();
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [rootRef]);
  return null;
}