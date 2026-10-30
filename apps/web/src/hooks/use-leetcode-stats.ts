"use client";

import { useEffect, useState } from "react";
import { getLeetcodeSolvedStats } from "@/api/leetcode/leetcode.api";
import type { LeetcodeSolvedStats } from "@/api/leetcode/leetcode.type";

export function useLeetcodeStats() {
  const [stats, setStats] = useState<LeetcodeSolvedStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getLeetcodeSolvedStats()
      .then((result) => {
        if (active) setStats(result);
      })
      .catch(() => {
        if (active) setStats(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { stats, loading };
}
