import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { BookingOverlay } from "@/components/booking/BookingOverlay";

interface BookingContextValue {
  /**
   * Opens the single shared booking overlay.
   * @param trigger The element that triggered the open action (for origin calculation and return focus).
   * @param origin Optional pre-measured DOMRect bounding box.
   */
  openBooking: (trigger?: HTMLElement | null, origin?: DOMRect | null) => void;
  closeBooking: () => void;
  isOpen: boolean;
  isBusy: boolean;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openBooking = useCallback((trigger?: HTMLElement | null, rect?: DOMRect | null) => {
    const el = trigger ?? (document.activeElement as HTMLElement | null);
    triggerRef.current = el;
    const computedRect = rect ?? el?.getBoundingClientRect() ?? null;
    setOrigin(computedRect);
    setBusy(true);
    setOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setOpen(false);
  }, []);

  const handleExited = useCallback(() => {
    setBusy(false);
    // Return focus to the trigger that opened the overlay
    const el = triggerRef.current;
    if (el && el.isConnected && typeof el.focus === "function") {
      el.focus();
    } else {
      const hamburger = document.querySelector<HTMLElement>('button[aria-label="Open navigation"]');
      if (hamburger && typeof hamburger.focus === "function") {
        hamburger.focus();
      }
    }
  }, []);

  // Listen to global open-booking event for any decoupled triggers
  useEffect(() => {
    const handleEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ trigger?: HTMLElement; origin?: DOMRect }>;
      openBooking(customEvent.detail?.trigger, customEvent.detail?.origin);
    };
    window.addEventListener("open-booking", handleEvent);
    return () => window.removeEventListener("open-booking", handleEvent);
  }, [openBooking]);

  return (
    <BookingContext.Provider
      value={{
        openBooking,
        closeBooking,
        isOpen: open,
        isBusy: busy,
      }}
    >
      {children}
      <BookingOverlay
        open={open}
        origin={origin}
        onClose={closeBooking}
        onExited={handleExited}
        triggerElement={triggerRef.current}
      />
    </BookingContext.Provider>
  );
}
