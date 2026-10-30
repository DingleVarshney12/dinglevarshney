"use client";

import { useEffect, useState, type FormEvent } from "react";
import { FileText, Plus, Save, Trash2 } from "lucide-react";
import type { ResumeEntry, ResumeEntryKind } from "@/api/resume-content/resume-content.type";
import {
  createResumeEntry,
  deleteResumeEntry,
  getAdminResumeEntries,
  updateResumeEntry,
  type SaveResumeEntryInput,
} from "@/api/resume-content/resume-content.api";
import { getAdminAccessToken } from "@/lib/supabase/get-admin-access-token";

const kinds: { value: ResumeEntryKind; label: string }[] = [
  { value: "education", label: "Education" },
  { value: "experience", label: "Experience" },
  { value: "activity", label: "Activity / project" },
  { value: "language", label: "Language" },
  { value: "interest", label: "Interest" },
];
const blank: SaveResumeEntryInput = {
  kind: "education",
  title: "",
  organization: "",
  location: "",
  startDate: "",
  endDate: "",
  details: "",
  bullets: [],
  isPublished: false,
  sortOrder: 0,
};
const fieldClass =
  "mt-1 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#2a6355]";
const displayDate = (entry: ResumeEntry) =>
  [entry.startDate, entry.endDate].filter(Boolean).join(" – ");

function toInput(entry: ResumeEntry): SaveResumeEntryInput {
  return {
    kind: entry.kind,
    title: entry.title,
    organization: entry.organization ?? "",
    location: entry.location ?? "",
    startDate: entry.startDate ?? "",
    endDate: entry.endDate ?? "",
    details: entry.details ?? "",
    bullets: entry.bullets ?? [],
    isPublished: entry.isPublished,
    sortOrder: entry.sortOrder,
  };
}

export function ResumeContentManager() {
  const [entries, setEntries] = useState<ResumeEntry[]>([]);
  const [draft, setDraft] = useState<SaveResumeEntryInput>(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bulletsText, setBulletsText] = useState("");
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setBusy(true);
    try {
      setEntries(await getAdminResumeEntries(await getAdminAccessToken()));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load resume content.");
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  function startEdit(entry: ResumeEntry) {
    setEditingId(entry.id);
    setDraft(toInput(entry));
    setBulletsText(entry.bullets.join("\n"));
    setNotice("");
  }
  function reset() {
    setEditingId(null);
    setDraft(blank);
    setBulletsText("");
  }
  function update<K extends keyof SaveResumeEntryInput>(key: K, value: SaveResumeEntryInput[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const input = {
      ...draft,
      bullets: bulletsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      organization: draft.organization?.trim() || null,
      location: draft.location?.trim() || null,
      startDate: draft.startDate?.trim() || null,
      endDate: draft.endDate?.trim() || null,
      details: draft.details?.trim() || null,
    };
    try {
      const token = await getAdminAccessToken();
      if (editingId) await updateResumeEntry(editingId, input, token);
      else await createResumeEntry(input, token);
      reset();
      setNotice("Resume entry saved.");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this entry.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(entry: ResumeEntry) {
    if (!window.confirm(`Delete “${entry.title}” from your resume?`)) return;
    try {
      await deleteResumeEntry(entry.id, await getAdminAccessToken());
      setEntries((current) => current.filter((item) => item.id !== entry.id));
      if (editingId === entry.id) reset();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete this entry.");
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-[#ded6c7] bg-[#fffdf8] p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.17em] text-[#2a6355]">
            Resume builder
          </p>
          <h2 className="mt-1 font-serif text-2xl text-[#263432]">Resume content</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68736c]">
            Add only your real details. Published entries appear in the downloadable PDF; drafts
            stay private. Projects, skills, certificates and LeetCode stats are included
            automatically.
          </p>
        </div>
        <a
          href="/resume"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[#b9cfc0] bg-white px-4 py-2.5 text-sm font-semibold text-[#2a6355]"
        >
          <FileText size={16} /> Preview PDF
        </a>
      </div>
      {error && (
        <p role="alert" className="mt-4 text-sm text-rose-700">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="mt-4 text-sm text-emerald-800">
          {notice}
        </p>
      )}
      <div className="mt-6 grid gap-3">
        {busy ? (
          <p className="text-sm text-[#68736c]">Loading resume entries…</p>
        ) : entries.length === 0 ? (
          <p className="rounded-xl bg-[#f5f2e9] p-4 text-sm text-[#68736c]">
            No extra resume sections yet. Add education, experience, or activities below.
          </p>
        ) : (
          entries.map((entry) => (
            <article
              key={entry.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e7e0d3] bg-white p-4"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#e7f0e9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#2a6355]">
                    {entry.kind}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${entry.isPublished ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}
                  >
                    {entry.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <h3 className="mt-2 font-semibold text-[#263432]">{entry.title}</h3>
                <p className="mt-1 text-xs text-[#68736c]">
                  {[entry.organization, displayDate(entry)].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(entry)}
                  className="rounded-full border border-[#d7d5ca] px-3 py-2 text-xs font-semibold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void remove(entry)}
                  aria-label={`Delete ${entry.title}`}
                  className="rounded-full p-2 text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
      <form
        onSubmit={submit}
        className="mt-6 grid gap-4 rounded-xl border border-[#e3dccd] bg-[#faf8f1] p-4 sm:p-5"
      >
        <h3 className="font-semibold text-[#34413d]">
          {editingId ? "Edit resume entry" : "Add resume entry"}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[#34413d]">
            Section
            <select
              value={draft.kind}
              onChange={(event) => update("kind", event.target.value as ResumeEntryKind)}
              className={fieldClass}
            >
              {kinds.map((kind) => (
                <option value={kind.value} key={kind.value}>
                  {kind.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-[#34413d]">
            Title
            <input
              required
              maxLength={180}
              value={draft.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="MCA, Software Developer Intern…"
              className={fieldClass}
            />
          </label>
          <label className="text-sm font-semibold text-[#34413d]">
            School / company / organization
            <input
              value={draft.organization ?? ""}
              onChange={(event) => update("organization", event.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="text-sm font-semibold text-[#34413d]">
            Location
            <input
              value={draft.location ?? ""}
              onChange={(event) => update("location", event.target.value)}
              placeholder="City, State"
              className={fieldClass}
            />
          </label>
          <label className="text-sm font-semibold text-[#34413d]">
            Start date
            <input
              value={draft.startDate ?? ""}
              onChange={(event) => update("startDate", event.target.value)}
              placeholder="Aug 2024"
              className={fieldClass}
            />
          </label>
          <label className="text-sm font-semibold text-[#34413d]">
            End date
            <input
              value={draft.endDate ?? ""}
              onChange={(event) => update("endDate", event.target.value)}
              placeholder="Present"
              className={fieldClass}
            />
          </label>
        </div>
        <label className="text-sm font-semibold text-[#34413d]">
          Description / details
          <textarea
            rows={2}
            value={draft.details ?? ""}
            onChange={(event) => update("details", event.target.value)}
            placeholder="Optional short detail"
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-semibold text-[#34413d]">
          Bullet points
          <textarea
            rows={4}
            value={bulletsText}
            onChange={(event) => setBulletsText(event.target.value)}
            placeholder="One bullet per line"
            className={fieldClass}
          />
          <span className="mt-1 block text-xs font-normal text-[#68736c]">
            Each new line becomes a bullet in the PDF.
          </span>
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-[#34413d]">
          <input
            type="checkbox"
            checked={draft.isPublished}
            onChange={(event) => update("isPublished", event.target.checked)}
            className="size-4 accent-[#244f45]"
          />{" "}
          Publish this entry in the downloadable resume
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[#244f45] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? "Saving…" : editingId ? "Save changes" : "Add entry"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-[#d7d5ca] bg-white px-4 py-2.5 text-sm font-semibold"
            >
              Cancel
            </button>
          )}
          {!editingId && (
            <span className="inline-flex items-center gap-1.5 self-center text-xs text-[#68736c]">
              <Plus size={14} /> New entry
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
