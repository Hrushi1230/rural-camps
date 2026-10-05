import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  bookingSchema,
  experienceValues,
  getWhatsAppUrl,
  type BookingValues,
} from "@/lib/whatsapp";
import { experiences } from "@/data/site";
import { cn } from "@/lib/utils";

const destinationOptions: Record<string, string[]> = {
  "Camp With Us": ["Ramachandi", "Koraput", "Other / Ask Rural Camps"],
  "Koraput Tour": ["Koraput 2-Day Journey", "Custom Koraput Plan"],
  "Rural Stay": ["Koraput", "Ask Rural Camps"],
};

/** Stepped mode only: which fields each step owns, validated by the same Zod schema. */
const stepFields: (keyof BookingValues)[][] = [
  ["experience"],
  ["destination", "date", "guests"],
  ["name", "phone", "message"],
];
const stepTitles = ["Experience", "When + who", "Your details"] as const;
const experienceLabels: Record<(typeof experienceValues)[number], string> = {
  "Camp With Us": "Camp With Us",
  "Rent A Camp": "Rent A Camp",
  "Koraput Tour": "Koraput Journey",
  "Rural Stay": "Rural Stay",
};

export function BookingForm({
  compact = false,
  defaultExperience,
  defaultDestination = "",
  className,
  stepped = false,
  initialStep = 0,
  idPrefix = "",
  onComplete,
  arrow = "up-right",
}: {
  compact?: boolean;
  defaultExperience?: BookingValues["experience"];
  defaultDestination?: string;
  className?: string;
  /** Presents the same form as three steps (used by the booking overlay). */
  stepped?: boolean;
  initialStep?: number;
  /** Prefix for field ids so a second instance on the page never collides with the first. */
  idPrefix?: string;
  onComplete?: () => void;
  /** Arrow glyph on the non-stepped submit button. */
  arrow?: "up-right" | "right";
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      ...(defaultExperience ? { experience: defaultExperience } : {}),
      destination: defaultDestination,
      date: "",
      guests: 2,
      name: "",
      phone: "",
      message: "",
      pickupPoint: "",
    },
  });
  const experience = useWatch({ control, name: "experience" });
  const options = useMemo(() => destinationOptions[experience ?? ""] ?? [], [experience]);
  const previousExperience = useRef(experience);
  useEffect(() => {
    if (previousExperience.current !== experience) {
      setValue("destination", "");
      previousExperience.current = experience;
    }
  }, [experience, setValue]);
  const [step, setStep] = useState(Math.min(Math.max(initialStep, 0), stepTitles.length - 1));
  const [startStep] = useState(step);
  const bodyRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (stepped) {
      bodyRef.current
        ?.querySelector<HTMLElement>("input:checked, input, select, textarea")
        ?.focus({ preventScroll: true });
    }
  }, [step, stepped]);
  const configured = Boolean(
    (import.meta.env["VITE_RURAL_CAMPS_WHATSAPP"] as string | undefined)?.replace(/\D/g, ""),
  );
  const onSubmit = (values: BookingValues) => {
    window.dispatchEvent(
      new CustomEvent("booking_form_completed", { detail: { experience: values.experience } }),
    );
    const url = getWhatsAppUrl(values);
    if (!url) return;
    window.dispatchEvent(new CustomEvent("whatsapp_clicked"));
    window.open(url, "_blank", "noopener,noreferrer");
    onComplete?.();
  };
  const next = async () => {
    if (await trigger(stepFields[step], { shouldFocus: true })) setStep((s) => s + 1);
  };
  const lastStep = stepTitles.length - 1;
  const submit = handleSubmit(onSubmit);
  const error = (name: keyof BookingValues) =>
    errors[name] ? (
      <span className="field-error" role="alert">
        {errors[name]?.message}
      </span>
    ) : null;
  const id = (name: string) => `${idPrefix}${name}`;

  const experienceSelect = (
    <div className="form-field">
      <label htmlFor={id("experience")}>Experience</label>
      <select id={id("experience")} {...register("experience")}>
        <option value="">Choose one</option>
        {experienceValues.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>
      {error("experience")}
    </div>
  );
  const experienceCards = (
    <fieldset className="rc-experience-choices">
      <legend className="sr-only">Experience</legend>
      {experienceValues.map((v, index) => (
        <label key={v} className="rc-experience-choice">
          <input type="radio" value={v} {...register("experience")} />
          <img src={experiences[index]?.image} alt="" loading="lazy" width="320" height="220" />
          <span className="rc-choice-index">0{index + 1}</span>
          <strong>{experienceLabels[v]}</strong>
          <small>{experiences[index]?.description}</small>
        </label>
      ))}
      {error("experience")}
    </fieldset>
  );
  const destinationField = (
    <div className="form-field">
      <label htmlFor={id("destination")}>
        {experience === "Rent A Camp" ? "Setup location" : "Destination / location"}
      </label>
      {options.length ? (
        <select id={id("destination")} {...register("destination")}>
          <option value="">Choose one</option>
          {options.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      ) : (
        <input
          id={id("destination")}
          placeholder={
            experience === "Rent A Camp"
              ? "Where should we bring the camp?"
              : "Choose an experience first"
          }
          {...register("destination")}
        />
      )}
      {error("destination")}
    </div>
  );
  const dateGuests = (
    <div className="form-grid">
      <div className="form-field">
        <label htmlFor={id("date")}>Date</label>
        <input
          id={id("date")}
          type="date"
          min={new Date().toISOString().split("T")[0]}
          {...register("date")}
        />
        {error("date")}
      </div>
      <div className="form-field">
        <label htmlFor={id("guests")}>People</label>
        <input
          id={id("guests")}
          type="number"
          min="1"
          inputMode="numeric"
          {...register("guests")}
        />
        {error("guests")}
      </div>
    </div>
  );
  const contact = (
    <div className="form-grid">
      <div className="form-field">
        <label htmlFor={id("name")}>Your name</label>
        <input
          id={id("name")}
          autoComplete="name"
          placeholder="Enter your name"
          {...register("name")}
        />
        {error("name")}
      </div>
      <div className="form-field">
        <label htmlFor={id("phone")}>WhatsApp number</label>
        <input
          id={id("phone")}
          type="tel"
          autoComplete="tel"
          placeholder="+91 Enter number"
          {...register("phone")}
        />
        {error("phone")}
      </div>
    </div>
  );
  const note = (
    <div className="form-field">
      <label htmlFor={id("message")}>
        Additional note <span>(optional)</span>
      </label>
      <textarea
        id={id("message")}
        rows={compact || stepped ? 2 : 4}
        placeholder="Tell us about your trip..."
        {...register("message")}
      />
      {error("message")}
    </div>
  );
  const configNote = !configured && (
    <p className="config-note" role="status">
      WhatsApp enquiries are being configured. You can still prepare your trip details here.
    </p>
  );

  if (stepped) {
    return (
      <form
        className={cn("booking-form", "booking-form-stepped", className)}
        onFocus={() => window.dispatchEvent(new CustomEvent("booking_form_started"))}
        onSubmit={(event) => {
          // Enter on an earlier step must advance, never validate the untouched later steps.
          if (step < lastStep) {
            event.preventDefault();
            void next();
            return;
          }
          void submit(event);
        }}
        noValidate
      >
        <div className="rc-step-head" data-rc="reveal">
          <p className="rc-step-count">
            STEP {step + 1} OF {stepTitles.length}
          </p>
          <ol className="rc-step-list" aria-label="Booking steps">
            {stepTitles.map((title, index) => (
              <li
                key={title}
                aria-current={index === step ? "step" : undefined}
                data-state={index === step ? "current" : index < step ? "done" : "todo"}
              >
                <span>0{index + 1}</span>
                {title}
              </li>
            ))}
          </ol>
        </div>
        <div
          ref={bodyRef}
          className={cn("rc-step-body", step !== startStep && "is-switched")}
          data-rc="reveal"
          key={step}
        >
          {step === 0 && experienceCards}
          {step === 1 && (
            <>
              {destinationField}
              {dateGuests}
            </>
          )}
          {step === 2 && (
            <>
              {contact}
              {note}
              {configNote}
            </>
          )}
        </div>
        <div className="rc-step-actions" data-rc="reveal">
          {step > 0 && (
            <button type="button" className="rc-step-back" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          )}
          {step < lastStep ? (
            <Button type="button" size="lg" className="rc-step-next" onClick={() => void next()}>
              Continue <span aria-hidden>→</span>
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              className="rc-step-next"
              disabled={!configured || isSubmitting}
            >
              Continue on WhatsApp <span aria-hidden>→</span>
            </Button>
          )}
        </div>
      </form>
    );
  }

  return (
    <form
      className={cn("booking-form", compact && "booking-form-compact", className)}
      onFocus={() => window.dispatchEvent(new CustomEvent("booking_form_started"))}
      onSubmit={submit}
      noValidate
    >
      {experienceSelect}
      {destinationField}
      {dateGuests}
      {contact}
      {!compact && experience === "Koraput Tour" && (
        <div className="form-field">
          <label htmlFor={id("pickupPoint")}>
            Pickup point <span>(optional)</span>
          </label>
          <input id={id("pickupPoint")} {...register("pickupPoint")} />
        </div>
      )}
      {note}
      {configNote}
      <Button
        type="submit"
        size="lg"
        className="w-full justify-between"
        disabled={!configured || isSubmitting}
      >
        Continue on WhatsApp {arrow === "right" ? <ArrowRight /> : <ArrowUpRight />}
      </Button>
    </form>
  );
}
