"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpenText,
  FolderKanban,
  Award,
  MessagesSquare,
  LogOut,
  UserRound,
  Sparkles,
  Inbox,
  FileText,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AboutChaptersManager } from "./about-chapters-manager";
import { ProjectsManager } from "./projects-manager";
import { ProfileManager } from "./profile-manager";
import { SkillsManager } from "./skills-manager";
import { CertificatesManager } from "./certificates-manager";
import { MascotDialoguesManager } from "./mascot-dialogues-manager";
import { ContactInbox } from "./contact-inbox";
import { ResumeContentManager } from "./resume-content-manager";
import { SoundToggle } from "../ui/sound-toggle";

const adminSections = [
  {
    key: "resume",
    title: "Resume content",
    description: "Manage education, experience, activities, and your downloadable resume.",
    icon: FileText,
    status: "Ready",
  },
  {
    key: "profile",
    title: "Profile & social links",
    description: "Update your introduction, contact details, and social links.",
    icon: UserRound,
    status: "Ready",
  },
  {
    key: "about",
    title: "About chapters",
    description: "Write the chapters that become pages in your About book.",
    icon: BookOpenText,
    status: "Ready",
  },
  {
    key: "projects",
    title: "Projects",
    description: "Add project details, technologies, images, and links.",
    icon: FolderKanban,
    status: "Ready",
  },
  {
    key: "skills",
    title: "Skills",
    description: "Add skills and choose which ones appear on your portfolio.",
    icon: Sparkles,
    status: "Ready",
  },
  {
    key: "certificates",
    title: "Certificates",
    description: "Add certificates when you have them ready.",
    icon: Award,
    status: "Ready",
  },
  {
    key: "inbox",
    title: "Contact inbox",
    description: "Read visitor messages and reply from your email app.",
    icon: Inbox,
    status: "Ready",
  },
  {
    key: "mascot",
    title: "Mascot conversations",
    description: "Choose the questions and answers visitors can explore.",
    icon: MessagesSquare,
    status: "Ready",
  },
] as const;

export function AdminDashboard({ email }: { email: string }) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>("profile");

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase?.auth.signOut();
    router.refresh();
  }

  return (
    <main className="min-h-[75vh] bg-[#f4f0e7] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2a6355]">
              Dingle Varshney · private workspace
            </p>
            <h1 className="mt-2 font-serif text-4xl text-[#263432]">Portfolio admin</h1>
            <p className="mt-2 text-sm text-[#68736c]">Signed in as {email}</p>
          </div>
          <div className="flex items-center gap-2">
            <SoundToggle />
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full border border-[#d7d5ca] bg-white px-4 py-2.5 text-sm font-semibold text-[#34413d] transition hover:bg-[#f8f6ef]"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </header>

        <section
          aria-label="Portfolio content sections"
          className="mt-10 grid gap-4 sm:grid-cols-2"
        >
          {adminSections.map(({ key, title, description, icon: Icon, status }) => {
            const isReady = [
              "profile",
              "about",
              "projects",
              "skills",
              "certificates",
              "mascot",
              "inbox",
              "resume",
            ].includes(key);
            const isActive = activeSection === key;
            const cardClass = `w-full rounded-2xl border p-6 text-left shadow-sm transition ${isActive ? "border-[#96b9a8] bg-[#f8fcf8] ring-2 ring-[#2a6355]/10" : "border-[#ded6c7] bg-[#fffdf8]"} ${isReady ? "cursor-pointer hover:border-[#96b9a8]" : "cursor-not-allowed opacity-70"}`;

            return (
              <button
                key={key}
                type="button"
                disabled={!isReady}
                onClick={() => setActiveSection(key)}
                className={cardClass}
                aria-pressed={isActive}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e7f0e9] text-[#2a6355]">
                    <Icon size={21} />
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${isReady ? "bg-emerald-100 text-emerald-800" : "bg-[#f2ecdc] text-[#756744]"}`}
                  >
                    {status}
                  </span>
                </div>
                <h2 className="mt-5 font-serif text-2xl text-[#263432]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#68736c]">{description}</p>
              </button>
            );
          })}
        </section>

        {activeSection === "profile" && <ProfileManager />}
        {activeSection === "about" && <AboutChaptersManager />}
        {activeSection === "projects" && <ProjectsManager />}
        {activeSection === "skills" && <SkillsManager />}
        {activeSection === "certificates" && <CertificatesManager />}
        {activeSection === "mascot" && <MascotDialoguesManager />}
        {activeSection === "inbox" && <ContactInbox />}
        {activeSection === "resume" && <ResumeContentManager />}
      </div>
    </main>
  );
}
