import heroImage from "@/assets/rural-camps-hero.jpg";
import koraputImage from "@/assets/koraput-hills.jpg";
import ramachandiImage from "@/assets/ramachandi-coast.jpg";
import rentCampImage from "@/assets/rent-camp-sequence.jpg";
import ruralStayImage from "@/assets/rural-stay-editorial.jpg";

export type ExperienceSlug = "camp" | "rent-a-camp" | "tour" | "rural-stay";
export type DestinationStatus = "live" | "upcoming" | "planned";

export interface Destination {
  slug: "ramachandi" | "koraput";
  name: string;
  region: string;
  status: DestinationStatus;
  summary: string;
  experiences: ExperienceSlug[];
  highlights: string[];
  image: string;
  bookingEnabled: boolean;
}

export const rentCampFrames = [
  "/images/home/rent-a-camp/01-empty.webp",
  "/images/home/rent-a-camp/02-arrival.webp",
  "/images/home/rent-a-camp/03-tent.webp",
  "/images/home/rent-a-camp/04-setup.webp",
  "/images/home/rent-a-camp/05-lights.webp",
  "/images/home/rent-a-camp/06-ready.webp",
] as const;

export const koraputJourneyMedia = {
  hero: "/images/home/koraput-journey/hero.webp",
  talamali: "/images/home/koraput-journey/talamali.webp",
  deomali: "/images/home/koraput-journey/deomali.webp",
  duduma: "/images/home/koraput-journey/duduma.webp",
  gupteswar: "/images/home/koraput-journey/gupteswar.webp",
  kolab: "/images/home/koraput-journey/kolab.webp",
} as const;

export const realRuralCampsMedia = {
  ramachandiNight: "/images/home/real-rural-camps/ramachandi-night.webp",
  coastalCamp: "/images/home/real-rural-camps/coastal-camp.webp",
  koraputRoad: "/images/home/real-rural-camps/koraput-road.webp",
  nightCamp: "/images/home/real-rural-camps/night-camp.webp",
  ruralStay: "/images/home/real-rural-camps/rural-stay.webp",
  morningDetail: "/images/home/real-rural-camps/morning-detail.webp",
} as const;

export const planTripBackground = "/images/home/booking/plan-trip-bg.webp";

export const brandMedia = {
  primary: "/brand/rural-camps-primary.svg",
  light: "/brand/rural-camps-light.svg",
  mark: "/brand/rural-camps-mark.svg",
} as const;

export const media = {
  hero: heroImage,
  ramachandi: ramachandiImage,
  koraput: koraputImage,
  rentCamp: rentCampFrames[5],
  ruralStay: realRuralCampsMedia.ruralStay,
  planTrip: planTripBackground,
} as const;

export const destinations: Destination[] = [
  {
    slug: "ramachandi",
    name: "Ramachandi",
    region: "Puri–Konark Marine Drive",
    status: "live",
    summary: "Coastal camping and outdoor nights on the Puri–Konark side.",
    experiences: ["camp"],
    highlights: ["Coastal camping", "Group nights", "Outdoor stay"],
    image: ramachandiImage,
    bookingEnabled: true,
  },
  {
    slug: "koraput",
    name: "Koraput",
    region: "Eastern Ghats, Odisha",
    status: "live",
    summary: "Hills, valleys, camping, rural stays and curated journeys.",
    experiences: ["camp", "rent-a-camp", "tour", "rural-stay"],
    highlights: ["Talamali", "Deomali", "Duduma", "Gupteswar", "Kolab"],
    image: koraputImage,
    bookingEnabled: true,
  },
];

export const experiences = [
  {
    slug: "camp",
    name: "Camp With Us",
    description: "Join our curated camps in memorable outdoor destinations across Odisha.",
    href: "/destinations",
    image: ramachandiImage,
  },
  {
    slug: "rent-a-camp",
    name: "Rent A Camp",
    description: "Take the outdoors with you. Flexible setups for your own adventure.",
    href: "/rent-a-camp",
    image: rentCampFrames[5],
  },
  {
    slug: "tour",
    name: "Explore With Us",
    description: "Guided journeys through hills, forests, waterfalls and roads.",
    href: "/tours",
    image: koraputImage,
  },
  {
    slug: "rural-stay",
    name: "Rural Stay",
    description: "Stay closer to local life and experience rural Odisha.",
    href: "/rural-stay",
    image: realRuralCampsMedia.ruralStay,
  },
] as const;

export const koraputStops = ["Talamali", "Deomali", "Duduma", "Gupteswar", "Kolab"] as const;

export const rentCampSteps = [
  { title: "Find the spot", detail: "You choose a suitable location in Odisha." },
  { title: "We arrive", detail: "Our team and gear reach the site." },
  { title: "Setup camp", detail: "We pitch the tents and shape the space." },
  { title: "Arrange & cook", detail: "The camp kitchen and seating come together." },
  { title: "Lights on", detail: "Lanterns and fire set the evening mood." },
  { title: "Camp ready", detail: "The complete campsite is ready for you." },
] as const;

export const koraputJourneyStops = [
  { name: "Talamali", description: "Rolling hills with panoramic views.", image: koraputJourneyMedia.talamali },
  { name: "Deomali", description: "Odisha’s highest peak and endless horizons.", image: koraputJourneyMedia.deomali },
  { name: "Duduma", description: "Majestic waterfalls in a lush valley.", image: koraputJourneyMedia.duduma },
  { name: "Gupteswar", description: "Ancient limestone caves and natural wonders.", image: koraputJourneyMedia.gupteswar },
  { name: "Kolab", description: "Serene backwaters and tribal villages.", image: koraputJourneyMedia.kolab },
] as const;

export const realCampMoments = [
  { caption: "Ramachandi · coastal nights", image: realRuralCampsMedia.ramachandiNight },
  { caption: "Camp setup · after dark", image: realRuralCampsMedia.nightCamp },
  { caption: "Koraput · roads into the hills", image: realRuralCampsMedia.koraputRoad },
  { caption: "Clear skies · deeper conversations", image: realRuralCampsMedia.morningDetail },
  { caption: "Rural stay · evening light", image: realRuralCampsMedia.ruralStay },
] as const;

export const tour = {
  slug: "koraput-2-day",
  name: "Koraput 2-Day Journey",
  region: "Koraput, Odisha",
  durationLabel: "2 days",
  status: "live" as const,
  summary: "A compact road journey through Koraput's highlands, waterfalls and sacred landscapes.",
  stops: koraputStops.map((name, index) => ({ name, order: index + 1, day: index < 2 ? 1 : 2 })),
  price: null,
  bookingEnabled: true,
};

export const faqs = [
  {
    group: "Camping",
    question: "Where can I camp with Rural Camps?",
    answer:
      "Ramachandi and Koraput are the current destination hubs. The exact experience depends on date, conditions and confirmation.",
  },
  {
    group: "Rent A Camp",
    question: "Can you set up a camp anywhere?",
    answer:
      "Every requested location is checked for access, suitability and feasibility before a setup is confirmed.",
  },
  {
    group: "Tours",
    question: "Is the Koraput itinerary fixed?",
    answer:
      "The 2-day journey provides the route structure. Final stops and timing are confirmed directly for your travel date.",
  },
  {
    group: "Rural Stay",
    question: "Is Rural Stay available now?",
    answer:
      "Rural Stay enquiries are welcome, but the exact accommodation and operating status must be confirmed before travel.",
  },
  {
    group: "Payments",
    question: "How much does an experience cost?",
    answer:
      "Current pricing is shared after your destination, date, group size and requirements are confirmed.",
  },
  {
    group: "Weather",
    question: "What happens if weather changes?",
    answer:
      "Outdoor plans depend on conditions. Contact Rural Camps for the current weather and rescheduling guidance before travelling.",
  },
  {
    group: "Policies",
    question: "Where can I find the current policies?",
    answer:
      "Cancellation, ID, check-in and site-specific policies are shared during confirmation. They are not yet published on this website.",
  },
] as const;
