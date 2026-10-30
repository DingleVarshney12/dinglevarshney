"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  createProject,
  deleteProject,
  getAdminProjects,
  updateProject,
} from "@/api/project/project.api";
import type { Project } from "@/api/project/project.type";
import { getAdminAccessToken } from "@/lib/supabase/get-admin-access-token";
import { Check, FolderKanban, LoaderCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import { ImageUploadField } from "./image-upload-field";

type ProjectDraft = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  technologies: string;
  images: string;
  demoUrl: string;
  githubUrl: string;
  role: string;
  year: string;
  featured: boolean;
  isPublished: boolean;
  sortOrder: string;
};

const EMPTY_DRAFT: ProjectDraft = {
  slug: "",
  title: "",
  description: "",
  longDescription: "",
  category: "Web app",
  technologies: "",
  images: "",
  demoUrl: "",
  githubUrl: "",
  role: "",
  year: "",
  featured: false,
  isPublished: false,
  sortOrder: "0",
};

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function makeSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toDraft(project: Project): ProjectDraft {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description,
    longDescription: project.longDescription ?? "",
    category: project.category,
    technologies: project.technologies.join(", "),
    images: project.images.join("\n"),
    demoUrl: project.demoUrl ?? "",
    githubUrl: project.githubUrl ?? "",
    role: project.role ?? "",
    year: project.year?.toString() ?? "",
    featured: project.featured,
    isPublished: project.isPublished,
    sortOrder: (project.sortOrder ?? 0).toString(),
  };
}

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [draft, setDraft] = useState<ProjectDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        const token = await getAdminAccessToken();
        const items = await getAdminProjects(token);
        if (!cancelled) setProjects(items);
      } catch (loadError) {
        if (!cancelled) setError(getMessage(loadError));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  function startNewProject() {
    setDraft({ ...EMPTY_DRAFT });
    setError("");
    setNotice("");
  }

  function startEditing(project: Project) {
    setDraft(toDraft(project));
    setError("");
    setNotice("");
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;

    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      const token = await getAdminAccessToken();
      const slug = makeSlug(draft.slug || draft.title);
      if (!slug) throw new Error("Add a project title or slug to create its page address.");

      const input = {
        slug,
        title: draft.title.trim(),
        description: draft.description.trim(),
        longDescription: draft.longDescription.trim() || null,
        category: draft.category.trim(),
        technologies: draft.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        images: draft.images
          .split(/\r?\n/)
          .map((item) => item.trim())
          .filter(Boolean),
        demoUrl: draft.demoUrl.trim() || null,
        githubUrl: draft.githubUrl.trim() || null,
        role: draft.role.trim() || null,
        year: draft.year ? Number(draft.year) : null,
        featured: draft.featured,
        isPublished: draft.isPublished,
        sortOrder: Number(draft.sortOrder) || 0,
      };

      if (draft.id) await updateProject(draft.id, input, token);
      else await createProject(input, token);

      setProjects(await getAdminProjects(token));
      setDraft(null);
      setNotice(draft.id ? "Project saved." : "Project added.");
    } catch (saveError) {
      setError(getMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  async function removeProject(project: Project) {
    if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) return;
    setError("");
    setNotice("");

    try {
      const token = await getAdminAccessToken();
      await deleteProject(project.id, token);
      setProjects((current) => current.filter((item) => item.id !== project.id));
      if (draft?.id === project.id) setDraft(null);
      setNotice("Project deleted.");
    } catch (deleteError) {
      setError(getMessage(deleteError));
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-[#ded6c7] bg-[#fffdf8] p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#2a6355]">
            <FolderKanban size={15} /> Work showcase
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[#263432]">Projects</h2>
          <p className="mt-1 text-sm text-[#68736c]">
            Published projects appear in the room&apos;s desk section.
          </p>
        </div>
        <button
          type="button"
          onClick={startNewProject}
          className="inline-flex items-center gap-2 rounded-xl bg-[#244f45] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c4038]"
        >
          <Plus size={16} /> Add project
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
          onSubmit={saveProject}
          className="mt-6 space-y-4 rounded-2xl border border-[#d7d5ca] bg-[#faf8f1] p-4 sm:p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-[#263432]">
              {draft.id ? "Edit project" : "New project"}
            </h3>
            <button
              type="button"
              onClick={() => setDraft(null)}
              aria-label="Close project editor"
              className="rounded-lg p-2 text-[#68736c] hover:bg-black/5"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[#34413d]">
              Project title
              <input
                required
                maxLength={120}
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]"
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Page slug
              <input
                value={draft.slug}
                onChange={(event) => setDraft({ ...draft, slug: event.target.value })}
                placeholder="auto from title"
                className="mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]"
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Category
              <input
                required
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                placeholder="Web app, 3D, API…"
                className="mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]"
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Your role
              <input
                value={draft.role}
                onChange={(event) => setDraft({ ...draft, role: event.target.value })}
                placeholder="e.g. Full-stack developer"
                className="mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]"
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d] sm:col-span-2">
              Short description
              <textarea
                required
                rows={2}
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                className="mt-1.5 w-full resize-y rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal leading-6 outline-none focus:border-[#2a6355]"
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d] sm:col-span-2">
              Full description
              <textarea
                rows={5}
                value={draft.longDescription}
                onChange={(event) => setDraft({ ...draft, longDescription: event.target.value })}
                className="mt-1.5 w-full resize-y rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal leading-6 outline-none focus:border-[#2a6355]"
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Technologies (comma separated)
              <input
                value={draft.technologies}
                onChange={(event) => setDraft({ ...draft, technologies: event.target.value })}
                placeholder="Next.js, TypeScript, Supabase"
                className="mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]"
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Project year
              <input
                type="number"
                min={1900}
                max={2200}
                value={draft.year}
                onChange={(event) => setDraft({ ...draft, year: event.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]"
              />
            </label>
            <ImageUploadField
              label="Project images"
              value={draft.images}
              onChange={(images) => setDraft({ ...draft, images })}
              folder="projects"
              multiple
            />
            <label className="text-sm font-semibold text-[#34413d]">
              Live demo URL
              <input
                type="url"
                value={draft.demoUrl}
                onChange={(event) => setDraft({ ...draft, demoUrl: event.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]"
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              GitHub URL
              <input
                type="url"
                value={draft.githubUrl}
                onChange={(event) => setDraft({ ...draft, githubUrl: event.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]"
              />
            </label>
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

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#34413d]">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(event) => setDraft({ ...draft, featured: event.target.checked })}
                className="size-4 accent-[#244f45]"
              />{" "}
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-[#34413d]">
              <input
                type="checkbox"
                checked={draft.isPublished}
                onChange={(event) => setDraft({ ...draft, isPublished: event.target.checked })}
                className="size-4 accent-[#244f45]"
              />{" "}
              Publish in the portfolio
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#244f45] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSaving ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}
            {isSaving ? "Saving…" : "Save project"}
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="mt-6 flex items-center gap-2 text-sm text-[#68736c]">
          <LoaderCircle size={16} className="animate-spin" /> Loading projects…
        </p>
      ) : projects.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-[#d7d5ca] px-5 py-8 text-center text-sm text-[#68736c]">
          No projects yet. Add your first project above.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-[#ebe5d9]">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-[#263432]">{project.title}</h3>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${project.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-[#f2ecdc] text-[#756744]"}`}
                  >
                    {project.isPublished ? "Published" : "Draft"}
                  </span>
                  {project.featured && (
                    <span className="rounded-full bg-[#e7f0e9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#2a6355]">
                      Featured
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-[#68736c]">
                  {project.category} · {project.description}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => startEditing(project)}
                  aria-label={`Edit ${project.title}`}
                  className="rounded-lg border border-[#d7d5ca] bg-white p-2 text-[#34413d] hover:bg-[#f8f6ef]"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => void removeProject(project)}
                  aria-label={`Delete ${project.title}`}
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
