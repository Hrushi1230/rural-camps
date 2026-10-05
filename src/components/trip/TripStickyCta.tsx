import { useEffect, useState } from "react";
import { scrollToSection } from "@/lib/scroll";

/**
 * Appears once the hero has left the viewport and hides while the booking section is on screen.
 * Desktop: floating bar. Mobile: fixed full-width bar with the short label.
 */
export function TripStickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [atBooking, setAtBooking] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".rc-trip-hero");
    const book = document.getElementById("book");
    const observers: IntersectionObserver[] = [];
    if (hero) {
      const io = new IntersectionObserver(([entry]) => {
        if (entry) setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      });
      io.observe(hero);
      observers.push(io);
    }
    if (book) {
      const io = new IntersectionObserver(([entry]) => {
        if (entry) setAtBooking(entry.isIntersecting);
      });
      io.observe(book);
      observers.push(io);
    }
    return () => observers.forEach((io) => io.disconnect());
  }, []);

  const visible = pastHero && !atBooking;
  return (
    <div className="rc-trip-cta" data-visible={visible} role="region" aria-label="Book this journey">
      <p>KORAPUT · 2 DAYS</p>
      <button type="button" onClick={() => scrollToSection("book")} tabIndex={visible ? 0 : -1}>
        <span className="rc-trip-cta-long">BOOK THIS JOURNEY</span>
        <span className="rc-trip-cta-short">BOOK</span> <span aria-hidden>→</span>
      </button>
    </div>
  );
}
