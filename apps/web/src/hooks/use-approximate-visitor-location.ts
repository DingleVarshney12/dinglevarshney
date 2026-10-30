"use client";

import { useCallback, useState } from "react";
import type { MapPoint } from "@/components/contact-journey/contact-journey.type";

type LocationStatus = "idle" | "loading" | "ready" | "unavailable" | "denied";

function roundToCityLevel(value: number) {
  return Math.round(value * 10) / 10;
}

export function useApproximateVisitorLocation() {
  const [location, setLocation] = useState<MapPoint | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation || !window.isSecureContext) {
      setStatus("unavailable");
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({
          latitude: roundToCityLevel(coords.latitude),
          longitude: roundToCityLevel(coords.longitude),
        });
        setStatus("ready");
      },
      (error) => setStatus(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  }, []);

  return { location, status, requestLocation };
}
