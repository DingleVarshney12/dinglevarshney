"use client";

import { useState } from "react";
import { ArrowDownToLine, ArrowLeft, FileText } from "lucide-react";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";
import { useLeetcodeStats } from "@/hooks/use-leetcode-stats";
import { downloadResumePdf, generateResumePdf } from "@/features/resume/generate-resume-pdf";

export function ResumeDownloadPage() {
  const { data, loading } = usePublicPortfolio();
  const { stats, loading: leetcodeLoading } = useLeetcodeStats();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const name = data.profile?.name || "Dingle Varshney";

  async function download() {
    setIsGenerating(true);
    setError("");
    try {
      const bytes = await generateResumePdf(data, stats);
      downloadResumePdf(bytes, name);
    } catch {
      setError("PDF could not be created. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  const entryCount =
    data.resumeEntries.length +
    data.projects.length +
    data.skills.length +
    data.certificates.length;
  return (
    <main className="min-h-screen bg-[#f7f7f2] px-5 py-10 text-[#17272b] sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-800 hover:underline"
        >
          <ArrowLeft size={16} /> Back to portfolio
        </a>
        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-900/10 bg-white shadow-[0_24px_70px_-42px_rgba(23,39,43,.4)]">
          <div className="border-b border-slate-900/10 bg-[#f2f4ef] px-7 py-8 sm:px-10 sm:py-10">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#dcefe7] text-[#1b5148]">
              <FileText size={23} />
            </div>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[.2em] text-teal-800">
              Resume PDF
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{name}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              A clean, simple resume with my profile, projects, skills, certificates, LeetCode
              stats, education, and experience.
            </p>
          </div>
          <div className="grid gap-5 px-7 py-7 sm:grid-cols-[1fr_auto] sm:items-center sm:px-10">
            <div>
              <p className="font-semibold">Included content</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {loading ? "Loading your portfolio…" : `${entryCount} content items found`}
                {leetcodeLoading
                  ? " · Loading LeetCode stats…"
                  : stats
                    ? ` · ${stats.totalSolved} LeetCode problems solved`
                    : ""}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                This PDF includes the details currently available on my portfolio.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void download()}
              disabled={loading || isGenerating}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173b3a] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60"
            >
              <ArrowDownToLine size={17} />
              {isGenerating ? "Creating PDF…" : "Download PDF"}
            </button>
          </div>
          {error && (
            <p role="alert" className="px-7 pb-6 text-sm text-rose-700 sm:px-10">
              {error}
            </p>
          )}
        </div>
        <p className="mt-5 text-center text-xs text-slate-500">
          The button downloads a PDF file directly. It does not open the print dialog.
        </p>
      </div>
    </main>
  );
}
