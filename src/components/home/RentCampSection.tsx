import { Link } from "@tanstack/react-router";
import { ArrowRight, CarFront, CookingPot, Lightbulb, MapPin, Moon, TentTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rentCampFrames, rentCampSteps } from "@/data/site";
import { RentCampMotion } from "@/components/motion/RentCampMotion";
import { useRef } from "react";

const stepIcons = [MapPin, CarFront, TentTree, CookingPot, Lightbulb, Moon] as const;

function RentCopy() {
  return (
    <>
      <div className="rc-rent-copy rc-rent-copy-left">
        <p className="eyebrow">04 · Rent A Camp · Odisha</p>
        <h2>You pick<br />the place.</h2>
        <p className="rc-rent-support">We bring the setup.</p>
        <Button asChild size="lg" className="rc-cream-button">
          <Link to="/rent-a-camp">Plan a Rent A Camp <ArrowRight /></Link>
        </Button>
      </div>
      <h3 className="rc-rent-copy rc-rent-copy-right">We bring<br />the camp.</h3>
    </>
  );
}

function RentSteps() {
  return (
    <ol className="rc-rent-steps" aria-label="Rent A Camp setup process">
      {rentCampSteps.map((step, index) => {
        const Icon = stepIcons[index];
        return (
          <li className="rc-rent-step" key={step.title}>
            <small>0{index + 1}</small>
            <span className="rc-rent-step-icon" aria-hidden>{Icon ? <Icon /> : null}</span>
            <strong>{step.title}</strong>
            <p>{step.detail}</p>
          </li>
        );
      })}
    </ol>
  );
}

export function RentCampSection() {
  const rootRef = useRef<HTMLElement>(null);
  const stageFrames = [
    { src: rentCampFrames[0], alt: "Temporary editorial visual: Find the spot - choosing a suitable campsite in Odisha" },
    { src: rentCampFrames[1], alt: "Temporary editorial visual: We arrive - team and gear reach the site" },
    { src: rentCampFrames[2], alt: "Temporary editorial visual: Setup camp - pitching tents and shaping the campsite" },
    { src: rentCampFrames[3], alt: "Temporary editorial visual: Arrange & cook - camp kitchen and seating coming together" },
    { src: rentCampFrames[4], alt: "Temporary editorial visual: Lights on - lanterns and evening campfire" },
    { src: rentCampFrames[5], alt: "Temporary editorial visual of a completed camp setup at dusk" },
  ];
  return (
    <section ref={rootRef} className="rc-rent" aria-labelledby="rent-camp-title">
      <RentCampMotion rootRef={rootRef} />
      <div className="rc-rent-desktop">
        <div className="rc-rent-stage">
          <div className="rc-rent-frames">
            {stageFrames.map((frame, index) => (
              <img
                className="rc-rent-frame"
                src={frame.src}
                alt={frame.alt}
                aria-hidden={index < 5}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                width="1600"
                height="1000"
                key={frame.src}
              />
            ))}
          </div>
          <div className="rc-rent-shade" />
          <div className="rc-rent-ready-glow" aria-hidden />
          <div id="rent-camp-title"><RentCopy /></div>
          <RentSteps />
        </div>
      </div>
      <div className="rc-rent-mobile">
        <div className="rc-rent-mobile-media">
          <img
            src={rentCampFrames[5]}
            alt="Temporary editorial visual of a completed camp setup at dusk"
            loading="lazy"
            decoding="async"
            width="1600"
            height="1000"
          />
          <div className="rc-rent-shade" />
        </div>
        <div className="rc-rent-mobile-copy" id="rent-camp-title-mobile"><RentCopy /></div>
        <RentSteps />
      </div>
    </section>
  );
}