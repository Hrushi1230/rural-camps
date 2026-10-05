import { HeroSection } from "@/components/home/HeroSection";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { DestinationTransition } from "@/components/home/DestinationTransition";
import { RentCampSection } from "@/components/home/RentCampSection";
import { KoraputJourneySection } from "@/components/home/KoraputJourneySection";
import { RealRuralCampsSection } from "@/components/home/RealRuralCampsSection";
import { PlanTripSection } from "@/components/home/PlanTripSection";
import { BookingLayer } from "@/components/booking/BookingLayer";

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <ExperienceSection />
      <DestinationTransition />
      <RentCampSection />
      <KoraputJourneySection />
      <RealRuralCampsSection />
      <PlanTripSection />
      <BookingLayer />
    </main>
  );
}
