"use client";

import { useEffect } from "react";

export function useHideNativeScrollbar() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("portfolio-hide-native-scrollbar");

    return () => root.classList.remove("portfolio-hide-native-scrollbar");
  }, []);
}
