import type { QuickEnquiry } from "@/lib/whatsapp";
import { media } from "@/data/site";

export type JourneyHref =
  | "/destinations/ramachandi"
  | "/destinations/koraput"
  | "/rent-a-camp"
  | "/tours/koraput-2-day";

export interface FeaturedJourney {
  slug: string;
  /** Short label shown above the journey, e.g. FEATURED JOURNEY. */
  eyebrow: string;
  title: string;
  subtitle: string;
  href: JourneyHref;
  /** ISO calendar dates (YYYY-MM-DD). Only ever shown when `verifiedSchedule` is true. */
  startDate?: string;
  endDate?: string;
  spotsRemaining?: number;
  /** Flip to true only once the owner has confirmed dates and availability. */
  verifiedSchedule: boolean;
}

/** No schedule has been confirmed yet, so no date or seat information is published. */
export const featuredJourney: FeaturedJourney = {
  slug: "koraput-2-day",
  eyebrow: "FEATURED JOURNEY",
  title: "Koraput",
  subtitle: "2 DAYS · 5 STOPS",
  href: "/tours/koraput-2-day",
  verifiedSchedule: false,
};

export interface DepartureInfo {
  label: "NEXT DEPARTURE";
  dates: string;
  availability: string | null;
}

function parseCalendarDate(value: string | undefined) {
  const match = value ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Returns departure details only for a verified, upcoming schedule.
 * Anything unverified, malformed or already past yields null so nothing is invented.
 */
export function getDepartureInfo(
  journey: FeaturedJourney,
  today: Date = new Date(),
): DepartureInfo | null {
  if (!journey.verifiedSchedule) return null;
  const start = parseCalendarDate(journey.startDate);
  if (!start) return null;
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (start < startOfToday) return null;
  const end = parseCalendarDate(journey.endDate);
  const fmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
  const dates =
    end && end > start ? `${fmt.format(start)} – ${fmt.format(end)}` : fmt.format(start);
  const spots = journey.spotsRemaining;
  const availability =
    typeof spots === "number" && Number.isInteger(spots) && spots >= 0
      ? spots === 0
        ? "FULL"
        : `${spots} ${spots === 1 ? "SPOT" : "SPOTS"} LEFT`
      : null;
  return { label: "NEXT DEPARTURE", dates, availability };
}

export interface HeroStory {
  id: "ramachandi" | "koraput" | "rent-a-camp" | "koraput-journey";
  title: string;
  eyebrow: string;
  /** Small label above the title, e.g. FEATURED DESTINATION. */
  kicker: string;
  href: JourneyHref;
  cta: string;
  /** Present only on the featured-journey story so schedule data has a single source. */
  journey?: FeaturedJourney;
}

export const heroStories: readonly HeroStory[] = [
  {
    id: "ramachandi",
    title: "Ramachandi",
    eyebrow: "COASTAL CAMPING",
    kicker: "FEATURED DESTINATION",
    href: "/destinations/ramachandi",
    cta: "EXPLORE",
  },
  {
    id: "koraput",
    title: "Koraput",
    eyebrow: "HILLS · STAYS · JOURNEYS",
    kicker: "FEATURED DESTINATION",
    href: "/destinations/koraput",
    cta: "EXPLORE",
  },
  {
    id: "rent-a-camp",
    title: "Rent A Camp",
    eyebrow: "YOU PICK THE PLACE",
    kicker: "FEATURED EXPERIENCE",
    href: "/rent-a-camp",
    cta: "EXPLORE",
  },
  {
    id: "koraput-journey",
    title: "Koraput Journey",
    eyebrow: featuredJourney.subtitle,
    kicker: featuredJourney.eyebrow,
    href: featuredJourney.href,
    cta: "EXPLORE",
    journey: featuredJourney,
  },
];

export interface LauncherChoice {
  id: string;
  label: string;
  image: string;
  enquiry: QuickEnquiry;
}

export const launcherChoices: readonly LauncherChoice[] = [
  { id: "ramachandi", label: "Ramachandi", image: media.ramachandi, enquiry: { experience: "Camp With Us", destination: "Ramachandi" } },
  { id: "koraput", label: "Koraput", image: media.koraput, enquiry: { destination: "Koraput" } },
  { id: "rent-a-camp", label: "Rent A Camp", image: media.rentCamp, enquiry: { experience: "Rent A Camp" } },
];
