function SkeletonLine({ className = "" }: { className?: string }) {
  return <span className={`block animate-pulse rounded-full bg-slate-200/80 ${className}`} />;
}

export function HeroContentSkeleton() {
  return (
    <div className="space-y-5" role="status" aria-label="Loading portfolio introduction">
      <span className="sr-only">Loading portfolio introduction…</span>
      <SkeletonLine className="h-10 w-4/5 rounded-xl sm:h-14" />
      <SkeletonLine className="h-5 w-3/4" />
      <div className="space-y-2">
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-5/6" />
      </div>
      <div className="flex gap-3 pt-2">
        <SkeletonLine className="h-11 w-36 rounded-full" />
        <SkeletonLine className="h-11 w-32 rounded-full" />
      </div>
    </div>
  );
}

export function ProjectGridSkeleton() {
  return (
    <div
      className="flex flex-wrap justify-center gap-5 lg:gap-6"
      role="status"
      aria-label="Loading projects"
    >
      <span className="sr-only">Loading projects…</span>
      {[0, 1].map((item) => (
        <article
          key={item}
          className="h-[420px] w-full max-w-[360px] shrink-0 rounded-3xl border border-slate-900/5 bg-white p-5 shadow-sm"
        >
          <SkeletonLine className="aspect-[2.8/1] w-full rounded-2xl" />
          <div className="space-y-3 p-3 pt-5">
            <SkeletonLine className="h-3 w-2/5" />
            <SkeletonLine className="h-5 w-3/4 rounded-md" />
            <SkeletonLine className="h-4 w-full rounded-md" />
            <SkeletonLine className="mt-8 h-px w-full rounded-none" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function AboutSectionSkeleton() {
  return (
    <div className="space-y-4 pt-1" role="status" aria-label="Loading about section">
      <span className="sr-only">Loading about section…</span>
      <SkeletonLine className="h-9 w-3/5 rounded-xl" />
      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-11/12" />
      <SkeletonLine className="h-4 w-4/5" />
    </div>
  );
}

export function CertificateGridSkeleton() {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading certificates"
    >
      <span className="sr-only">Loading certificates…</span>
      {[0, 1, 2].map((item) => (
        <article key={item} className="rounded-2xl border border-slate-900/5 bg-white p-4">
          <SkeletonLine className="mb-4 aspect-[16/10] w-full rounded-xl" />
          <SkeletonLine className="h-4 w-4/5 rounded-md" />
          <SkeletonLine className="mt-3 h-3 w-3/5" />
        </article>
      ))}
    </div>
  );
}

export function SkillGroupsSkeleton() {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading skills"
    >
      <span className="sr-only">Loading skills…</span>
      {[0, 1, 2].map((item) => (
        <article
          key={item}
          className="rounded-2xl border border-slate-900/5 bg-white p-5 shadow-sm"
        >
          <SkeletonLine className="h-5 w-2/5 rounded-md" />
          <div className="mt-5 flex gap-2">
            <SkeletonLine className="h-8 w-20 rounded-full" />
            <SkeletonLine className="h-8 w-24 rounded-full" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function ContactDetailsSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading contact details">
      <span className="sr-only">Loading contact details…</span>
      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-4/5" />
      <div className="flex gap-3 pt-1">
        <SkeletonLine className="h-4 w-14" />
        <SkeletonLine className="h-4 w-16" />
        <SkeletonLine className="h-4 w-14" />
      </div>
    </div>
  );
}
