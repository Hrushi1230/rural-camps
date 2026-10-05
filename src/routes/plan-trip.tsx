import { createFileRoute } from "@tanstack/react-router";
import { BookingForm } from "@/components/booking/BookingForm";
import { planTripBackground } from "@/data/site";
export const Route = createFileRoute("/plan-trip")({
  head: () => ({
    meta: [
      { title: "Plan Your Rural Camps Trip | Odisha" },
      {
        name: "description",
        content:
          "Plan camping, a portable camp setup, Koraput tour or Rural Stay and continue on WhatsApp.",
      },
      { property: "og:title", content: "Plan Your Rural Camps Trip" },
      {
        property: "og:description",
        content: "Tell Rural Camps where, when and how you want to explore Odisha.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/plan-trip" }],
  }),
  component: Page,
});
function Page() {
  return (
    <main className="plan-page">
      <div className="plan-visual">
        <img
          src={planTripBackground}
          alt="Temporary editorial visual of an outdoor camp in Odisha"
          width="1600"
          height="1000"
          fetchPriority="high"
        />
        <div className="media-shade" />
        <div>
          <p className="eyebrow">PLAN YOUR TRIP</p>
          <h1>
            WHERE DO
            <br />
            <em>YOU WANT</em>
            <br />
            TO WAKE UP?
          </h1>
          <p>
            Share the essentials. The final availability, current pricing and details are confirmed
            on WhatsApp.
          </p>
        </div>
      </div>
      <div className="plan-form">
        <p className="eyebrow">YOUR TRIP · 01</p>
        <h2>
          START WITH
          <br />
          THE BASICS.
        </h2>
        <BookingForm />
      </div>
    </main>
  );
}
