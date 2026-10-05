import { useRef } from "react";
import { media } from "@/data/site";
import { getQuickEnquiryUrl } from "@/lib/whatsapp";

/**
 * Desktop: centred floating rail. <1100px: fixed two-action bar.
 * Hidden state uses visibility so hidden links leave the tab order.
 */
export function BookingRail({
  visible,
  onPlan,
}: {
  visible: boolean;
  onPlan: (origin: DOMRect, trigger?: HTMLElement | null) => void;
}) {
  const planRef = useRef<HTMLButtonElement>(null);
  const whatsappUrl = getQuickEnquiryUrl();
  return (
    <div className="rc-rail" data-visible={visible} role="region" aria-label="Quick actions">
      <img className="rc-rail-thumb" src={media.koraput} alt="" width="96" height="56" loading="lazy" />
      <p className="rc-rail-label">
        READY TO GET OUT?
        <small>Let us plan your next escape</small>
      </p>
      <button
        ref={planRef}
        type="button"
        className="rc-rail-plan"
        onClick={() => planRef.current && onPlan(planRef.current.getBoundingClientRect(), planRef.current)}
      >
        PLAN A TRIP <span aria-hidden>→</span>
      </button>
      {whatsappUrl ? (
        <a
          className="rc-rail-whatsapp"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => window.dispatchEvent(new CustomEvent("whatsapp_clicked"))}
        >
          WHATSAPP <span aria-hidden>↗</span>
        </a>
      ) : (
        <button
          type="button"
          className="rc-rail-whatsapp"
          disabled
          title="WhatsApp enquiries are being configured"
        >
          WHATSAPP <span aria-hidden>↗</span>
        </button>
      )}
    </div>
  );
}
