"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  createAboutChapter,
  deleteAboutChapter,
  getAdminAboutChapters,
  updateAboutChapter,
} from "@/api/about-chapter/about-chapter.api";
import type { AboutChapter } from "@/api/about-chapter/about-chapter.type";
import { getAdminAccessToken } from "@/lib/supabase/get-admin-access-token";
import { ImageUploadField } from "./image-upload-field";
import { BookOpenText, Check, LoaderCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import { ChapterFormattingToolbar } from "./chapter-formatting-toolbar";

type ChapterDraft = {
  id?: string;
  title: string;
  content: string;
  year: string;
  imageUrl: string;
  isPublished: boolean;
  sortOrder: string;
};

const EMPTY_DRAFT: ChapterDraft = {
  title: "",
  content: "",
  year: "",
  imageUrl: "",
  isPublished: false,
  sortOrder: "0",
};

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function toDraft(chapter: AboutChapter): ChapterDraft {
  return {
    id: chapter.id,
    title: chapter.title,
    content: chapter.content,
    year: chapter.year?.toString() ?? "",
    imageUrl: chapter.imageUrl ?? "",
    isPublished: chapter.isPublished,
    sortOrder: chapter.sortOrder.toString(),
  };
}

export function AboutChaptersManager() {
  const storyInput = useRef<HTMLTextAreaElement>(null);
  const [chapters, setChapters] = useState<AboutChapter[]>([]);
  const [draft, setDraft] = useState<ChapterDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadChapters() {
      try {
        const token = await getAdminAccessToken();
        const items = await getAdminAboutChapters(token);
        if (!cancelled) setChapters(items);
      } catch (loadError) {
        if (!cancelled) setError(getMessage(loadError));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadChapters();
    return () => {
      cancelled = true;
    };
  }, []);

  function startNewChapter() {
    setError("");
    setNotice("");
    setDraft({ ...EMPTY_DRAFT });
  }

  function startEditing(chapter: AboutChapter) {
    setError("");
    setNotice("");
    setDraft(toDraft(chapter));
  }

  async function saveChapter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;

    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      const token = await getAdminAccessToken();
      const input = {
        title: draft.title.trim(),
        content: draft.content.trim(),
        year: draft.year ? Number(draft.year) : null,
        imageUrl: draft.imageUrl.trim() || null,
        isPublished: draft.isPublished,
        sortOrder: Number(draft.sortOrder) || 0,
      };

      if (draft.id) await updateAboutChapter(draft.id, input, token);
      else await createAboutChapter(input, token);

      setChapters(await getAdminAboutChapters(token));
      setDraft(null);
      setNotice(draft.id ? "Chapter saved." : "Chapter added.");
    } catch (saveError) {
      setError(getMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  async function removeChapter(chapter: AboutChapter) {
    if (!window.confirm(`Delete “${chapter.title}”? This cannot be undone.`)) return;
    setError("");
    setNotice("");

    try {
      const token = await getAdminAccessToken();
      await deleteAboutChapter(chapter.id, token);
      setChapters((current) => current.filter((item) => item.id !== chapter.id));
      if (draft?.id === chapter.id) setDraft(null);
      setNotice("Chapter deleted.");
    } catch (deleteError) {
      setError(getMessage(deleteError));
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-[#ded6c7] bg-[#fffdf8] p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#2a6355]">
            <BookOpenText size={15} /> About book
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[#263432]">Story chapters</h2>
          <p className="mt-1 text-sm text-[#68736c]">
            Each chapter becomes pages in the bookshelf storybook.
          </p>
        </div>
        <button
          type="button"
          onClick={startNewChapter}
          className="inline-flex items-center gap-2 rounded-xl bg-[#244f45] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c4038]"
        >
          <Plus size={16} /> Add chapter
        </button>
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
          onSubmit={saveChapter}
          className="mt-6 space-y-4 rounded-2xl border border-[#d7d5ca] bg-[#faf8f1] p-4 sm:p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-[#263432]">
              {draft.id ? "Edit chapter" : "New chapter"}
            </h3>
            <button
              type="button"
              onClick={() => setDraft(null)}
              aria-label="Close chapter editor"
              className="rounded-lg p-2 text-[#68736c] hover:bg-black/5"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-semibold text-[#34413d] sm:col-span-2">
              Chapter title
              <input
                required
                maxLength={120}
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]"
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Year
              <input
                type="number"
                min={1900}
                max={2200}
                value={draft.year}
                onChange={(event) => setDraft({ ...draft, year: event.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]"
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d] sm:col-span-3">
              Story
              <ChapterFormattingToolbar
                value={draft.content}
                textareaRef={storyInput}
                onChange={(content) => setDraft({ ...draft, content })}
              />
              <textarea
                ref={storyInput}
                required
                rows={8}
                value={draft.content}
                onChange={(event) => setDraft({ ...draft, content: event.target.value })}
                className="w-full resize-y rounded-b-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal leading-6 outline-none focus:border-[#2a6355]"
              />
            </label>
            <ImageUploadField
              label="Illustration image (optional)"
              value={draft.imageUrl}
              onChange={(imageUrl) => setDraft({ ...draft, imageUrl })}
              folder="about"
            />
            <label className="text-sm font-semibold text-[#34413d]">
              Display order
              <input
                required
                type="number"
                min={0}
                value={draft.sortOrder}
                onChange={(event) => setDraft({ ...draft, sortOrder: event.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]"
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-[#34413d]">
            <input
              type="checkbox"
              checked={draft.isPublished}
              onChange={(event) => setDraft({ ...draft, isPublished: event.target.checked })}
              className="size-4 accent-[#244f45]"
            />
            Publish this chapter in the About book
          </label>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#244f45] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSaving ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}
            {isSaving ? "Saving…" : "Save chapter"}
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="mt-6 flex items-center gap-2 text-sm text-[#68736c]">
          <LoaderCircle size={16} className="animate-spin" /> Loading chapters…
        </p>
      ) : chapters.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-[#d7d5ca] px-5 py-8 text-center text-sm text-[#68736c]">
          No chapters yet. Add your first story chapter above.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-[#ebe5d9]">
          {chapters.map((chapter) => (
            <li
              key={chapter.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-[#263432]">{chapter.title}</h3>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${chapter.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-[#f2ecdc] text-[#756744]"}`}
                  >
                    {chapter.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-[#68736c]">
                  {chapter.year ? `${chapter.year} · ` : ""}
                  {chapter.content}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => startEditing(chapter)}
                  aria-label={`Edit ${chapter.title}`}
                  className="rounded-lg border border-[#d7d5ca] bg-white p-2 text-[#34413d] hover:bg-[#f8f6ef]"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => void removeChapter(chapter)}
                  aria-label={`Delete ${chapter.title}`}
                  className="rounded-lg border border-red-100 bg-white p-2 text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
