"use client";

import { useScrollProgress } from "@/hooks/use-scroll-progress";

export function ScrollProgress() {
  const progress = useScrollProgress();
  const percentage = Math.round(progress * 100);

  return (
    <div
      className="scroll-progress-track"
      role="progressbar"
      aria-label="Portfolio scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
    >
      <div className="scroll-progress-fill" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
