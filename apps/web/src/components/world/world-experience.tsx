"use client";

import { PortfolioWorld } from "./portfolio-world";
import type { PublicPortfolioData } from "@/api/portfolio/portfolio.type";
import { PortfolioLoadNotice } from "../ui/portfolio-load-notice";
export function WorldExperience({
  onBack,
  data,
  onRetry,
}: {
  onBack: () => void;
  data: PublicPortfolioData;
  onRetry: () => void;
}) {
  return (
    <main className="fixed inset-0 z-50 h-screen h-[100dvh] w-screen overflow-hidden bg-[#dfd2bb] text-[#17272b]">
      <PortfolioLoadNotice
        failedResources={data.failedResources}
        onRetry={onRetry}
        className="absolute left-4 right-4 top-4 z-[100] mx-auto max-w-xl"
      />
      <section className="h-full w-full">
        <PortfolioWorld onLeave={onBack} data={data} />
      </section>
    </main>
  );
}
