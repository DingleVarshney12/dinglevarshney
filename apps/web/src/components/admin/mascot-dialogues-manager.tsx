"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check, MessageCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  createMascotDialogue,
  deleteMascotDialogue,
  getAdminMascotDialogues,
  updateMascotDialogue,
} from "@/api/mascot-dialogue/mascot-dialogue.api";
import type {
  MascotDialogue,
  MascotDialogueInput,
} from "@/api/mascot-dialogue/mascot-dialogue.type";
import { getAdminAccessToken } from "@/lib/supabase/get-admin-access-token";

type DialogueDraft = {
  id?: string;
  question: string;
  answer: string;
  topic: string;
  isPublished: boolean;
  sortOrder: string;
};
const emptyDraft: DialogueDraft = {
  question: "",
  answer: "",
  topic: "About me",
  isPublished: false,
  sortOrder: "0",
};
const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]";

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}
function toDraft(dialogue: MascotDialogue): DialogueDraft {
  return {
    id: dialogue.id,
    question: dialogue.question,
    answer: dialogue.answer,
    topic: dialogue.topic,
    isPublished: dialogue.isPublished,
    sortOrder: String(dialogue.sortOrder ?? 0),
  };
}
function toInput(draft: DialogueDraft): MascotDialogueInput {
  return {
    question: draft.question.trim(),
    answer: draft.answer.trim(),
    topic: draft.topic.trim(),
    isPublished: draft.isPublished,
    sortOrder: Number(draft.sortOrder) || 0,
  };
}

export function MascotDialoguesManager() {
  const [dialogues, setDialogues] = useState<MascotDialogue[]>([]);
  const [draft, setDraft] = useState<DialogueDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadDialogues() {
      try {
        const token = await getAdminAccessToken();
        const items = await getAdminMascotDialogues(token);
        if (!cancelled) setDialogues(items);
      } catch (loadError) {
        if (!cancelled) setError(getMessage(loadError));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void loadDialogues();
    return () => {
      cancelled = true;
    };
  }, []);

  function startNew() {
    setDraft({ ...emptyDraft });
    setError("");
    setNotice("");
  }
  function startEditing(dialogue: MascotDialogue) {
    setDraft(toDraft(dialogue));
    setError("");
    setNotice("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    setIsSaving(true);
    setError("");
    setNotice("");
    try {
      const token = await getAdminAccessToken();
      const input = toInput(draft);
      if (draft.id) await updateMascotDialogue(draft.id, input, token);
      else await createMascotDialogue(input, token);
      setDialogues(await getAdminMascotDialogues(token));
      setDraft(null);
      setNotice(draft.id ? "Conversation updated." : "Conversation added.");
    } catch (saveError) {
      setError(getMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  async function remove(dialogue: MascotDialogue) {
    if (!window.confirm(`Delete this question: “${dialogue.question}”?`)) return;
    setError("");
    setNotice("");
    try {
      const token = await getAdminAccessToken();
      await deleteMascotDialogue(dialogue.id, token);
      setDialogues((current) => current.filter((item) => item.id !== dialogue.id));
      if (draft?.id === dialogue.id) setDraft(null);
      setNotice("Conversation deleted.");
    } catch (deleteError) {
      setError(getMessage(deleteError));
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-[#ded6c7] bg-[#fffdf8] p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#2a6355]">
            <MessageCircle size={15} /> Mascot personality
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[#263432]">Mascot conversations</h2>
          <p className="mt-1 text-sm text-[#68736c]">
            Add the questions visitors can ask and the answers your mascot shares.
          </p>
        </div>
        {!draft && (
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-xl bg-[#244f45] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c4038]"
          >
            <Plus size={16} /> Add conversation
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {notice}
        </p>
      )}
      {draft && (
        <form
          onSubmit={save}
          className="mt-6 space-y-4 rounded-2xl border border-[#d7d5ca] bg-[#faf8f1] p-4 sm:p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-[#263432]">
              {draft.id ? "Edit conversation" : "New conversation"}
            </h3>
            <button
              type="button"
              onClick={() => setDraft(null)}
              aria-label="Close conversation editor"
              className="rounded-lg p-2 text-[#68736c] hover:bg-black/5"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[#34413d]">
              Topic
              <input
                required
                maxLength={80}
                value={draft.topic}
                onChange={(event) => setDraft({ ...draft, topic: event.target.value })}
                placeholder="About me, projects, fun…"
                className={inputClass}
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Display order
              <input
                type="number"
                min={0}
                value={draft.sortOrder}
                onChange={(event) => setDraft({ ...draft, sortOrder: event.target.value })}
                className={inputClass}
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d] sm:col-span-2">
              Visitor&apos;s question
              <input
                required
                maxLength={300}
                value={draft.question}
                onChange={(event) => setDraft({ ...draft, question: event.target.value })}
                placeholder="What do you enjoy building?"
                className={inputClass}
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d] sm:col-span-2">
              Mascot&apos;s answer
              <textarea
                required
                rows={4}
                maxLength={3000}
                value={draft.answer}
                onChange={(event) => setDraft({ ...draft, answer: event.target.value })}
                placeholder="Write a friendly answer…"
                className={`${inputClass} resize-y leading-6`}
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-[#34413d] sm:col-span-2">
              <input
                type="checkbox"
                checked={draft.isPublished}
                onChange={(event) => setDraft({ ...draft, isPublished: event.target.checked })}
                className="size-4 accent-[#244f45]"
              />{" "}
              Publish this conversation
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-[#244f45] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Check size={15} /> {isSaving ? "Saving…" : "Save conversation"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="rounded-full border border-[#d7d5ca] bg-white px-4 py-2.5 text-sm font-semibold text-[#34413d]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {isLoading ? (
        <p className="mt-6 text-sm text-[#68736c]">Loading conversations…</p>
      ) : dialogues.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-[#d7d5ca] p-6 text-sm text-[#68736c]">
          No conversations yet. Add questions and answers for your mascot.
        </p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {dialogues.map((dialogue) => (
            <article key={dialogue.id} className="rounded-2xl border border-[#e3dccd] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#e7f0e9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#2a6355]">
                      {dialogue.topic}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${dialogue.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-[#f2ecdc] text-[#756744]"}`}
                    >
                      {dialogue.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold text-[#263432]">{dialogue.question}</h3>
                  <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-[#68736c]">
                    {dialogue.answer}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => startEditing(dialogue)}
                    aria-label={`Edit ${dialogue.question}`}
                    className="rounded-lg p-2 text-[#2a6355] hover:bg-[#e7f0e9]"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(dialogue)}
                    aria-label={`Delete ${dialogue.question}`}
                    className="rounded-lg p-2 text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
