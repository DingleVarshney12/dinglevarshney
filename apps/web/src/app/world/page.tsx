import type { Metadata } from "next";
import { WorldPortfolioRoute } from "@/components/world/world-portfolio-route";

export const metadata: Metadata = {
  title: "Explore the 3D Portfolio | Dingle Varshney",
  description: "Explore My interactive 3D portfolio world.",
  robots: { index: false, follow: true },
};

export default function WorldPage() {
  return <WorldPortfolioRoute />;
}
