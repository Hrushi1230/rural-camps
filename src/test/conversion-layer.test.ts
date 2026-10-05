import { afterEach, describe, expect, it, vi } from "vitest";
import { featuredJourney, getDepartureInfo } from "@/data/journeys";
import {
  createQuickEnquiryMessage,
  createWhatsAppMessage,
  getQuickEnquiryUrl,
  getWhatsAppUrl,
  type BookingValues,
} from "@/lib/whatsapp";

const values: BookingValues = {
  experience: "Camp With Us",
  destination: "Ramachandi",
  date: "2027-01-10",
  guests: 2,
  name: "Asha",
  phone: "+91 98765 43210",
  message: "",
};

afterEach(() => vi.unstubAllEnvs());

describe("WhatsApp URLs", () => {
  it("returns null until a number is configured", () => {
    vi.stubEnv("VITE_RURAL_CAMPS_WHATSAPP", "");
    expect(getWhatsAppUrl(values)).toBeNull();
    expect(getQuickEnquiryUrl()).toBeNull();
  });

  it("builds the booking URL from the shared message", () => {
    vi.stubEnv("VITE_RURAL_CAMPS_WHATSAPP", "+91 90000 00000");
    expect(getWhatsAppUrl(values)).toBe(
      `https://wa.me/919000000000?text=${encodeURIComponent(createWhatsAppMessage(values))}`,
    );
  });

  it("adds launcher context to the quick enquiry", () => {
    vi.stubEnv("VITE_RURAL_CAMPS_WHATSAPP", "919000000000");
    const url = getQuickEnquiryUrl({ experience: "Rent A Camp" });
    expect(url).toContain(encodeURIComponent("Experience: Rent A Camp"));
    expect(createQuickEnquiryMessage()).not.toContain("Experience:");
  });
});

describe("featured journey", () => {
  it("never shows dates or seats while the schedule is unverified", () => {
    expect(featuredJourney.verifiedSchedule).toBe(false);
    expect(getDepartureInfo({ ...featuredJourney, startDate: "2099-01-01", spotsRemaining: 4 })).toBeNull();
  });

  it("shows confirmed upcoming departures only", () => {
    const journey = {
      ...featuredJourney,
      verifiedSchedule: true,
      startDate: "2027-03-05",
      endDate: "2027-03-06",
      spotsRemaining: 3,
    };
    const info = getDepartureInfo(journey, new Date(2027, 0, 1));
    expect(info?.label).toBe("NEXT DEPARTURE");
    expect(info?.availability).toBe("3 SPOTS LEFT");
    expect(getDepartureInfo(journey, new Date(2027, 5, 1))).toBeNull();
    const { spotsRemaining: _omit, ...noSpots } = journey;
    expect(getDepartureInfo(noSpots, new Date(2027, 0, 1))?.availability).toBeNull();
  });
});
