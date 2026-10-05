import { createFileRoute } from "@tanstack/react-router";
import { KoraputTripPage } from "@/components/trip/KoraputTripPage";

export const Route = createFileRoute("/tours/koraput-2-day")({
  head: () => ({
    meta: [
      { title: "Koraput 2-Day Journey | Rural Camps Odisha" },
      {
        name: "description",
        content:
          "A two-day Koraput journey through Talamali, Deomali, Duduma, Gupteswar and Kolab. Enquire and confirm the plan on WhatsApp.",
      },
      { property: "og:title", content: "Koraput 2-Day Journey | Rural Camps" },
      {
        property: "og:description",
        content: "One road. Five moments. A curated two-day road through Koraput's highlands and waterfalls.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tours/koraput-2-day" }],
  }),
  component: KoraputTripPage,
});
