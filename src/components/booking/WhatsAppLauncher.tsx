import { MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { launcherChoices } from "@/data/journeys";
import { brandMedia } from "@/data/site";
import { getQuickEnquiryUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * Desktop-only enquiry launcher. A compact starting point for a WhatsApp message —
 * not a live chat: it makes no claim that anyone is online.
 */
export function WhatsAppLauncher({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const shown = open && visible;
  const choice = launcherChoices.find((c) => c.id === choiceId);
  const url = getQuickEnquiryUrl(choice?.enquiry);

  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [shown]);

  // Collapse the panel when the rail hides (menu/overlay/plan section) so it never lingers.
  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  return (
    <div ref={rootRef} className="rc-launcher" data-visible={visible}>
      <div
        id="rc-launcher-panel"
        className="rc-launcher-panel"
        role="dialog"
        aria-label="Start a WhatsApp enquiry"
        data-open={shown}
      >
        <p className="eyebrow rc-launcher-brand">
          <img src={brandMedia.mark} alt="" width="22" height="22" />
          RURAL CAMPS
        </p>
        <h2>
          Planning something?
          <br />
          <em>Choose where to start.</em>
        </h2>
        <div className="rc-launcher-choices" role="radiogroup" aria-label="Where to start">
          {launcherChoices.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={choiceId === c.id}
              className={cn("rc-launcher-choice", choiceId === c.id && "is-selected")}
              tabIndex={shown ? 0 : -1}
              onClick={() => setChoiceId((cur) => (cur === c.id ? null : c.id))}
            >
              <img src={c.image} alt="" width="44" height="44" loading="lazy" />
              <b>{c.label}</b>
              <span aria-hidden>{choiceId === c.id ? "●" : "→"}</span>
            </button>
          ))}
        </div>
        {url ? (
          <a
            className="rc-launcher-cta"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={shown ? 0 : -1}
            onClick={() => window.dispatchEvent(new CustomEvent("whatsapp_clicked"))}
          >
            TALK ON WHATSAPP <span aria-hidden>→</span>
          </a>
        ) : (
          <p className="rc-launcher-note" role="status">
            WhatsApp enquiries are being configured.
          </p>
        )}
      </div>
      <button
        ref={triggerRef}
        type="button"
        className="rc-launcher-trigger"
        aria-expanded={shown}
        aria-controls="rc-launcher-panel"
        aria-label={shown ? "Close enquiry panel" : "Open WhatsApp enquiry panel"}
        onClick={() => setOpen((o) => !o)}
      >
        {shown ? <X aria-hidden /> : <MessageCircle aria-hidden />}
      </button>
    </div>
  );
}
