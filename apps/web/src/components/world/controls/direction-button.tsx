import type { ReactNode } from "react";

export function DirectionButton({
  label,
  icon,
  onDown,
  onUp,
}: {
  label: string;
  icon: ReactNode;
  onDown: () => void;
  onUp: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-11 place-items-center rounded-full border border-white/70 bg-white/80 text-slate-800 shadow-lg backdrop-blur-md touch-none active:scale-95"
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerCancel={onUp}
    >
      {icon}
    </button>
  );
}
