"use client";

import { useRouter } from "next/navigation";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";
import { ClassicExperience } from "@/components/classic/classic-experience";

export default function Home() {
  const router = useRouter();
  const { data, loading, retry } = usePublicPortfolio();

  return (
    <ClassicExperience
      onBack={() => router.push("/world")}
      onTryWorld={() => router.push("/world")}
      data={data}
      loading={loading}
      onRetry={retry}
    />
  );
}
