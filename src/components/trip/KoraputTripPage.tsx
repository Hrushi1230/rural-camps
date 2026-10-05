import { ArrowDown, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { TripMotion } from "@/components/motion/TripMotion";
import { TripStickyCta } from "@/components/trip/TripStickyCta";
import { Button } from "@/components/ui/button";
import {
  getTripSnapshot,
  tripDays,
  tripGallery,
  tripIntroImage,
  tripLandscape,
  tripStops,
  travelNotes,
} from "@/data/koraput-trip";
import { planTripBackground, tour } from "@/data/site";
import { scrollToSection } from "@/lib/scroll";

const pad = (n: number) => String(n).padStart(2, "0");

export function KoraputTripPage() {
  const rootRef = useRef<HTMLElement>(null);
  const snapshot = getTripSnapshot();
  const goBook = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    scrollToSection("book");
  };
  return (
    <main ref={rootRef} className="rc-trip">
      <TripMotion rootRef={rootRef} />

      {/* 01 — Cinematic trip hero */}
      <section className="rc-hero rc-trip-hero" aria-labelledby="trip-title">
        <img
          className="rc-hero-media"
          src={tripLandscape}
          alt="Temporary editorial visual inspired by a road through the Koraput highlands"
          width="1600"
          height="1000"
          fetchPriority="high"
        />
        <div className="rc-hero-shade" aria-hidden />
        <div className="rc-hero-content">
          <p className="eyebrow rc-hero-eyebrow">KORAPUT · ODISHA</p>
          <h1 id="trip-title" aria-label="02 days in Koraput.">
            <span className="rc-title-mask" aria-hidden>
              <span>02 DAYS</span>
            </span>
            <span className="rc-title-mask" aria-hidden>
              <span>IN KORAPUT.</span>
            </span>
          </h1>
          <div className="rc-hero-action">
            <p>
              One road. Five moments.
              <br />
              Hills, waterfalls, forests and villages —
              <br />a journey through the real Odisha.
            </p>
            <Button asChild size="lg" className="rc-cream-button">
              <a href="#book" onClick={goBook}>
                BOOK THIS JOURNEY <ArrowRight />
              </a>
            </Button>
          </div>
        </div>
        <div className="rc-scroll-cue" aria-hidden>
          <span>Scroll</span>
          <ArrowDown />
        </div>
      </section>

      {/* 02 — Trip snapshot */}
      <section className="rc-trip-snapshot" aria-label="Trip snapshot">
        <p className="eyebrow" data-reveal>
          02 · TRIP SNAPSHOT
        </p>
        <dl>
          {snapshot.map((item) => (
            <div key={item.label} data-reveal>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 03 — Journey introduction */}
      <section className="rc-trip-intro" aria-labelledby="trip-intro-title">
        <div className="rc-trip-intro-copy">
          <p className="eyebrow" data-reveal>
            03 · THE JOURNEY
          </p>
          <h2 id="trip-intro-title" data-reveal>
            FIVE STOPS.
            <br />
            <em>TWO DAYS OUT.</em>
          </h2>
          <p className="rc-trip-lead" data-reveal>
            {tour.summary}
          </p>
          <p data-reveal>
            The published route provides the shape of the journey. Final timings are confirmed for
            your date.
          </p>
        </div>
        <figure className="rc-trip-intro-media" data-reveal>
          <img
            src={tripIntroImage}
            alt="Temporary editorial visual of a road into the Koraput hills"
            loading="lazy"
            width="1200"
            height="1500"
          />
        </figure>
      </section>

      {/* 04 — Five-stop route */}
      <section className="rc-trip-route" aria-labelledby="trip-route-title">
        <div className="rc-journey-topography" aria-hidden />
        <header className="rc-trip-route-head">
          <p className="eyebrow" data-reveal>
            04 · THE ROUTE
          </p>
          <h2 id="trip-route-title" data-reveal>
            ONE ROAD,
            <br />
            <em>FIVE MOMENTS.</em>
          </h2>
        </header>
        <ol className="rc-trip-board">
          <svg className="rc-trip-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <path
              vectorEffect="non-scaling-stroke"
              d="M40 0 L40 10 C40 20 60 20 60 30 C60 40 40 40 40 50 C40 60 60 60 60 70 C60 80 40 80 40 90 L40 100"
            />
          </svg>
          {tripStops.map((stop) => (
            <li className={`rc-trip-stop rc-trip-stop-${stop.order}`} key={stop.name}>
              <span className="rc-trip-node" aria-hidden />
              <img src={stop.image} alt="" loading="lazy" width="800" height="520" />
              <div>
                <small>
                  {pad(stop.order)} <span>/ DAY {pad(stop.day)}</span>
                </small>
                <h3>{stop.name}</h3>
                <p>{stop.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 05 — Day 01 / Day 02 itinerary */}
      <section className="rc-trip-days" aria-labelledby="trip-days-title">
        <h2 id="trip-days-title" className="sr-only">
          Day by day itinerary
        </h2>
        {tripDays.map((day) => (
          <article className="rc-trip-day" key={day.day}>
            <header>
              <p className="eyebrow" data-reveal>
                05 · DAY {pad(day.day)}
              </p>
              <span className="rc-trip-day-number" aria-hidden data-reveal>
                {pad(day.day)}
              </span>
              <h3 data-reveal>
                {day.title.split(day.emphasis)[0]}
                <em>{day.emphasis}</em>
                {day.title.split(day.emphasis)[1]}
              </h3>
            </header>
            <ol>
              {day.stops.map((stop) => (
                <li key={stop.name} data-reveal>
                  <span>{pad(stop.order)}</span>
                  <div>
                    <h4>{stop.name}</h4>
                    <p>{stop.itinerary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </section>

      {/* 06 — Journey gallery */}
      <section className="rc-trip-gallery" aria-labelledby="trip-gallery-title">
        <header>
          <p className="eyebrow" data-reveal>
            06 · GALLERY
          </p>
          <h2 id="trip-gallery-title" data-reveal>
            ALONG THE <em>ROAD.</em>
          </h2>
          <p data-reveal>Temporary editorial visuals while real journey photography is added.</p>
        </header>
        <div className="rc-trip-gallery-grid">
          {tripGallery.map((shot, index) => (
            <figure className={`rc-trip-shot rc-trip-shot-${index + 1}`} key={shot.caption} data-reveal>
              <img src={shot.src} alt="" loading="lazy" width="900" height="900" />
              <figcaption>{shot.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 07 — Travel notes */}
      <section className="rc-trip-notes" aria-labelledby="trip-notes-title">
        <header>
          <p className="eyebrow" data-reveal>
            07 · TRAVEL NOTES
          </p>
          <h2 id="trip-notes-title" data-reveal>
            CONFIRM BEFORE
            <br />
            <em>YOU SET OUT.</em>
          </h2>
        </header>
        <ol>
          {travelNotes.map((note, index) => (
            <li key={note.title} data-reveal>
              <span>{pad(index + 1)}</span>
              <div>
                <h3>{note.title}</h3>
                <p>{note.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 08 — Book this journey (shared BookingForm: same schema, form state, WhatsApp + analytics) */}
      <section id="book" className="rc-plan-trip rc-trip-book" aria-labelledby="trip-book-title">
        <img
          className="rc-plan-background"
          src={planTripBackground}
          alt=""
          loading="lazy"
          width="1600"
          height="1000"
        />
        <div className="rc-plan-shade" />
        <div className="rc-plan-copy">
          <p className="eyebrow">08 · Book this journey</p>
          <h2 id="trip-book-title" tabIndex={-1} data-scroll-focus>
            Book this
            <br />
            journey.
          </h2>
          <p>
            Tell us when and who.
            <br />
            We’ll confirm the plan on WhatsApp.
          </p>
        </div>
        <BookingForm
          compact
          arrow="right"
          defaultExperience="Koraput Tour"
          defaultDestination="Koraput 2-Day Journey"
          className="rc-plan-form"
        />
      </section>

      <TripStickyCta />
    </main>
  );
}
