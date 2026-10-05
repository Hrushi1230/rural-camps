import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { koraputJourneyMedia, koraputJourneyStops } from "@/data/site";
import { KoraputJourneyMotion } from "@/components/motion/KoraputJourneyMotion";
import { useRef } from "react";

export function KoraputJourneySection() {
  const rootRef = useRef<HTMLElement>(null);
  return (
    <section ref={rootRef} className="rc-koraput-journey" aria-labelledby="koraput-journey-title">
      <KoraputJourneyMotion rootRef={rootRef} />
      <div className="rc-journey-topography" aria-hidden />
      <header className="rc-journey-intro">
        <p className="eyebrow rc-journey-reveal">05 · Journeys, not just stays</p>
        <h2 className="rc-journey-reveal" id="koraput-journey-title">02 days<br />in Koraput.</h2>
        <p className="rc-journey-lead rc-journey-reveal">One road. Five moments.<br />Hills, waterfalls, forests and villages —<br />a journey through the real Odisha.</p>
        <Button asChild variant="outline" size="lg" className="rc-journey-cta rc-journey-reveal">
          <Link to="/tours/koraput-2-day">Explore the journey <ArrowRight /></Link>
        </Button>
        <div className="rc-journey-map-mark rc-journey-reveal" aria-hidden>
          <span>Odisha</span><b>Koraput</b><Compass />
        </div>
      </header>
      <div className="rc-journey-board">
        <svg className="rc-route" viewBox="0 0 500 900" aria-hidden>
          <path className="rc-route-draw" d="M240 40 C 340 130, 105 180, 190 300 S 390 405, 236 510 S 90 655, 266 710 S 375 820, 280 875" />
        </svg>
        {koraputJourneyStops.map((stop, index) => (
          <article className={`rc-journey-stop rc-journey-stop-${index + 1}`} key={stop.name}>
            <img src={stop.image} alt="" loading="lazy" width="800" height="520" />
            <div>
              <small>0{index + 1}</small>
              <h3>{stop.name}</h3>
              <p>{stop.description}</p>
            </div>
          </article>
        ))}
      </div>
      <figure className="rc-journey-landscape">
        <img src={koraputJourneyMedia.hero} alt="Temporary editorial visual inspired by a road through the Koraput highlands" loading="lazy" width="1600" height="1000" />
      </figure>
    </section>
  );
}