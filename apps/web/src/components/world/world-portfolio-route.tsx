"use client";

import { useRouter } from "next/navigation";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";
import { WorldExperience } from "./world-experience";

export function WorldPortfolioRoute() {
  const router = useRouter();
  const { data, retry } = usePublicPortfolio();

  return <WorldExperience onBack={() => router.push("/")} data={data} onRetry={retry} />;
}
