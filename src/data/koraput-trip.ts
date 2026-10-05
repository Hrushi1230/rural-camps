import { koraputJourneyStops, realRuralCampsMedia, koraputJourneyMedia, tour } from "@/data/site";
import { featuredJourney, getDepartureInfo } from "@/data/journeys";

/**
 * Everything below is drawn from content already published on the site
 * (tour summary, stop descriptions, FAQ and the previous trip page).
 * Nothing here is a schedule, price, availability, meal, stay, transport,
 * inclusion, exclusion or pickup claim.
 */

const stopCopy: Record<(typeof koraputJourneyStops)[number]["name"], string> = {
  Talamali: "Begin in the Koraput landscape and settle into the pace of the road.",
  Deomali: "Move toward Odisha's highest peak, subject to route and weather conditions.",
  Duduma: "Continue toward the waterfall region.",
  Gupteswar: "Follow the route into a sacred forest landscape.",
  Kolab: "Close the journey beside the reservoir region.",
};

export const tripStops = koraputJourneyStops.map((stop, index) => ({
  order: index + 1,
  name: stop.name,
  description: stop.description,
  itinerary: stopCopy[stop.name],
  image: stop.image,
  day: (tour.stops[index]?.day ?? 1) as 1 | 2,
}));

export const tripDays = [
  { day: 1 as const, title: "INTO THE HIGHLANDS", emphasis: "HIGHLANDS" },
  { day: 2 as const, title: "WATER, FOREST, ROAD", emphasis: "FOREST" },
].map((d) => ({ ...d, stops: tripStops.filter((s) => s.day === d.day) }));

export function getTripSnapshot() {
  const departure = getDepartureInfo(featuredJourney);
  return [
    { label: "Duration", value: "2 days" },
    { label: "Stops", value: `${tripStops.length} stops` },
    { label: "Region", value: tour.region },
    {
      label: departure ? departure.label : "Departure",
      value: departure
        ? `${departure.dates}${departure.availability ? ` · ${departure.availability}` : ""}`
        : "Confirmed on enquiry",
    },
    { label: "Pricing", value: "Shared on enquiry" },
  ];
}

export const tripGallery = [
  ...tripStops.map((s) => ({ src: s.image, caption: s.name })),
  { src: realRuralCampsMedia.koraputRoad, caption: "Koraput · roads into the hills" },
] as const;

export const tripLandscape = koraputJourneyMedia.hero;
export const tripIntroImage = realRuralCampsMedia.koraputRoad;

export const travelNotes = [
  {
    title: "Route & weather",
    copy: "Stops such as Deomali are subject to route and weather conditions on the day.",
  },
  {
    title: "Timings",
    copy: "The route gives the shape of the journey. Final stops and timing are confirmed directly for your travel date.",
  },
  {
    title: "Plan details",
    copy: "Transport, meals, stays, pickup, inclusions, exclusions and pricing are confirmed before booking. None are assumed on this page.",
  },
  {
    title: "Policies",
    copy: "Cancellation, ID, check-in and site-specific policies are shared during confirmation. They are not yet published on this website.",
  },
] as const;
