import { useEffect, useRef, useState } from "react";

export function useCountUp(value: number, duration = 1100) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || value <= 0) return;

    let frameId = 0;
    let hasStarted = false;

    const animate = () => {
      if (hasStarted) return;
      hasStarted = true;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        frameId = window.requestAnimationFrame(() => setCount(value));
        return;
      }

      let startTime: number | undefined;
      const tick = (time: number) => {
        startTime ??= time;
        const progress = Math.min((time - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(value * easedProgress));

        if (progress < 1) frameId = window.requestAnimationFrame(tick);
      };

      frameId = window.requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      animate();
    } else {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animate();
            observer.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      observer.observe(element);

      return () => {
        observer.disconnect();
        window.cancelAnimationFrame(frameId);
      };
    }

    return () => window.cancelAnimationFrame(frameId);
  }, [duration, value]);

  return { count, elementRef };
}
