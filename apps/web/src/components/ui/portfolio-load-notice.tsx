"use client";

import { RefreshCw } from "lucide-react";

export function PortfolioLoadNotice({
  failedResources,
  onRetry,
  className = "",
}: {
  failedResources: string[];
  onRetry: () => void;
  className?: string;
}) {
  if (failedResources.length === 0) return null;

  return (
    <div
      role="status"
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-sm ${className}`}
    >
      <p>Some portfolio details could not load ({failedResources.join(", ")}).</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-amber-950 shadow-sm hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
      >
        <RefreshCw size={14} aria-hidden="true" /> Try again
      </button>
    </div>
  );
}
