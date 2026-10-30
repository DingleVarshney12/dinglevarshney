"use client";

import { useEffect, useRef } from "react";
import { MapPin, X } from "lucide-react";
import { useApproximateVisitorLocation } from "@/hooks/use-approximate-visitor-location";
import { ContactRouteWorld } from "./contact-route-world";
import { CONTACT_DESTINATION, CONTACT_DESTINATION_LABEL } from "./contact-destination";

export function ContactJourneyDialog({
  open,
  visitorName,
  onClose,
}: {
  open: boolean;
  visitorName: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { location, status, requestLocation } = useApproximateVisitorLocation();

  useEffect(() => {
    if (!open) return;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const locationMessage =
    status === "denied"
      ? "Location permission declined. Your message still reached me."
      : status === "unavailable"
        ? "Location is unavailable here. Your message still reached me."
        : status === "ready"
          ? "Showing only an approximate city-level location. It stays on this device."
          : "Add your approximate city to the route. Your location is not saved or sent.";

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[120] grid place-items-center overflow-y-auto bg-[#102b2b]/65 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-journey-title"
        className="contact-journey-dialog relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/70 bg-[#f7f7f2] p-5 text-[#17272b] shadow-[0_30px_100px_rgba(0,0,0,.28)] sm:p-7"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close message confirmation"
          className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/80 text-slate-600 shadow-sm transition hover:bg-white hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-teal-700"
        >
          <X size={19} />
        </button>

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">
          A NOTE ON ITS WAY
        </p>
        <h2
          id="contact-journey-title"
          className="mt-2 pr-10 text-2xl font-black tracking-tight sm:text-3xl"
        >
          Thanks, {visitorName || "friend"}.
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
          Your message is in my inbox. Add your city to see its route to Firozabad.
        </p>

        <div className="contact-journey-globe relative mt-5 overflow-hidden rounded-[1.5rem] border border-teal-950/10 bg-[radial-gradient(ellipse_at_50%_42%,#e5f2e9_0%,#c7ded3_48%,#9cbdb0_100%)]">
          <div
            className="h-[260px] w-full sm:h-[320px]"
            aria-label="3D map showing your city and Firozabad"
          >
            <ContactRouteWorld destination={CONTACT_DESTINATION} visitor={location} />
          </div>
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 sm:inset-x-5 sm:bottom-4">
            {location && (
              <span className="inline-flex max-w-[48%] items-center gap-1.5 rounded-full border border-white/60 bg-white/90 px-3 py-2 text-[11px] font-bold text-[#24433f] shadow-md backdrop-blur sm:text-xs">
                <MapPin className="shrink-0 text-teal-700" size={14} />
                Your approximate city
              </span>
            )}
            <span className="ml-auto inline-flex max-w-[60%] items-center gap-1.5 rounded-full border border-white/60 bg-white/90 px-3 py-2 text-[11px] font-bold text-[#24433f] shadow-md backdrop-blur sm:text-xs">
              <MapPin className="shrink-0 text-amber-700" size={14} />
              {CONTACT_DESTINATION_LABEL}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="max-w-md text-xs leading-5 text-slate-500">
            {locationMessage}
          </p>
          {(status === "idle" || status === "denied" || status === "unavailable") && (
            <button
              type="button"
              onClick={requestLocation}
              className="shrink-0 rounded-full border border-teal-900/20 bg-white px-4 py-2.5 text-xs font-bold text-teal-900 shadow-sm transition hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              {status === "idle" ? "Add my approximate city" : "Try location again"}
            </button>
          )}
          {status === "loading" && (
            <span className="shrink-0 text-xs font-semibold text-teal-800">Finding your city…</span>
          )}
          {status === "ready" && (
            <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-900">
              City pin added
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
