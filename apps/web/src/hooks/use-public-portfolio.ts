"use client";

import { useEffect, useState } from "react";
import { getPublicPortfolioData } from "@/api/portfolio/portfolio.api";
import type { PublicPortfolioData } from "@/api/portfolio/portfolio.type";

const emptyPortfolio: PublicPortfolioData = {
  profile: null,
  projects: [],
  certificates: [],
  skills: [],
  aboutChapters: [],
  mascotDialogues: [],
  resumeEntries: [],
  celebration: null,
  noticeBanner: null,
  apiAvailable: false,
  failedResources: [],
};

export function usePublicPortfolio() {
  const [portfolio, setPortfolio] = useState<PublicPortfolioData | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let mounted = true;
    getPublicPortfolioData()
      .then((data) => {
        if (mounted) setPortfolio(data);
      })
      .catch(() => {
        if (mounted) setPortfolio({ ...emptyPortfolio, failedResources: ["portfolio data"] });
      });
    return () => {
      mounted = false;
    };
  }, [attempt]);

  return {
    data: portfolio ?? emptyPortfolio,
    loading: portfolio === null,
    retry: () => {
      setPortfolio(null);
      setAttempt((current) => current + 1);
    },
  };
}
