import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { featuredJourney, getDepartureInfo } from "@/data/journeys";
import { koraputJourneyMedia, koraputStops } from "@/data/site";

/** Stops named in the banner are the published route stops; nothing here is a schedule claim. */
const bannerStops = [koraputStops[1], koraputStops[2], koraputStops[4]].join(" · ");

/**
 * Hero journey banner. The label only reads "UPCOMING" once the owner has verified a schedule;
 * until then it stays "FEATURED" and never shows a date or availability.
 */
export function HeroBanner() {
  const departure = getDepartureInfo(featuredJourney);
  const label = departure ? "UPCOMING JOURNEY" : featuredJourney.eyebrow;
  return (
    <aside className="rc-hero-banner" aria-label={label.toLowerCase()}>
      <div className="rc-banner-copy">
        <p className="rc-banner-label">{label}</p>
        <h2>{featuredJourney.title}</h2>
        <p className="rc-banner-sub">{featuredJourney.subtitle}</p>
        <p className="rc-banner-stops">
          {departure
            ? `${departure.label} · ${departure.dates}${departure.availability ? ` · ${departure.availability}` : ""}`
            : bannerStops}
        </p>
      </div>
      <figure className="rc-banner-media" aria-hidden>
        <img src={koraputJourneyMedia.hero} alt="" width="900" height="360" loading="eager" />
      </figure>
      <Link className="rc-banner-cta" to={featuredJourney.href}>
        VIEW TRIP <ArrowRight aria-hidden />
        <span className="sr-only"> — Koraput 2-day journey</span>
      </Link>
    </aside>
  );
}
