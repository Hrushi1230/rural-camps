import { useEffect, type RefObject } from "react";
import { loadGsap } from "@/lib/gsap";

export function RealRuralCampsMotion({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
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
          gsap.from(".rc-real-reveal", {
            y: 26,
            opacity: 0,
            duration: 0.8,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 76%", once: true },
          });
          gsap.from(".rc-moment", {
            y: 28,
            opacity: 0,
            rotate: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: ".rc-moment-collage", start: "top 76%", once: true },
          });
        }, root);
        cleanup = () => ctx.revert();
      },
    );
    return () => { disposed = true; cleanup(); };
  }, [rootRef]);
  return null;
}