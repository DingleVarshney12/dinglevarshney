"use client";

import { useEffect, useState } from "react";
import type { MascotDialogue } from "@/lib/types";
import { ChevronLeft, ChevronRight, MessageCircle, X } from "lucide-react";

type Props = {
  dialogue?: MascotDialogue;
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
};

export function MascotConversation({ dialogue, index, total, onPrevious, onNext, onClose }: Props) {
  const [spokenAnswer, setSpokenAnswer] = useState("");

  useEffect(() => {
    const answer = dialogue?.answer ?? "I’m happy to chat. Check back soon for more answers!";
    let cursor = 0;
    setSpokenAnswer("");
    const timer = window.setInterval(() => {
      cursor = Math.min(answer.length, cursor + 4);
      setSpokenAnswer(answer.slice(0, cursor));
      if (cursor >= answer.length) window.clearInterval(timer);
    }, 18);
    return () => window.clearInterval(timer);
  }, [dialogue?.id, dialogue?.answer]);

  return (
    <section
      aria-label="Conversation with the portfolio mascot"
      className="relative max-h-[82vh] w-full max-w-md overflow-y-auto rounded-[1.75rem] border border-white/60 bg-[#f8f6ef]/95 p-4 text-[#263432] shadow-2xl backdrop-blur-sm sm:p-6"
    >
      <button
        type="button"
        data-sound="exit"
        onClick={onClose}
        aria-label="End conversation and return to the room"
        className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-black/5 hover:text-slate-800"
      >
        <X size={18} />
      </button>

      <div className="flex items-center gap-3 pr-10">
        <span className="grid size-11 place-items-center rounded-2xl bg-[#e3f1e9] text-[#2a6355]">
          <MessageCircle size={20} />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2a6355]">
            A little chat
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-[#68736c]">
            <span className="flex items-center gap-0.5">
              <i className="size-1 rounded-full bg-emerald-600 animate-pulse" />
              <i className="size-1 rounded-full bg-emerald-600 animate-pulse [animation-delay:120ms]" />
              <i className="size-1 rounded-full bg-emerald-600 animate-pulse [animation-delay:240ms]" />
            </span>{" "}
            Dingle is talking
          </div>
        </div>
        {dialogue && (
          <span className="ml-auto rounded-full bg-[#e9e3d4] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#756744]">
            {dialogue.topic}
          </span>
        )}
      </div>

      <div className="mt-7 space-y-4" key={dialogue?.id ?? "empty-chat"}>
        {dialogue ? (
          <>
            <div className="flex justify-end">
              <p className="max-w-[88%] rounded-2xl rounded-br-md bg-[#244f45] px-4 py-3 text-sm font-medium leading-6 text-white shadow-sm">
                {dialogue.question}
              </p>
            </div>
            <div className="flex items-end gap-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#edca91] text-xs font-black text-[#604823]">
                D
              </span>
              <p className="max-w-[92%] whitespace-pre-wrap rounded-2xl rounded-bl-md border border-[#e3dccd] bg-white px-4 py-3 text-sm leading-6 text-[#4e5b54] shadow-sm">
                {spokenAnswer}
                <span
                  aria-hidden="true"
                  className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-[#2a6355] animate-pulse"
                />
              </p>
            </div>
          </>
        ) : (
          <p className="rounded-2xl border border-dashed border-[#d7d5ca] bg-white/70 p-5 text-sm leading-6 text-[#68736c]">
            {spokenAnswer}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-900/10 pt-4">
        <button
          type="button"
          data-sound="interact"
          onClick={onPrevious}
          disabled={index <= 0}
          className="inline-flex items-center gap-1 rounded-full border border-[#d7d5ca] bg-white px-3.5 py-2 text-xs font-semibold text-[#34413d] transition hover:bg-[#f1efe8] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <span className="text-xs font-medium text-[#82704f]">
          {total ? `${index + 1} / ${total}` : "Ready"}
        </span>
        <button
          type="button"
          data-sound="interact"
          onClick={onNext}
          disabled={!dialogue || index >= total - 1}
          className="inline-flex items-center gap-1 rounded-full bg-[#244f45] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#1c4038] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {index >= total - 1 ? "End of chat" : "Keep chatting"} <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
