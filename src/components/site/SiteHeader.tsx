import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/booking/BookingContext";
import { scrollToTop } from "@/lib/scroll";
import { brandMedia } from "@/data/site";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const desktopLinks = [
  ["Destinations", "/destinations"],
  ["Stay", "/rural-stay"],
  ["Rent A Camp", "/rent-a-camp"],
  ["Tours", "/tours"],
  ["About", "/about"],
  ["FAQ", "/faq"],
] as const;
const mobileLinks = [
  ["Destinations", "/destinations"],
  ["Ramachandi", "/destinations/ramachandi"],
  ["Koraput", "/destinations/koraput"],
  ["Rent A Camp", "/rent-a-camp"],
  ["Tours", "/tours"],
  ["Koraput Journey", "/tours/koraput-2-day"],
  ["Rural Stay", "/rural-stay"],
  ["About", "/about"],
  ["FAQ", "/faq"],
] as const;

export function SiteHeader() {
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="site-header" data-scrolled={scrolled ? "true" : "false"}>
      <Link
        to="/"
        className="brand-mark cursor-pointer"
        aria-label="Rural Camps home"
        onClick={(e) => {
          if (window.location.pathname === "/" || window.location.pathname === "") {
            e.preventDefault();
            scrollToTop();
          }
        }}
      >
        <img
          src={brandMedia.light}
          alt="Rural Camps"
          className="rc-brand-logo"
          width="130"
          height="40"
        />
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {desktopLinks.map(([label, to]) => (
          <Link key={to} to={to} activeProps={{ className: "is-active" }}>
            {label}
          </Link>
        ))}
      </nav>
      <Button asChild size="lg" className="rc-header-cta hidden min-[1100px]:inline-flex">
        <Link
          to="/plan-trip"
          onClick={(e) => {
            e.preventDefault();
            openBooking(e.currentTarget);
          }}
        >
          Plan a trip <span aria-hidden>↗</span>
        </Link>
      </Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="min-[1100px]:hidden"
            aria-label="Open navigation"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className="mobile-menu overflow-y-auto" side="right">
          <SheetTitle className="font-display text-3xl">Find your way out.</SheetTitle>
          <SheetDescription>Explore Rural Camps across Odisha.</SheetDescription>
          <nav aria-label="Mobile navigation" className="mt-10 flex flex-col">
            {mobileLinks.map(([label, to], index) => (
              <SheetClose asChild key={to}>
                <Link to={to} className="menu-link">
                  <span>0{index + 1}</span>
                  {label}
                </Link>
              </SheetClose>
            ))}
          </nav>
          <SheetClose asChild>
            <Button
              asChild
              size="lg"
              className="mt-10 w-full"
              onClick={(e) => {
                e.preventDefault();
                openBooking(e.currentTarget);
              }}
            >
              <Link to="/plan-trip">Plan a trip</Link>
            </Button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </header>
  );
}
