"use client";

import { useCountUp } from "@/hooks/use-count-up";

export function CountUpNumber({
  value,
  minimumDigits = 1,
  duration = 1100,
}: {
  value: number;
  minimumDigits?: number;
  duration?: number;
}) {
  const { count, elementRef } = useCountUp(value, duration);

  return <span ref={elementRef}>{String(count).padStart(minimumDigits, "0")}</span>;
}
