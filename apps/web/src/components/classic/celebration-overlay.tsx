"use client";

import { useEffect, useState } from "react";
import { Coins, X } from "lucide-react";
import type { CelebrationConfig } from "@/api/celebration/celebration.type";

const symbols: Record<CelebrationConfig["effect"], string[]> = {
  coins: [],
  petals: ["🌸", "🌼", "🌺", "🌷"],
  confetti: ["🎉", "🎊", "🟣", "🟡", "🟢", "🔵"],
  lights: ["🪔", "🪔", "✨", "⭐"],
};

export function CelebrationOverlay({ celebration }: { celebration: CelebrationConfig | null }) {
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => setDismissed(false), [celebration?.id]);
  if (!celebration || dismissed) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-live="polite">
      {Array.from({ length: 22 }, (_, index) => (
        <span
          key={index}
          className="celebration-particle absolute -top-12 text-2xl sm:text-3xl"
          style={{
            left: `${(index * 47 + 9) % 100}%`,
            animationDelay: `${(index % 11) * 0.48}s`,
            animationDuration: `${5 + (index % 5)}s`,
            color: celebration.accentColor,
          }}
          aria-hidden="true"
        >
          {celebration.effect === "coins" ? (
            <Coins size={27} strokeWidth={2.6} fill={`${celebration.accentColor}55`} />
          ) : (
            symbols[celebration.effect][index % symbols[celebration.effect].length]
          )}
        </span>
      ))}
      <div className="pointer-events-auto absolute left-1/2 top-5 flex w-[min(92vw,560px)] -translate-x-1/2 items-center gap-4 rounded-2xl border border-white/70 bg-[#102d2c]/95 px-5 py-4 text-white shadow-2xl backdrop-blur-md sm:top-8 sm:px-7 sm:py-5">
        <div className="min-w-0 flex-1">
          <p
            className="text-[10px] font-bold uppercase tracking-[.2em]"
            style={{ color: celebration.accentColor }}
          >
            {celebration.name}
          </p>
          <p className="mt-1 text-xl font-black sm:text-2xl">{celebration.message}</p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Close celebration"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20"
        >
          <X size={18} />
        </button>
      </div>
      <style jsx>{`
        @keyframes celebration-fall {
          0% {
            transform: translate3d(0, -8vh, 0) rotate(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate3d(24px, 115vh, 0) rotate(540deg);
            opacity: 0;
          }
        }
        .celebration-particle {
          animation-name: celebration-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .celebration-particle {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
