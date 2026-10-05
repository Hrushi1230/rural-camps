import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { DESKTOP_QUERY, loadGsap } from "@/lib/gsap";

type Timeline = ReturnType<Awaited<ReturnType<typeof loadGsap>>["gsap"]["timeline"]>;
type Mode = "morph" | "sheet" | "fade";

const pick = (root: HTMLElement, name: string) =>
  Array.from(root.querySelectorAll<HTMLElement>(`[data-rc="${name}"]`));

/**
 * Booking dialog. Radix owns focus trap, Escape, aria and scroll lock; GSAP owns the motion.
 * Desktop: the clicked rail button expands into the panel (clip-path on a bone layer).
 * <1100px: bottom sheet. Reduced motion: plain fade.
 * `open` is the request; the dialog stays mounted until the reverse animation finishes.
 */
export function BookingOverlay({
  open,
  origin,
  onClose,
  onExited,
  triggerElement,
}: {
  open: boolean;
  origin: DOMRect | null;
  onClose: () => void;
  onExited: () => void;
  triggerElement?: HTMLElement | null;
}) {
  const [rendered, setRendered] = useState(false);
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const tlRef = useRef<Timeline | null>(null);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    if (open) setRendered(true);
  }, [open]);

  // Build the enter timeline as soon as the portal content exists.
  useEffect(() => {
    if (!node) return;
    let cancelled = false;
    let cleanup = () => {};
    void loadGsap().then(({ gsap }) => {
      if (cancelled || !node.isConnected) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mode: Mode = reduced
        ? "fade"
        : window.matchMedia(DESKTOP_QUERY).matches
          ? "morph"
          : "sheet";
      const root = node;
      const backdrop = root.parentElement?.querySelector<HTMLElement>("[data-rc=backdrop]") ?? null;
      const morph = root.parentElement?.querySelector<HTMLElement>("[data-rc=morph]") ?? null;
      const heading = pick(root, "heading");
      const reveal = pick(root, "reveal");

      const build = () => {
        tlRef.current?.kill();
        gsap.set([root, backdrop, morph, ...heading, ...reveal], { clearProps: "all" });
        if (mode !== "morph") gsap.set(morph, { display: "none" });
        const tl = gsap.timeline({ paused: true });
        if (mode === "fade") {
          tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" }, 0).fromTo(
            root,
            { opacity: 0 },
            { opacity: 1, duration: 0.2, ease: "none" },
            0,
          );
        } else if (mode === "sheet") {
          tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.26, ease: "power1.out" }, 0)
            .fromTo(root, { yPercent: 100 }, { yPercent: 0, duration: 0.46, ease: "power3.out" }, 0)
            .fromTo(
              [...heading, ...reveal],
              { y: 14, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.24, stagger: 0.04, ease: "power2.out" },
              0.24,
            );
        } else if (morph) {
          const m = morph.getBoundingClientRect();
          const p = root.getBoundingClientRect();
          const o =
            origin ??
            new DOMRect(p.left + p.width / 2 - 70, p.bottom - 52, 140, 44);
          const inset = (r: { top: number; left: number; right: number; bottom: number }, radius: number) =>
            `inset(${r.top - m.top}px ${m.right - r.right}px ${m.bottom - r.bottom}px ${r.left - m.left}px round ${radius}px)`;
          tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0.04)
            .fromTo(
              morph,
              { clipPath: inset(o, Math.min(o.height / 2, 999)) },
              { clipPath: inset(p, 8), duration: 0.38, ease: "power3.inOut" },
              0,
            )
            .fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.14, ease: "none" }, 0.3)
            .fromTo(
              [...heading, ...reveal],
              { y: 14, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.2, stagger: 0.03, ease: "power2.out" },
              0.34,
            )
            // The panel itself now covers the morph layer, so it can be dropped.
            .set(morph, { opacity: 0 }, 0.44);
        }
        tlRef.current = tl;
        return tl;
      };

      const tl = build();
      tl.eventCallback("onReverseComplete", () => {
        if (!openRef.current) {
          setRendered(false);
          onExited();
        }
      });
      if (openRef.current) tl.play();
      else tl.progress(0);

      let resizeTimer = 0;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          const old = tlRef.current;
          if (!old || old.isActive() || old.progress() < 1 || !openRef.current) return;
          const next = build();
          next.eventCallback("onReverseComplete", () => {
            if (!openRef.current) {
              setRendered(false);
              onExited();
            }
          });
          next.progress(1);
        }, 120);
      };
      window.addEventListener("resize", onResize);
      cleanup = () => {
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
        tlRef.current?.kill();
        tlRef.current = null;
      };
    });
    return () => {
      cancelled = true;
      cleanup();
    };
    // origin/onExited are captured at open; the dialog node identity drives each run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);

  // Exit (or re-enter while exiting).
  useEffect(() => {
    if (!rendered) return;
    const tl = tlRef.current;
    if (open) {
      tl?.play();
      return;
    }
    if (tl) tl.timeScale(1.15).reverse();
    else {
      setRendered(false);
      onExited();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog.Root
      open={rendered}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className="rc-book-backdrop"
          data-rc="backdrop"
          data-lenis-prevent
          style={{ opacity: 0 }}
        />
        <div
          className="rc-book-morph"
          data-rc="morph"
          aria-hidden
          data-lenis-prevent
          style={{ opacity: 0 }}
        />
        <Dialog.Content
          ref={setNode}
          className="rc-book"
          data-lenis-prevent
          style={{ opacity: 0 }}
          aria-describedby="rc-book-description"
          onCloseAutoFocus={(event) => {
            if (triggerElement && triggerElement.isConnected && typeof triggerElement.focus === "function") {
              event.preventDefault();
              triggerElement.focus();
            } else {
              const hamburger = document.querySelector<HTMLElement>('button[aria-label="Open navigation"]');
              if (hamburger && typeof hamburger.focus === "function") {
                event.preventDefault();
                hamburger.focus();
              }
            }
          }}
        >
          <div className="rc-book-head" data-rc="heading">
            <p className="eyebrow">PLAN YOUR TRIP</p>
            <Dialog.Title asChild>
              <h2>
                WHERE DO <em>YOU WANT</em> TO WAKE UP?
              </h2>
            </Dialog.Title>
            <Dialog.Description id="rc-book-description">
              Share the essentials. Availability and current pricing are confirmed on WhatsApp.
            </Dialog.Description>
          </div>
          <BookingForm
            stepped
            compact
            idPrefix="rc-book-"
            onComplete={onClose}
            className="rc-book-form"
          />
          <Dialog.Close className="rc-book-close" aria-label="Close booking">
            <X aria-hidden />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
