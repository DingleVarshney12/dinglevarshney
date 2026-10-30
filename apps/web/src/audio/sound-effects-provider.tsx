"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type SoundEffect =
  "tap" | "interact" | "enter" | "exit" | "page" | "step" | "temple" | "toggle" | "link";
type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
  play: (effect: SoundEffect) => void;
};
const SoundContext = createContext<SoundContextValue | null>(null);
const STORAGE_KEY = "portfolio-sound-enabled";

class SoundEngine {
  private context: AudioContext | null = null;

  private getContext() {
    if (this.context) return this.context;
    const AudioContextClass = window.AudioContext;
    this.context = new AudioContextClass();
    return this.context;
  }

  private tone(
    frequency: number,
    endFrequency: number,
    startAt: number,
    duration: number,
    volume: number,
    wave: OscillatorType = "sine",
  ) {
    const context = this.getContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, startAt);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(endFrequency, 1),
      startAt + duration,
    );
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + Math.min(0.012, duration / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.01);
  }

  private noise(startAt: number, duration: number, volume: number, cutoff: number) {
    const context = this.getContext();
    const buffer = context.createBuffer(
      1,
      Math.ceil(context.sampleRate * duration),
      context.sampleRate,
    );
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < channel.length; index += 1) channel[index] = Math.random() * 2 - 1;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, startAt);
    filter.frequency.exponentialRampToValueAtTime(Math.max(cutoff * 0.35, 40), startAt + duration);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + Math.min(0.008, duration / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start(startAt);
    source.stop(startAt + duration + 0.01);
  }

  play(effect: SoundEffect) {
    const context = this.getContext();
    if (context.state === "suspended") void context.resume();
    const now = context.currentTime + 0.003;
    switch (effect) {
      case "step":
        this.noise(now, 0.075, 0.035, 210);
        this.tone(92, 55, now, 0.07, 0.035, "triangle");
        break;
      case "page":
        this.noise(now, 0.16, 0.035, 1850);
        this.tone(420, 280, now + 0.015, 0.1, 0.012);
        break;
      case "enter":
        this.tone(420, 560, now, 0.14, 0.045, "triangle");
        this.tone(630, 820, now + 0.075, 0.18, 0.038, "sine");
        break;
      case "exit":
        this.tone(690, 470, now, 0.12, 0.04, "triangle");
        this.tone(490, 350, now + 0.07, 0.16, 0.035, "sine");
        break;
      case "interact":
        this.tone(520, 650, now, 0.07, 0.035);
        this.tone(780, 620, now + 0.045, 0.085, 0.025);
        break;
      case "temple":
        this.tone(587, 587, now, 0.24, 0.045, "sine");
        this.tone(740, 740, now + 0.08, 0.26, 0.04, "sine");
        this.tone(880, 880, now + 0.16, 0.32, 0.035, "sine");
        break;
      case "link":
        this.tone(900, 1120, now, 0.07, 0.03);
        break;
      case "toggle":
        this.tone(500, 740, now, 0.1, 0.035, "triangle");
        break;
      case "tap":
      default:
        this.tone(680, 470, now, 0.045, 0.026, "sine");
    }
  }
}

export function SoundEffectsProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(true);
  const engineRef = useRef<SoundEngine | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "false") {
        enabledRef.current = false;
        setEnabled(false);
      }
    } catch {
    }
  }, []);

  const play = useCallback((effect: SoundEffect) => {
    if (!enabledRef.current || typeof window === "undefined") return;
    try {
      engineRef.current ??= new SoundEngine();
      engineRef.current.play(effect);
    } catch {
    }
  }, []);

  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
    }
    if (next) play("toggle");
  }, [play]);

  useEffect(() => {
    function onControlClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const control = target.closest("button, a, [role='button']");
      if (!control || control.getAttribute("data-sound") === "none") return;
      const sound = control.getAttribute("data-sound") as SoundEffect | null;
      play(sound ?? (control.tagName === "A" ? "link" : "tap"));
    }
    document.addEventListener("click", onControlClick, true);
    return () => document.removeEventListener("click", onControlClick, true);
  }, [play]);

  return (
    <SoundContext.Provider value={{ enabled, toggle, play }}>{children}</SoundContext.Provider>
  );
}

export function useSoundEffects() {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSoundEffects must be used within SoundEffectsProvider.");
  return context;
}
