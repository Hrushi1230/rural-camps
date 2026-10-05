type GsapBundle = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let gsapBundlePromise: Promise<GsapBundle> | undefined;

/** Desktop breakpoint shared by Lenis and every pinned/scrubbed sequence. */
export const DESKTOP_QUERY = "(min-width: 1100px)";

/**
 * Scrub smoothing. Lenis already eases desktop scroll, so extra scrub lag would
 * stack two smoothings and feel floaty. Touch devices have native momentum, so
 * they get a short catch-up only.
 */
export const SCRUB_DESKTOP = 0.35;
export const SCRUB_TOUCH = 0.5;

export function loadGsap(): Promise<GsapBundle> {
  gsapBundlePromise ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
    ([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      // Promote animated nodes to GPU layers with 3D transforms and never warn on optional targets.
      gsap.config({ force3D: true, nullTargetWarn: false });
      ScrollTrigger.config({
        // Mobile URL-bar show/hide fires resize; refreshing on it makes pinned layouts jump.
        ignoreMobileResize: true,
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      });
      // Stop catch-up jumps after a tab stall while keeping a bounded correction on touch devices.
      gsap.ticker.lagSmoothing(500, 33);
      return { gsap, ScrollTrigger };
    },
  );
  return gsapBundlePromise;
}