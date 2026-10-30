"use client";

import { ArrowDownToLine, ArrowRight, Code2, Move3D } from "lucide-react";
import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import { createContactMessage } from "@/api/contact-message/contact-message.api";
import type { PublicPortfolioData } from "@/api/portfolio/portfolio.type";
import { ClassicProjectCard } from "./classic-project-card";
import { AboutSection } from "./about-section";
import { HeroMascot } from "./hero-mascot";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { PortfolioLoadNotice } from "../ui/portfolio-load-notice";
import { ScrollProgress } from "./scroll-progress";
import { useHideNativeScrollbar } from "@/hooks/use-hide-native-scrollbar";
import { ContactJourneyDialog } from "../contact-journey/contact-journey-dialog";
import { useLeetcodeStats } from "@/hooks/use-leetcode-stats";
import { LEETCODE_PROFILE_URL } from "@/api/leetcode/leetcode.api";
import { downloadResumePdf, generateResumePdf } from "@/features/resume/generate-resume-pdf";
import { SoundToggle } from "../ui/sound-toggle";
import { CountUpNumber } from "../ui/count-up-number";
import {
  CertificateGridSkeleton,
  ContactDetailsSkeleton,
  HeroContentSkeleton,
  ProjectGridSkeleton,
  SkillGroupsSkeleton,
} from "./portfolio-loading";
export function ClassicExperience({
  onBack,
  onTryWorld,
  data,
  loading,
  onRetry,
}: {
  onBack: () => void;
  onTryWorld: () => void;
  data: PublicPortfolioData;
  loading: boolean;
  onRetry: () => void;
}) {
  const [contactState, setContactState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [journeyOpen, setJourneyOpen] = useState(false);
  const [journeyVisitorName, setJourneyVisitorName] = useState("");
  const [isDownloadingResume, setIsDownloadingResume] = useState(false);
  const [resumeDownloadError, setResumeDownloadError] = useState("");
  const { stats: leetcodeStats, loading: leetcodeLoading } = useLeetcodeStats();
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const revealRootRef = useRef<HTMLElement | null>(null);
  useHideNativeScrollbar();
  useScrollReveal(revealRootRef, loading);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactState("sending");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const visitorName = String(formData.get("name") ?? "").trim();
    try {
      await createContactMessage({
        name: visitorName,
        email: String(formData.get("email") ?? ""),
        message: String(formData.get("message") ?? ""),
      });
      form.reset();
      setJourneyVisitorName(visitorName);
      setContactState("sent");
      setJourneyOpen(true);
    } catch {
      setContactState("error");
    }
  };

  const profile = data.profile;
  const aboutChapter = data.aboutChapters[0];
  const aboutText =
    profile?.about ??
    aboutChapter?.content ??
    "Your profile and book chapters will appear here once published in Supabase.";
  const displayName = profile?.name ?? "Dingle Varshney";
  const headlineItems = (profile?.headline ?? "I make playful things for the web.")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

  async function handleResumeDownload() {
    setIsDownloadingResume(true);
    setResumeDownloadError("");
    try {
      const pdf = await generateResumePdf(data, leetcodeStats);
      downloadResumePdf(pdf, displayName);
    } catch {
      setResumeDownloadError("Resume download failed. Please try again.");
    } finally {
      setIsDownloadingResume(false);
    }
  }

  return (
    <main
      ref={revealRootRef}
      className="portfolio-cursor min-h-screen overflow-x-clip bg-[#f7f7f2] text-[#17272b]"
    >
      <ScrollProgress />
      {!loading && (
        <PortfolioLoadNotice
          failedResources={data.failedResources}
          onRetry={onRetry}
          className="mx-auto mt-3 max-w-7xl px-5 sm:px-8 lg:px-12"
        />
      )}
      <header className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-x-3 gap-y-4 px-5 py-5 sm:px-8 md:flex md:justify-between lg:px-12">
        <a
          className="col-start-2 row-start-1 justify-self-center text-sm font-black tracking-[0.2em] md:col-auto md:justify-self-auto"
          href="#classic-home"
        >
          {displayName.toUpperCase()}
          <span className="text-teal-600">.</span>
        </a>
        <div className="col-start-3 row-start-1 justify-self-end md:hidden">
          <SoundToggle />
        </div>
        <nav
          aria-label="Main navigation"
          className="col-span-3 row-start-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-xs font-semibold text-slate-600 sm:text-sm md:col-auto md:row-auto md:justify-end md:gap-x-5 lg:gap-x-7"
        >
          <a href="#classic-projects" className="hover:text-teal-700">
            Projects
          </a>
          <a href="#classic-about" className="hover:text-teal-700">
            About
          </a>
          <a href="#classic-certificates" className="hover:text-teal-700">
            Certificates
          </a>
          <a href="#classic-skills" className="hover:text-teal-700">
            Skills
          </a>
          <a href="#classic-contact" className="hover:text-teal-700">
            Contact
          </a>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full bg-[#173b3a] px-4 py-2 text-white transition hover:bg-teal-800"
          >
            3D World
          </button>
          <span className="hidden md:inline-flex">
            <SoundToggle />
          </span>
        </nav>
      </header>
      <section
        id="classic-home"
        className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-12 sm:px-8 md:grid-cols-[1fr_.95fr] lg:gap-14 lg:px-12 lg:pb-24 lg:pt-16"
        aria-busy={loading}
      >
        <div className="relative z-10" data-reveal>
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-teal-700">
            <span className="size-2 rounded-full bg-teal-500" /> Hello, I&apos;m
          </p>
          {loading ? (
            <HeroContentSkeleton />
          ) : (
            <>
              <h1 className="max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                {displayName}
                <span className="text-teal-700">.</span>
              </h1>
              <p className="mt-5 flex items-center gap-2 text-base font-bold text-teal-800 sm:text-lg">
                <Code2 size={19} aria-hidden="true" />
                {headlineItems.join(" · ")}
              </p>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {profile?.shortBio ??
                  "A lightweight portfolio view with the same projects and details, ready to browse on any device."}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#classic-projects"
                  className="inline-flex items-center gap-2 rounded-full bg-[#173b3a] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-800"
                >
                  Explore my work <ArrowRight size={16} />
                </a>
                <button
                  type="button"
                  onClick={() => void handleResumeDownload()}
                  disabled={isDownloadingResume || loading}
                  className="inline-flex items-center gap-2 rounded-full border border-teal-900/20 bg-white px-5 py-3 text-sm font-bold text-teal-950 transition hover:-translate-y-0.5 hover:border-teal-800/40 disabled:cursor-wait disabled:opacity-60"
                >
                  {isDownloadingResume ? "Preparing CV…" : "Download CV"}{" "}
                  <ArrowDownToLine size={16} />
                </button>
              </div>
              {resumeDownloadError && (
                <p role="alert" className="mt-3 text-sm text-rose-700">
                  {resumeDownloadError}
                </p>
              )}
            </>
          )}
          <div className="mt-9 grid max-w-xl grid-cols-3 border-t border-slate-900/10 pt-5">
            {loading
              ? ["Projects", "Skills", "Certificates"].map((label) => (
                  <div
                    key={label}
                    className="min-w-0 border-r border-slate-900/15 px-2 py-1 first:pl-0 last:border-r-0 last:pr-0 sm:px-3"
                  >
                    <span className="block h-7 w-10 animate-pulse rounded-md bg-slate-200" />
                    <span className="mt-2 block h-3 w-16 animate-pulse rounded-full bg-slate-200" />
                  </div>
                ))
              : [
                  { value: data.projects.length, label: "Projects" },
                  { value: data.skills.length, label: "Skills" },
                  { value: data.certificates.length, label: "Certificates" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="min-w-0 border-r border-slate-900/15 px-2 py-1 first:pl-0 last:border-r-0 last:pr-0 sm:px-3"
                  >
                    <p className="text-2xl font-black tracking-tight text-[#17272b]">
                      <CountUpNumber value={item.value} minimumDigits={2} />
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                      {item.label}
                    </p>
                  </div>
                ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onTryWorld}
          aria-label="Explore the 3D world"
          data-reveal
          className="group relative mx-auto block aspect-[1.12/1] w-full max-w-[620px] overflow-hidden rounded-[2rem] border border-teal-950/10 bg-[#dcebe2] text-left shadow-[0_24px_60px_rgba(23,59,58,.14)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
        >
          <HeroMascot />
          <span className="absolute inset-0 bg-gradient-to-t from-[#102d2c]/70 via-transparent to-transparent" />
          <span className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 rounded-2xl border border-white/25 bg-white/85 p-4 text-[#173b3a] shadow-lg backdrop-blur-md transition group-hover:translate-y-[-2px] sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700">
                Step inside
              </span>
              <span className="mt-1 block text-lg font-bold sm:text-xl">Explore my 3D world</span>
            </span>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#173b3a] text-white">
              <Move3D size={18} />
            </span>
          </span>
        </button>
      </section>
      <section
        id="classic-projects"
        className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-20 sm:px-8 lg:px-12"
        aria-busy={loading}
      >
        <p data-reveal className="text-[10px] font-bold tracking-[0.22em] text-teal-700">
          SELECTED WORK
        </p>
        <h2 data-reveal className="mb-8 mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          Things made with care.
        </h2>
        {loading ? (
          <ProjectGridSkeleton />
        ) : data.projects.length === 0 ? (
          <p className="rounded-2xl border border-slate-900/10 bg-white/70 p-6 text-sm text-slate-600">
            No projects are published yet. Add a project in Supabase and mark it as published to
            show it here.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-5 lg:gap-6">
            {data.projects.map((project, index) => (
              <div
                key={project.id}
                data-reveal
                style={
                  {
                    "--reveal-delay": `${Math.min(index * 90, 360)}ms`,
                  } as CSSProperties
                }
                className="w-full max-w-[360px] shrink-0"
              >
                <ClassicProjectCard project={project} index={index} />
              </div>
            ))}
          </div>
        )}
      </section>
      <AboutSection
        profile={profile}
        leetcodeStats={leetcodeStats}
        leetcodeLoading={leetcodeLoading}
        aboutText={aboutText}
        loading={loading}
        expanded={aboutExpanded}
        onExpandedChange={setAboutExpanded}
      />
      {(loading || data.certificates.length > 0) && (
        <section
          id="classic-certificates"
          className="mx-auto max-w-7xl scroll-mt-8 px-5 py-16 sm:px-8 lg:px-12"
          aria-busy={loading}
        >
          <p data-reveal className="text-[10px] font-bold tracking-[0.22em] text-teal-700">
            MILESTONES
          </p>
          <h2 data-reveal className="mb-7 mt-2 text-3xl font-black tracking-tight">
            Certificates
          </h2>
          {loading ? (
            <div data-reveal>
              <CertificateGridSkeleton />
            </div>
          ) : data.certificates.length === 0 ? (
            <p className="text-sm text-slate-600">Published certificates will appear here.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.certificates.map((certificate, index) => (
                <article
                  key={certificate.id}
                  data-reveal
                  style={
                    {
                      "--reveal-delay": `${Math.min(index * 90, 360)}ms`,
                    } as CSSProperties
                  }
                  className="rounded-2xl border border-slate-900/10 bg-white p-5 transition-shadow duration-300 hover:shadow-lg"
                >
                  {certificate.imageUrl && (
                    <div className="mb-4 grid aspect-[16/10] place-items-center overflow-hidden rounded-xl bg-[#f3f1eb]">
                      <img
                        src={certificate.imageUrl}
                        alt={`${certificate.title} certificate`}
                        loading="lazy"
                        className="size-full object-contain"
                      />
                    </div>
                  )}
                  <h3 className="font-bold">{certificate.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{certificate.issuer}</p>
                  {certificate.credentialId && (
                    <p className="mt-2 text-xs text-slate-500">
                      Credential ID:{" "}
                      <span className="font-mono font-semibold text-slate-700">
                        {certificate.credentialId}
                      </span>
                    </p>
                  )}
                  {certificate.credentialUrl && (
                    <a
                      className="mt-4 block break-all text-xs font-semibold leading-5 text-teal-800 underline underline-offset-2"
                      href={certificate.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      title={certificate.credentialUrl}
                    >
                      {certificate.credentialUrl}
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}
      {(loading || data.skills.length > 0) && (
        <section
          id="classic-skills"
          className="scroll-mt-8 border-y border-slate-900/5 bg-white/70"
          aria-busy={loading}
        >
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
            <p data-reveal className="text-[10px] font-bold tracking-[0.22em] text-teal-700">
              TOOLS & CRAFT
            </p>
            <h2 data-reveal className="mb-7 mt-2 text-3xl font-black tracking-tight">
              Skills
            </h2>
            {loading ? (
              <div data-reveal>
                <SkillGroupsSkeleton />
              </div>
            ) : data.skills.length === 0 ? (
              <p className="text-sm text-slate-600">Published skills will appear here.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ...data.skills
                    .reduce<Map<string, typeof data.skills>>((groups, skill) => {
                      const group = groups.get(skill.category) ?? [];
                      groups.set(skill.category, [...group, skill]);
                      return groups;
                    }, new Map())
                    .entries(),
                ].map(([category, skills], index) => (
                  <article
                    key={category}
                    data-reveal
                    style={
                      {
                        "--reveal-delay": `${Math.min(index * 90, 360)}ms`,
                      } as CSSProperties
                    }
                    className="rounded-2xl border border-slate-900/10 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-bold text-slate-900">{category}</h3>
                      <span className="text-xs font-medium text-slate-500">
                        <CountUpNumber value={skills.length} />{" "}
                        {skills.length === 1 ? "skill" : "skills"}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="rounded-full bg-[#edf5f1] px-3 py-1.5 text-sm font-semibold text-[#285d50]"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
      <footer id="classic-contact" className="scroll-mt-8" aria-busy={loading}>
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:px-12">
          <div data-reveal>
            <p className="text-[10px] font-bold tracking-[0.22em] text-teal-700">SAY HELLO</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Let&apos;s make something good.
            </h2>
            {loading ? (
              <div className="mt-3 max-w-lg">
                <ContactDetailsSkeleton />
              </div>
            ) : (
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
                {profile?.email ? (
                  <>
                    Or email me at{" "}
                    <a className="font-semibold text-teal-800" href={`mailto:${profile.email}`}>
                      {profile.email}
                    </a>
                    .
                  </>
                ) : (
                  "Send a note through the form and it will arrive in the portfolio inbox."
                )}
              </p>
            )}
            {!loading ? (
              <div className="mt-5 flex flex-wrap gap-4">
                {profile?.socialLinks.map((link) => (
                  <a
                    key={link.id}
                    className="text-sm font-semibold text-teal-800 hover:underline"
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                  </a>
                ))}
                {!profile?.socialLinks.some((link) => link.platform === "leetcode") && (
                  <a
                    className="text-sm font-semibold text-teal-800 hover:underline"
                    href={LEETCODE_PROFILE_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LeetCode
                  </a>
                )}
              </div>
            ) : null}
          </div>
          <form onSubmit={handleContactSubmit} data-reveal className="grid gap-3">
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              Name
              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                className="rounded-xl border border-slate-900/15 bg-white px-4 py-3 font-normal outline-none focus:border-teal-700"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              Email
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                className="rounded-xl border border-slate-900/15 bg-white px-4 py-3 font-normal outline-none focus:border-teal-700"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              Message
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={4}
                className="resize-y rounded-xl border border-slate-900/15 bg-white px-4 py-3 font-normal outline-none focus:border-teal-700"
              />
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={loading || !data.apiAvailable || contactState === "sending"}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-[#17272b] px-5 py-3 text-sm font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {contactState === "sending" ? "Sending…" : "Send a message"}
              </button>
              {contactState === "sent" && (
                <p role="status" className="text-sm text-teal-800">
                  Message sent. Thanks for reaching out.
                </p>
              )}
              {contactState === "error" && (
                <p role="alert" className="text-sm text-rose-700">
                  Could not send right now. Please try again later.
                </p>
              )}
              {!loading && !data.apiAvailable && (
                <p className="text-sm text-slate-500">Connect the API to enable messages.</p>
              )}
            </div>
          </form>
        </div>
        <div className="border-t border-slate-900/10 px-5 py-4 text-center text-xs text-slate-500">
          <button
            type="button"
            onClick={onTryWorld}
            className="inline-flex items-center gap-2 hover:text-teal-800"
          >
            Try the 3D world <Move3D size={14} />
          </button>
        </div>
      </footer>
      <ContactJourneyDialog
        open={journeyOpen}
        visitorName={journeyVisitorName}
        onClose={() => setJourneyOpen(false)}
      />
    </main>
  );
}
