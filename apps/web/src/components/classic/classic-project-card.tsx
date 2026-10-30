import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/api/project/project.type";
import { ProjectImageGallery } from "@/components/world/project-image-gallery";

const previewTones = ["bg-[#d8f0e7]", "bg-[#ece8ff]", "bg-[#ffedcf]"];

export function ClassicProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="group flex h-[420px] w-full flex-col rounded-[1.5rem] border border-slate-900/5 bg-white p-5 shadow-[0_10px_35px_rgba(35,57,54,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(35,57,54,0.1)]">
      <div
        className={`relative mb-4 grid h-32 shrink-0 place-items-center rounded-[1.1rem] ${previewTones[index % previewTones.length]}`}
      >
        <div className="grid size-20 rotate-6 place-items-center rounded-[1.8rem] bg-white/75 text-3xl font-black text-teal-800 shadow-sm transition group-hover:rotate-0">
          {String(index + 1).padStart(2, "0")}
        </div>
        {project.images.length > 0 && (
          <div className="absolute bottom-2.5 right-2.5">
            <ProjectImageGallery images={project.images} projectTitle={project.title} />
          </div>
        )}
      </div>

      <div className="flex min-h-6 items-center justify-between gap-3">
        <span className="max-w-full truncate rounded-full bg-[#edf4ee] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#326451]">
          {project.category}
        </span>
        {project.year && (
          <span className="shrink-0 text-xs font-medium text-slate-500">{project.year}</span>
        )}
      </div>
      <h3 className="mt-2 line-clamp-2 min-h-7 text-lg font-bold text-[#17272b]">
        {project.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">{project.description}</p>
      <div className="mt-3 flex min-h-6 flex-wrap gap-1.5">
        {project.technologies.slice(0, 3).map((technology) => (
          <span
            key={technology}
            className="rounded-full border border-slate-900/10 px-2 py-1 text-[10px] font-medium text-slate-600"
          >
            {technology}
          </span>
        ))}
        {project.technologies.length > 3 && (
          <span className="rounded-full border border-slate-900/10 px-2 py-1 text-[10px] font-medium text-slate-600">
            +{project.technologies.length - 3}
          </span>
        )}
      </div>
      {(project.demoUrl || project.githubUrl) && (
        <div className="mt-auto flex min-h-10 flex-wrap items-end gap-x-5 gap-y-2 border-t border-slate-900/5 pt-3 text-sm font-semibold text-teal-800">
          {project.demoUrl && (
            <a
              className="inline-flex items-center gap-1 hover:text-teal-600"
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live demo <ArrowUpRight size={14} />
            </a>
          )}
          {project.githubUrl && (
            <a
              className="inline-flex items-center gap-1 hover:text-teal-600"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source code <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      )}
    </article>
  );
}
