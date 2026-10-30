import type { Metadata } from "next";
import { ResumeDownloadPage } from "@/components/resume/resume-download-page";

export const metadata: Metadata = {
  title: "Download Resume | Dingle Varshney",
  robots: { index: false, follow: false },
};

export default function ResumePage() {
  return <ResumeDownloadPage />;
}
