import { useEffect, type RefObject } from "react";
import { loadGsap } from "@/lib/gsap";

export function ExperienceMotion({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    let cleanup = () => {};
    void loadGsap().then(({ gsap }) => {
      if (disposed) return;
      const ctx = gsap.context(() => {
        gsap.from(".rc-experience-heading > *", { y: 70, opacity: 0, duration: 1, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: root, start: "top 76%", once: true } });
        const mm = gsap.matchMedia();
        mm.add("(min-width: 768px)", () => {
          const starts = [{ x: -60 }, { y: -45 }, { y: 55 }, { x: 55 }];
          root.querySelectorAll<HTMLElement>(".rc-exp").forEach((node, index) => {
            gsap.from(node, { ...starts[index], opacity: 0, scale: 0.96, duration: 1.05, delay: index * 0.09, ease: "power3.out", scrollTrigger: { trigger: root, start: "top 55%", once: true } });
          });
        });
        mm.add("(max-width: 767px)", () => {
          root.querySelectorAll<HTMLElement>(".rc-exp").forEach((node) => {
            gsap.from(node, { y: 24, opacity: 0, duration: 0.65, ease: "power2.out", scrollTrigger: { trigger: node, start: "top 88%", once: true } });
          });
        });
        cleanup = () => {
          mm.revert();
          ctx.revert();
        };
      }, root);
    });
    return () => { disposed = true; cleanup(); };
  }, [rootRef]);
  return null;
}