"use client";

import { ArrowDownRight, ArrowUpRight, MapPin, Quote, Sparkles } from "lucide-react";
import type { PublicPortfolioData } from "@/api/portfolio/portfolio.type";
import type { LeetcodeSolvedStats } from "@/api/leetcode/leetcode.type";
import { renderStoryFormatting } from "@/components/world/utils/render-story-formatting";
import { AboutSectionSkeleton } from "./portfolio-loading";
import { CountUpNumber } from "../ui/count-up-number";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function AboutSection({
  profile,
  leetcodeStats,
  leetcodeLoading,
  aboutText,
  loading,
  expanded,
  onExpandedChange,
}: {
  profile: PublicPortfolioData["profile"];
  leetcodeStats: LeetcodeSolvedStats | null;
  leetcodeLoading: boolean;
  aboutText: string;
  loading: boolean;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}) {
  return (
    <section
      id="classic-about"
      aria-busy={loading}
      className="scroll-mt-8 overflow-x-clip border-y border-[#183d38]/10 bg-white/70"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div data-reveal className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-700">
              A LITTLE ABOUT ME
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#17272b] sm:text-4xl">
              Behind the builds.
            </h2>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-[#244f45]/15 bg-white/70 px-3 py-2 text-[10px] font-bold tracking-[0.14em] text-[#58736a] sm:inline-flex">
            <Sparkles size={13} aria-hidden="true" /> A PERSONAL INTRODUCTION
          </span>
        </div>

        <div className="grid items-start gap-5 md:grid-cols-[0.76fr_1.24fr] lg:gap-7">
          <aside
            data-reveal
            className="about-profile-card relative flex flex-col gap-7 overflow-hidden rounded-[1.7rem] bg-[#173b3a] p-6 text-white shadow-[0_24px_60px_rgba(23,59,58,.16)] sm:p-8 md:sticky md:top-24 md:self-start"
          >
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 size-64 rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_65%,rgba(112,204,171,.32),rgba(112,204,171,0)_68%)]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-16 size-64 rounded-full border border-white/10"
            />
            <div className="relative z-10 flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a8e1cb]">
                THE PERSON, NOT JUST THE CODE
              </span>
              <Quote size={20} className="shrink-0 text-[#a8e1cb]/80" aria-hidden="true" />
            </div>

            <div className="relative z-10 my-8 flex items-center gap-4 sm:gap-5">
              {leetcodeStats?.avatarUrl || profile?.avatarUrl ? (
                <img
                  src={leetcodeStats?.avatarUrl ?? profile?.avatarUrl ?? undefined}
                  alt={`${profile?.name ?? "Dingle Varshney"} portrait`}
                  referrerPolicy="no-referrer"
                  className="size-20 shrink-0 rounded-2xl border border-white/20 object-cover shadow-lg sm:size-24"
                />
              ) : (
                <div className="grid size-20 shrink-0 place-items-center rounded-2xl border border-white/20 bg-[#d9eee3] text-3xl font-black tracking-tight text-[#173b3a] shadow-lg sm:size-24 sm:text-4xl">
                  {getInitials(profile?.name ?? "Dingle Varshney")}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                  {profile?.name ?? "Dingle Varshney"}
                </h3>
                {profile?.location && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#c5d9d0]">
                    <MapPin size={13} aria-hidden="true" />
                    {profile.location}
                  </p>
                )}
              </div>
            </div>

            <div className="relative z-10 border-t border-white/15 pt-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a8e1cb]">
                    LeetCode Stats
                  </p>
                  {leetcodeStats && (
                    <p className="mt-1 text-sm font-semibold text-white">
                      <CountUpNumber value={leetcodeStats.totalSolved} />{" "}
                      <span className="font-normal text-white/65">problems solved</span>
                    </p>
                  )}
                </div>
                {leetcodeStats && (
                  <a
                    href={leetcodeStats.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open LeetCode profile"
                    title="Open LeetCode profile"
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-[#a8e1cb] transition hover:bg-white/10"
                  >
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                )}
              </div>
              {leetcodeLoading ? (
                <div className="grid grid-cols-3 gap-2" aria-label="Loading LeetCode counts">
                  {["easy", "medium", "hard"].map((level) => (
                    <div
                      key={level}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-3"
                    >
                      <span className="block h-5 w-8 animate-pulse rounded bg-white/15" />
                      <span className="mt-2 block h-3 w-10 animate-pulse rounded bg-white/10" />
                    </div>
                  ))}
                </div>
              ) : leetcodeStats ? (
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-emerald-200/15 bg-emerald-300/[0.08] px-2.5 py-3 sm:px-3">
                    <p className="text-lg font-black leading-none text-emerald-200 sm:text-xl">
                      <CountUpNumber value={leetcodeStats.easySolved} />
                    </p>
                    <p className="mt-1.5 text-[10px] font-semibold text-emerald-100/75 sm:text-xs">
                      Easy
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-200/15 bg-amber-300/[0.08] px-2.5 py-3 sm:px-3">
                    <p className="text-lg font-black leading-none text-amber-200 sm:text-xl">
                      <CountUpNumber value={leetcodeStats.mediumSolved} />
                    </p>
                    <p className="mt-1.5 text-[10px] font-semibold text-amber-100/75 sm:text-xs">
                      Medium
                    </p>
                  </div>
                  <div className="rounded-xl border border-rose-200/15 bg-rose-300/[0.08] px-2.5 py-3 sm:px-3">
                    <p className="text-lg font-black leading-none text-rose-200 sm:text-xl">
                      <CountUpNumber value={leetcodeStats.hardSolved} />
                    </p>
                    <p className="mt-1.5 text-[10px] font-semibold text-rose-100/75 sm:text-xs">
                      Hard
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-white/60">
                  LeetCode counts are temporarily unavailable.
                </p>
              )}
            </div>
          </aside>

          <article
            data-reveal
            className="relative rounded-[1.7rem] border border-[#173b3a]/10 bg-white p-6 shadow-[0_18px_50px_rgba(23,59,58,.06)] sm:p-8 lg:p-10"
          >
            {loading ? (
              <AboutSectionSkeleton />
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-900/8 pb-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700">
                      MY STORY SO FAR
                    </p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-[#17272b] sm:text-3xl">
                      Nice to meet you.
                    </h3>
                  </div>
                  <span
                    aria-hidden="true"
                    className="grid size-11 place-items-center rounded-2xl bg-[#e8f3ec] text-[#32715f]"
                  >
                    <ArrowDownRight size={20} />
                  </span>
                </div>
                <div
                  className={`about-rich-text mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-[15px] sm:leading-8 ${expanded ? "" : "about-story-clamp"}`}
                >
                  {renderStoryFormatting(aboutText)}
                </div>
                {aboutText.length > 280 && (
                  <button
                    type="button"
                    onClick={() => onExpandedChange(!expanded)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-teal-900/15 bg-[#f3f8f3] px-4 py-2.5 text-xs font-bold text-teal-900 transition hover:border-teal-800/30 hover:bg-[#e6f1e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                    aria-expanded={expanded}
                  >
                    {expanded ? "Show less" : "Read my full story"}
                    <ArrowDownRight
                      size={14}
                      className={expanded ? "rotate-180" : ""}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
