import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, type TouchEvent } from "react";
import { getDepartureInfo, heroStories } from "@/data/journeys";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Bottom-right hero story index. Manual only (arrows + horizontal swipe): there is
 * deliberately no autoplay so nothing changes while someone is reading.
 * Keeps the `rc-destination-index` hook so the existing HeroMotion intro/scroll-out applies.
 */
export function HeroJourney() {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const story = heroStories[index] ?? heroStories[0]!;
  const departure = story.journey ? getDepartureInfo(story.journey) : null;
  const go = (delta: number) =>
    setIndex((i) => (i + delta + heroStories.length) % heroStories.length);
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t) touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    const t = e.changedTouches[0];
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(t.clientY - start.y) * 1.5) go(dx < 0 ? 1 : -1);
  };
  return (
    <div
      className="rc-destination-index"
      role="group"
      aria-roledescription="carousel"
      aria-label={`Featured story ${index + 1} of ${heroStories.length}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="rc-story-nav">
        <small aria-hidden>
          {pad(index + 1)} / {pad(heroStories.length)}
        </small>
        <i aria-hidden>
          <b style={{ transform: `scaleX(${(index + 1) / heroStories.length})` }} />
        </i>
        <button type="button" aria-label="Previous story" onClick={() => go(-1)}>
          <ChevronLeft aria-hidden />
        </button>
        <button type="button" aria-label="Next story" onClick={() => go(1)}>
          <ChevronRight aria-hidden />
        </button>
      </div>
      <div className="rc-story-body" key={story.id} aria-live="polite" aria-atomic="true">
        <span className="rc-story-kicker">{story.kicker}</span>
        <strong className="rc-story-title">{story.title}</strong>
        <span className="rc-story-eyebrow">{story.eyebrow}</span>
        {departure && (
          <span className="rc-story-meta">
            {departure.label} · {departure.dates}
            {departure.availability ? ` · ${departure.availability}` : ""}
          </span>
        )}
      </div>
      <Link className="rc-story-cta" to={story.href}>
        {story.cta} <span aria-hidden>→</span>
        <span className="sr-only"> {story.title}</span>
      </Link>
    </div>
  );
}
