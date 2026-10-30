"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";

type Props = {
  images: string[];
  projectTitle: string;
};

export function ProjectImageGallery({ images, projectTitle }: Props) {
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const galleryImages = images.map((image) => image.trim()).filter(Boolean);
  const imageCount = galleryImages.length;

  useEffect(() => {
    setImageFailed(false);
  }, [activeImage]);

  useEffect(() => {
    if (activeImage === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveImage(null);
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveImage((index) => (index === null ? null : (index + imageCount - 1) % imageCount));
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveImage((index) => (index === null ? null : (index + 1) % imageCount));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeImage, imageCount]);

  function showPrevious() {
    setActiveImage((index) => (index === null ? null : (index + imageCount - 1) % imageCount));
  }

  function showNext() {
    setActiveImage((index) => (index === null ? null : (index + 1) % imageCount));
  }

  if (imageCount === 0) return null;

  return (
    <>
      <button
        type="button"
        data-sound="interact"
        onClick={() => setActiveImage(0)}
        aria-label={`View ${imageCount} ${imageCount === 1 ? "image" : "images"} for ${projectTitle}`}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#d8cfbb] bg-[#f8f6ef] px-2.5 py-1.5 text-xs font-semibold text-[#2a6355] transition hover:border-[#96b9a8] hover:bg-[#e7f0e9]"
      >
        <Images size={14} />
        {imageCount === 1 ? "View image" : `View images (${imageCount})`}
      </button>

      {activeImage !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${projectTitle} image gallery`}
            className="fixed inset-0 z-[100] grid place-items-center bg-[#101715]/95 p-4 sm:p-8"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              if (event.target === event.currentTarget) setActiveImage(null);
            }}
          >
            <button
              type="button"
              data-sound="exit"
              onClick={() => setActiveImage(null)}
              aria-label="Close image gallery"
              className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-white/10 p-2.5 text-white transition hover:bg-white/20 sm:right-7 sm:top-7"
            >
              <X size={21} />
            </button>

            {imageCount > 1 && (
              <button
                type="button"
                data-sound="page"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                aria-label="Previous image"
                className="absolute left-3 z-10 rounded-full border border-white/20 bg-white/10 p-2.5 text-white transition hover:bg-white/20 sm:left-8"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <figure
              className="flex h-full max-h-[82vh] w-full max-w-6xl flex-col items-center justify-center gap-3"
              onClick={(event) => event.stopPropagation()}
            >
              {imageFailed ? (
                <div className="grid min-h-48 w-full max-w-3xl place-items-center rounded-lg border border-white/15 bg-white/5 px-6 text-center text-sm text-white/75">
                  This image could not be loaded. Try the next one.
                </div>
              ) : (
                <img
                  src={galleryImages[activeImage]}
                  alt={`${projectTitle} image ${activeImage + 1} of ${imageCount}`}
                  referrerPolicy="no-referrer"
                  onError={() => setImageFailed(true)}
                  className="h-auto min-h-0 max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                />
              )}
              <figcaption className="shrink-0 text-sm font-medium text-white/80">
                {projectTitle} - image {activeImage + 1} of {imageCount}
              </figcaption>
            </figure>

            {imageCount > 1 && (
              <button
                type="button"
                data-sound="page"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                aria-label="Next image"
                className="absolute right-3 z-10 rounded-full border border-white/20 bg-white/10 p-2.5 text-white transition hover:bg-white/20 sm:right-8"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
