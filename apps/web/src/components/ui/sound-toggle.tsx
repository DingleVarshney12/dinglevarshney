"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSoundEffects } from "@/audio/sound-effects-provider";

export function SoundToggle() {
  const { enabled, toggle } = useSoundEffects();
  const Icon = enabled ? Volume2 : VolumeX;
  return (
    <button
      type="button"
      onClick={toggle}
      data-sound="none"
      aria-pressed={enabled}
      aria-label={enabled ? "Mute sound effects" : "Turn on sound effects"}
      title={enabled ? "Mute sound effects" : "Turn on sound effects"}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-[#172b2c]/90 text-white shadow-sm transition hover:bg-[#244f45]"
    >
      <Icon size={17} aria-hidden="true" />
    </button>
  );
}
