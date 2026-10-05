import { useEffect, type RefObject } from "react";
import { SCRUB_DESKTOP, loadGsap } from "@/lib/gsap";

export function KoraputJourneyMotion({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    let cleanup = () => {};
    void loadGsap().then(
      ({ gsap }) => {
        if (disposed) return;
        const ctx = gsap.context(() => {
          gsap.from(".rc-journey-reveal", {
            y: 28,
            opacity: 0,
            duration: 0.85,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 78%", once: true },
          });
          const mm = gsap.matchMedia();
          mm.add("(min-width: 768px)", () => {
            const stops = gsap.utils.toArray<HTMLElement>(".rc-journey-stop", root);
            const timeline = gsap.timeline({
              scrollTrigger: { trigger: ".rc-journey-board", start: "top 82%", end: "bottom 68%", scrub: SCRUB_DESKTOP, invalidateOnRefresh: true },
            });
            timeline.fromTo(".rc-route-draw", { strokeDashoffset: 1200 }, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);
            const revealPoints = [0.1, 0.28, 0.46, 0.66, 0.84];
            stops.forEach((stop, index) => {
              timeline.fromTo(stop, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.08, ease: "power2.out" }, revealPoints[index] ?? 0.84);
            });
            return () => { timeline.scrollTrigger?.kill(); timeline.kill(); };
          });
          mm.add("(max-width: 767px)", () => {
            gsap.set(".rc-route-draw", { strokeDashoffset: 0 });
            root.querySelectorAll<HTMLElement>(".rc-journey-stop").forEach((stop) => {
              gsap.from(stop, { y: 24, autoAlpha: 0, duration: 0.55, ease: "power2.out", scrollTrigger: { trigger: stop, start: "top 88%", once: true } });
            });
          });
          gsap.fromTo(
            ".rc-journey-landscape img",
            { scale: 1.03 },
            { scale: 1, duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: root, start: "top 75%", once: true } },
          );
          cleanup = () => { mm.revert(); ctx.revert(); };
        }, root);
      },
    );
    return () => { disposed = true; cleanup(); };
  }, [rootRef]);
  return null;
}