import { useEffect, type RefObject } from "react";
import { DESKTOP_QUERY, SCRUB_DESKTOP, loadGsap } from "@/lib/gsap";

export function DestinationMotion({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    let cleanup = () => {};
    void loadGsap().then(({ gsap }) => {
      if (disposed) return;
      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add(DESKTOP_QUERY, () => {
          const desktop = root.querySelector<HTMLElement>(".rc-destination-desktop");
          const stage = root.querySelector<HTMLElement>(".rc-destination-stage");
          if (!desktop || !stage) return;
          gsap.set(".rc-coast-copy", { autoAlpha: 1, x: 0 });
          gsap.set(".rc-hills-copy", { autoAlpha: 0, x: 50 });
          gsap.set(".rc-map-label-coast", { autoAlpha: 1 });
          gsap.set(".rc-map-label-hills", { autoAlpha: 0 });
          gsap.set(".rc-place-hills", { xPercent: 44 });
          gsap.set(".rc-place-hills img", { scale: 1.1, transformOrigin: "30% 50%" });
          gsap.set(".rc-place-coast img", { scale: 1, transformOrigin: "50% 50%" });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: desktop,
              start: "top top",
              end: "+=140%",
              pin: stage,
              scrub: SCRUB_DESKTOP,
              anticipatePin: 1,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
            },
          });

          // The hills panel must land on 0 so it fully covers the stage (no dark gap at the right).
          // Its clip edge sits ~22% in, so the edge/line travel 44% of the viewport to stay glued to it.
          const WIPE = 0.88;
          const edgeTravel = () => window.innerWidth * -0.44;
          tl.to(".rc-place-hills", { xPercent: 0, ease: "power2.inOut", duration: WIPE }, 0)
            .to(".rc-terrain-edge", { x: edgeTravel, ease: "power2.inOut", duration: WIPE }, 0)
            .to(".rc-journey-line", { x: edgeTravel, ease: "power2.inOut", duration: WIPE }, 0)
            .to(".rc-place-hills img", { scale: 1, ease: "power2.out", duration: WIPE }, 0)
            .to(".rc-place-coast img", { scale: 1.08, ease: "none", duration: WIPE }, 0)
            .to(".rc-coast-copy", { autoAlpha: 0, x: -50, ease: "power2.in", duration: 0.24 }, 0.2)
            .fromTo(".rc-journey-line path", { strokeDashoffset: 1200 }, { strokeDashoffset: 0, ease: "none", duration: 0.65 }, 0.14)
            .fromTo(".rc-hills-copy", { autoAlpha: 0, x: 50 }, { autoAlpha: 1, x: 0, ease: "power3.out", duration: 0.32 }, 0.56)
            .to(".rc-map-label-coast", { autoAlpha: 0, duration: 0.2 }, 0.3)
            .to(".rc-map-label-hills", { autoAlpha: 1, duration: 0.2 }, 0.6)
            .to({}, { duration: 1 - WIPE }, WIPE);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
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