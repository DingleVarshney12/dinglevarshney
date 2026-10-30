"use client";

import { useState, type PointerEvent } from "react";

export function HeroMascot() {
  const [gaze, setGaze] = useState({ x: 0, y: 0 });

  const followPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setGaze({
      x: Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)),
      y: Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2)),
    });
  };

  const relaxGaze = () => setGaze({ x: 0, y: 0 });
  const headStyle = {
    transform: `perspective(700px) rotateX(${-gaze.y * 4}deg) rotateY(${gaze.x * 7}deg)`,
  };
  const pupilStyle = {
    transform: `translate(${gaze.x * 5}px, ${gaze.y * 4}px)`,
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onPointerMove={followPointer}
      onPointerLeave={relaxGaze}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,#f9fff9_0%,#dcebe2_48%,#c7dbd0_100%)]" />
      <div className="absolute left-1/2 top-[13%] size-[68%] -translate-x-1/2 rounded-full border border-white/50 bg-white/20 shadow-[0_0_90px_rgba(255,255,255,.45)]" />
      <div className="absolute left-[12%] top-[22%] size-3 rounded-full bg-[#f2bd68] shadow-[0_0_18px_#f2bd68]" />
      <div className="absolute right-[15%] top-[32%] size-2 rounded-full bg-[#5ba995] shadow-[0_0_16px_#5ba995]" />
      <div className="absolute bottom-[19%] left-1/2 h-[13%] w-[72%] -translate-x-1/2 rounded-[50%] bg-[#87a991]/45 blur-md" />

      <div className="absolute inset-0 origin-[50%_55%] scale-[1.14]">
        <div className="absolute bottom-[18%] left-1/2 h-[19%] w-[45%] -translate-x-1/2 rounded-[48%_48%_24%_24%] border border-white/50 bg-gradient-to-br from-[#fbfffa] via-[#e7f0e9] to-[#b7d1c6] shadow-[0_20px_35px_rgba(34,75,67,.18)]">
          <div className="absolute left-1/2 top-[24%] grid size-[36%] -translate-x-1/2 place-items-center rounded-2xl border border-white/80 bg-[#d5eee5] text-[#347765] shadow-inner">
            <span className="text-[clamp(18px,4vw,32px)] font-black leading-none">D</span>
          </div>
          <span className="absolute bottom-[12%] left-[19%] h-2 w-2 rounded-full bg-[#6bc1a4] shadow-[0_0_12px_#6bc1a4]" />
          <span className="absolute bottom-[12%] right-[19%] h-2 w-2 rounded-full bg-[#f0bd68] shadow-[0_0_12px_#f0bd68]" />
        </div>

        <div className="absolute bottom-[29%] left-[24%] h-[13%] w-[13%] -rotate-12 rounded-full border border-white/60 bg-gradient-to-br from-[#eff8f1] to-[#bfd7cc] shadow-md" />
        <div className="absolute bottom-[29%] right-[24%] h-[13%] w-[13%] rotate-12 rounded-full border border-white/60 bg-gradient-to-br from-[#eff8f1] to-[#bfd7cc] shadow-md" />

        <div
          className="absolute left-1/2 top-[23%] h-[39%] w-[52%] -translate-x-1/2 transition-transform duration-150 ease-out"
          style={headStyle}
        >
          <div className="absolute left-1/2 top-[-11%] h-[14%] w-[2.5%] -translate-x-1/2 rounded-full bg-[#4c8171]" />
          <div className="absolute left-1/2 top-[-18%] size-[10%] -translate-x-1/2 rounded-full border-4 border-white bg-[#f0bd68] shadow-[0_0_18px_rgba(240,189,104,.7)]" />
          <div className="absolute left-[-5%] top-[40%] h-[20%] w-[12%] rounded-l-full border border-white/70 bg-[#c8ded3] shadow-sm" />
          <div className="absolute right-[-5%] top-[40%] h-[20%] w-[12%] rounded-r-full border border-white/70 bg-[#c8ded3] shadow-sm" />
          <div className="absolute inset-0 rounded-[38%_38%_34%_34%] border-[5px] border-white/90 bg-gradient-to-br from-[#ffffff] via-[#eef6ef] to-[#c4dbcf] shadow-[0_24px_40px_rgba(27,70,60,.2)] sm:border-[7px]">
            <div className="absolute inset-x-[11%] top-[24%] h-[45%] rounded-[2rem] border border-[#315c53]/20 bg-gradient-to-b from-[#24433f] to-[#142b2a] shadow-[inset_0_3px_12px_rgba(0,0,0,.3),0_5px_12px_rgba(25,65,58,.18)]">
              <div className="absolute left-[20%] top-[27%] grid size-[27%] place-items-center rounded-full border border-white/70 bg-[#ddfff0] shadow-[0_0_18px_rgba(128,255,202,.75)]">
                <span
                  className="size-[43%] rounded-full bg-[#173b3a] transition-transform duration-100"
                  style={pupilStyle}
                />
              </div>
              <div className="absolute right-[20%] top-[27%] grid size-[27%] place-items-center rounded-full border border-white/70 bg-[#ddfff0] shadow-[0_0_18px_rgba(128,255,202,.75)]">
                <span
                  className="size-[43%] rounded-full bg-[#173b3a] transition-transform duration-100"
                  style={pupilStyle}
                />
              </div>
              <span className="absolute bottom-[24%] left-[25%] size-[5%] rounded-full bg-[#ffb8a5]/80 shadow-[0_0_10px_rgba(255,184,165,.55)]" />
              <span className="absolute bottom-[24%] right-[25%] size-[5%] rounded-full bg-[#ffb8a5]/80 shadow-[0_0_10px_rgba(255,184,165,.55)]" />
              <div className="absolute bottom-[17%] left-1/2 h-[7%] w-[18%] -translate-x-1/2 rounded-full bg-[#75d5b0] shadow-[0_0_12px_rgba(117,213,176,.65)]" />
            </div>
            <div className="absolute left-[13%] top-[15%] h-[8%] w-[24%] -rotate-12 rounded-full bg-white/75" />
          </div>
        </div>

        <div className="absolute bottom-[12%] left-1/2 h-[5%] w-[38%] -translate-x-1/2 rounded-full bg-[#71917a]/30 blur-sm" />
      </div>
    </div>
  );
}
