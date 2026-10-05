import { useEffect, type RefObject } from "react";
import { DESKTOP_QUERY, SCRUB_DESKTOP, loadGsap } from "@/lib/gsap";

export function RentCampMotion({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
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
          const mm = gsap.matchMedia();
          mm.add(DESKTOP_QUERY, () => {
            const desktop = root.querySelector<HTMLElement>(".rc-rent-desktop");
            const stage = desktop?.querySelector<HTMLElement>(".rc-rent-stage");
            if (!desktop || !stage) return;
            const steps = gsap.utils.toArray<HTMLElement>(".rc-rent-desktop .rc-rent-step", root);
            const frames = gsap.utils.toArray<HTMLElement>(".rc-rent-desktop .rc-rent-frame", root);
            gsap.set(steps, { opacity: 0.42, y: 8 });
            gsap.set(frames, { autoAlpha: 0 });
            const firstStep = steps[0];
            const firstFrame = frames[0];
            if (firstStep) gsap.set(firstStep, { opacity: 1, y: 0 });
            if (firstFrame) gsap.set(firstFrame, { autoAlpha: 1 });
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: desktop,
                start: "top top",
                end: "+=155%",
                pin: stage,
                scrub: SCRUB_DESKTOP,
                anticipatePin: 1,
                fastScrollEnd: true,
                invalidateOnRefresh: true,
              },
            });
            timeline
              .to(frames, { scale: 1.015, ease: "none", duration: 1 }, 0)
              .fromTo(".rc-rent-ready-glow", { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.35 }, 0.62);
            steps.forEach((step, index) => {
              const position = index / Math.max(steps.length - 1, 1);
              timeline.to(step, { opacity: 1, y: 0, duration: 0.1 }, position);
              const previousStep = steps[index - 1];
              if (previousStep) {
                timeline.to(previousStep, { opacity: 0.62, duration: 0.08 }, position);
              }
              const frame = frames[index];
              const previousFrame = frames[index - 1];
              if (frame && index > 0) {
                timeline.to(frame, { autoAlpha: 1, duration: 0.12, ease: "none" }, position - 0.06);
              }
              if (previousFrame) {
                timeline.to(previousFrame, { autoAlpha: 0, duration: 0.12, ease: "none" }, position);
              }
            });
            return () => {
              timeline.scrollTrigger?.kill();
              timeline.kill();
            };
          });
          cleanup = () => {
            mm.revert();
            ctx.revert();
          };
        }, root);
      },
    );
    return () => { disposed = true; cleanup(); };
  }, [rootRef]);
  return null;
}