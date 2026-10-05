import { useEffect, useState } from "react";
import { useBooking } from "@/components/booking/BookingContext";
import { BookingRail } from "@/components/booking/BookingRail";
import { WhatsAppLauncher } from "@/components/booking/WhatsAppLauncher";

/** Share of the hero that must scroll past before the action rail appears. */
const REVEAL_PROGRESS = 0.18;

function useRailVisibility(enabled: boolean) {
  const [pastHero, setPastHero] = useState(false);
  const [blocked, setBlocked] = useState({ plan: false, footer: false, menu: false });

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".rc-hero");
    let frame = 0;
    const measure = () => {
      frame = 0;
      const height = hero?.offsetHeight ?? window.innerHeight;
      setPastHero(window.scrollY > height * REVEAL_PROGRESS);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    // The rail must never sit on top of the Plan Trip form (or the footer content).
    const observers: IntersectionObserver[] = [];
    const watch = (selector: string, key: "plan" | "footer") => {
      const el = document.querySelector(selector);
      if (!el) return;
      const io = new IntersectionObserver(([entry]) => {
        if (!entry) return;
        const hit = entry.isIntersecting;
        setBlocked((b) => (b[key] === hit ? b : { ...b, [key]: hit }));
      });
      io.observe(el);
      observers.push(io);
    };
    watch(".rc-plan-trip", "plan");
    watch(".site-footer", "footer");

    // The mobile navigation is a Radix dialog owned by the header; observe it rather than couple to it.
    const syncMenu = () => {
      const open = Boolean(document.querySelector('.mobile-menu[data-state="open"]'));
      setBlocked((b) => (b.menu === open ? b : { ...b, menu: open }));
    };
    const mo = new MutationObserver(syncMenu);
    mo.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-state"],
    });
    syncMenu();
    return () => {
      observers.forEach((io) => io.disconnect());
      mo.disconnect();
    };
  }, []);

  return enabled && pastHero && !blocked.plan && !blocked.footer && !blocked.menu;
}

/**
 * Conversion layer for the homepage: bottom action rail and WhatsApp launcher.
 * Triggers the shared booking overlay via useBooking().
 */
export function BookingLayer() {
  const { openBooking, isBusy } = useBooking();
  const visible = useRailVisibility(!isBusy);

  return (
    <>
      <BookingRail
        visible={visible}
        onPlan={(rect, trigger) => {
          openBooking(trigger, rect);
        }}
      />
      <WhatsAppLauncher visible={visible} />
    </>
  );
}

