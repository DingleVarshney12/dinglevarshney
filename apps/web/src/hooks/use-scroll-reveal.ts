import { useEffect, type RefObject } from "react";

export function useScrollReveal(rootRef: RefObject<HTMLElement | null>, refreshKey: unknown) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.classList.add("portfolio-reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-revealed", "true");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
      if (element.dataset.revealed !== "true") observer.observe(element);
    });

    return () => observer.disconnect();
  }, [rootRef, refreshKey]);
}
