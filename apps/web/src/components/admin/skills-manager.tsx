"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { createSkill, deleteSkill, getAdminSkills, updateSkill } from "@/api/skill/skill.api";
import type { Skill, SkillInput } from "@/api/skill/skill.type";
import { getAdminAccessToken } from "@/lib/supabase/get-admin-access-token";

type SkillDraft = {
  id?: string;
  name: string;
  category: string;
  level: "" | "Beginner" | "Intermediate" | "Advanced" | "Expert";
  yearsOfExperience: string;
  iconUrl: string;
  isPublished: boolean;
  sortOrder: string;
};

const emptyDraft: SkillDraft = {
  name: "",
  category: "Frontend",
  level: "",
  yearsOfExperience: "",
  iconUrl: "",
  isPublished: false,
  sortOrder: "0",
};
const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]";
function createSkillDraft(category = ""): SkillDraft {
  return { ...emptyDraft, category };
}

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function toDraft(skill: Skill): SkillDraft {
  return {
    id: skill.id,
    name: skill.name,
    category: skill.category,
    level: skill.level ?? "",
    yearsOfExperience: skill.yearsOfExperience?.toString() ?? "",
    iconUrl: skill.iconUrl ?? "",
    isPublished: skill.isPublished,
    sortOrder: String(skill.sortOrder ?? 0),
  };
}

function toInput(draft: SkillDraft): SkillInput {
  return {
    name: draft.name.trim(),
    category: draft.category.trim(),
    level: draft.level || undefined,
    yearsOfExperience: draft.yearsOfExperience ? Number(draft.yearsOfExperience) : null,
    iconUrl: draft.iconUrl.trim() || null,
    isPublished: draft.isPublished,
    sortOrder: Number(draft.sortOrder) || 0,
  };
}

export function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [draft, setDraft] = useState<SkillDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadSkills() {
      try {
        const token = await getAdminAccessToken();
        const items = await getAdminSkills(token);
        if (!cancelled) setSkills(items);
      } catch (loadError) {
        if (!cancelled) setError(getMessage(loadError));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void loadSkills();
    return () => {
      cancelled = true;
    };
  }, []);

  function startNew() {
    setDraft(createSkillDraft());
    setError("");
    setNotice("");
  }

  function startEditing(skill: Skill) {
    setDraft(toDraft(skill));
    setError("");
    setNotice("");
  }

  function startNewInCategory(category: string) {
    setDraft(createSkillDraft(category));
    setError("");
    setNotice("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    setError("");
    setNotice("");
    setIsSaving(true);
    try {
      const token = await getAdminAccessToken();
      const input = toInput(draft);
      const saved = draft.id
        ? await updateSkill(draft.id, input, token)
        : await createSkill(input, token);
      setSkills((current) => {
        const next = draft.id
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [...current, saved];
        return next.sort(
          (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name),
        );
      });
      setDraft(null);
      setNotice(draft.id ? "Skill updated." : "Skill added.");
    } catch (saveError) {
      setError(getMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  async function removeSkill(skill: Skill) {
    if (!window.confirm(`Delete “${skill.name}”?`)) return;
    setError("");
    setNotice("");
    try {
      const token = await getAdminAccessToken();
      await deleteSkill(skill.id, token);
      setSkills((current) => current.filter((item) => item.id !== skill.id));
      setNotice("Skill deleted.");
      if (draft?.id === skill.id) setDraft(null);
    } catch (deleteError) {
      setError(getMessage(deleteError));
    }
  }

  const skillsByCategory = skills.reduce<Map<string, Skill[]>>((groups, skill) => {
    const category = skill.category.trim() || "Uncategorized";
    groups.set(category, [...(groups.get(category) ?? []), skill]);
    return groups;
  }, new Map());

  return (
    <section className="mt-8 rounded-2xl border border-[#ded6c7] bg-[#fffdf8] p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#2a6355]">
            Tools & craft
          </p>
          <h2 className="mt-1 font-serif text-2xl text-[#263432]">Skills</h2>
          <p className="mt-2 text-sm leading-6 text-[#68736c]">
            Create category cards, then add all related skills inside each one.
          </p>
        </div>
        {!draft && (
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-full bg-[#244f45] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1c4038]"
          >
            <Plus size={16} /> Add category
          </button>
        )}
      </div>

      {draft && (
        <form
          onSubmit={save}
          className="mt-6 grid gap-4 rounded-xl border border-[#e3dccd] bg-[#faf8f1] p-4 sm:grid-cols-2 sm:p-5"
        >
          <label className="text-sm font-semibold text-[#34413d]">
            Skill name
            <input
              required
              maxLength={100}
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              className={inputClass}
            />
          </label>
          <label className="text-sm font-semibold text-[#34413d]">
            Category
            <input
              required
              maxLength={80}
              value={draft.category}
              onChange={(event) => setDraft({ ...draft, category: event.target.value })}
              placeholder="Frontend, Backend, Tools…"
              className={inputClass}
            />
          </label>
          <label className="text-sm font-semibold text-[#34413d]">
            Level
            <select
              value={draft.level}
              onChange={(event) =>
                setDraft({ ...draft, level: event.target.value as SkillDraft["level"] })
              }
              className={`${inputClass} bg-white`}
            >
              <option value="">Not specified</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-[#34413d]">
            Years of experience
            <input
              type="number"
              min={0}
              max={80}
              step="0.5"
              value={draft.yearsOfExperience}
              onChange={(event) => setDraft({ ...draft, yearsOfExperience: event.target.value })}
              placeholder="Optional"
              className={inputClass}
            />
          </label>
          <label className="text-sm font-semibold text-[#34413d]">
            Icon URL
            <input
              type="url"
              value={draft.iconUrl}
              onChange={(event) => setDraft({ ...draft, iconUrl: event.target.value })}
              placeholder="Optional"
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
          <label className="flex items-center gap-2 text-sm font-medium text-[#34413d] sm:col-span-2">
            <input
              type="checkbox"
              checked={draft.isPublished}
              onChange={(event) => setDraft({ ...draft, isPublished: event.target.checked })}
              className="size-4 accent-[#244f45]"
            />{" "}
            Publish this skill
          </label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-[#244f45] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Check size={15} /> {isSaving ? "Saving…" : "Save skill"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="inline-flex items-center gap-2 rounded-full border border-[#d7d5ca] bg-white px-4 py-2.5 text-sm font-semibold text-[#34413d]"
            >
              <X size={15} /> Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="mt-6 text-sm text-[#68736c]">Loading skills…</p>
      ) : skills.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-[#d7d5ca] p-6 text-sm text-[#68736c]">
          No skills yet. Add the ones you want visitors to see.
        </p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[...skillsByCategory.entries()].map(([category, categorySkills]) => (
            <article
              key={category}
              className="rounded-2xl border border-[#e3dccd] bg-white p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3 border-b border-[#eee9df] pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#263432]">{category}</h3>
                  <p className="mt-0.5 text-xs text-[#68736c]">
                    {categorySkills.length} {categorySkills.length === 1 ? "skill" : "skills"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startNewInCategory(category)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#d7d5ca] px-3 py-1.5 text-xs font-semibold text-[#2a6355] hover:bg-[#e7f0e9]"
                >
                  <Plus size={13} /> Add skill
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#e3e5df] bg-[#fbfcf9] py-1 pl-3 pr-1.5"
                  >
                    <span className="text-sm font-semibold text-[#263432]">{skill.name}</span>
                    {!skill.isPublished && (
                      <span className="rounded-full bg-[#f2ecdc] px-1.5 py-0.5 text-[9px] font-bold text-[#756744]">
                        Draft
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => startEditing(skill)}
                      aria-label={`Edit ${skill.name}`}
                      className="rounded-full p-1 text-[#2a6355] hover:bg-[#e7f0e9]"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeSkill(skill)}
                      aria-label={`Delete ${skill.name}`}
                      className="rounded-full p-1 text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
      {notice && (
        <p role="status" className="mt-4 text-sm font-medium text-emerald-800">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}
    </section>
  );
}
