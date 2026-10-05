import { useEffect } from "react";
import { DESKTOP_QUERY, loadGsap } from "@/lib/gsap";

export function SmoothScroll() {
  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const motionAllowed = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let disposed = false;
    let stopLenis = () => {};

    const sync = async () => {
      stopLenis();
      stopLenis = () => {};
      if (disposed || !desktop.matches || !motionAllowed.matches) return;

      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        loadGsap(),
      ]);
      if (disposed || !desktop.matches || !motionAllowed.matches) return;

      const lenis = new Lenis({
        autoRaf: false,
        smoothWheel: true,
        lerp: 0.1,
        wheelMultiplier: 0.9,
        syncTouch: false,
        anchors: false,
        stopInertiaOnNavigate: true,
      });
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
      const onScroll = () => ScrollTrigger.update();
      const ticker = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", onScroll);
      gsap.ticker.add(ticker);
      // Lenis owns timing on desktop; any lag smoothing would desync scroll and scrubbed timelines.
      gsap.ticker.lagSmoothing(0);
      stopLenis = () => {
        (window as unknown as { __lenis?: unknown }).__lenis = undefined;
        gsap.ticker.remove(ticker);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.off("scroll", onScroll);
        lenis.destroy();
      };
      ScrollTrigger.refresh();
    };

    const onPreferenceChange = () => void sync();
    desktop.addEventListener("change", onPreferenceChange);
    motionAllowed.addEventListener("change", onPreferenceChange);
    void sync();

    return () => {
      disposed = true;
      desktop.removeEventListener("change", onPreferenceChange);
      motionAllowed.removeEventListener("change", onPreferenceChange);
      stopLenis();
    };
  }, []);
  return null;
}
