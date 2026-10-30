import { useState } from "react";
import type { StoryPage as StoryPageContent } from "../utils/paginate-about-chapters";
import { renderStoryFormatting } from "../utils/render-story-formatting";

type Props = {
  page: StoryPageContent;
  pageNumber: number;
  author: string;
  right?: boolean;
};

export function StorybookPage({ page, pageNumber, author, right = false }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  if (page.imageOnly && page.imageUrl) {
    return (
      <article
        className={`storybook-page storybook-page-image${right ? " storybook-page-right" : ""}`}
        aria-label={`Page ${pageNumber}: illustration for ${page.chapterTitle}`}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#82704f]">
          CHAPTER {String(page.chapterNumber).padStart(2, "0")} · ILLUSTRATION
        </p>
        <figure className="my-3 grid min-h-[240px] flex-1 place-items-center overflow-hidden rounded-sm border border-[#c9b991] bg-[#ece6d5] p-2 sm:min-h-[280px]">
          {imageFailed ? (
            <figcaption className="px-3 py-4 text-center text-xs text-[#82704f]">
              Illustration could not load. Use a direct, public image URL.
            </figcaption>
          ) : (
            <img
              src={page.imageUrl}
              alt={`Illustration for ${page.chapterTitle}`}
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain"
              onError={() => setImageFailed(true)}
            />
          )}
        </figure>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2 text-[10px] text-[#82704f]">
          <span className="truncate">{author}</span>
          <span>{pageNumber}</span>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`storybook-page${right ? " storybook-page-right" : ""}`}
      aria-label={`Page ${pageNumber}: ${page.chapterTitle}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#82704f]">
        CHAPTER {String(page.chapterNumber).padStart(2, "0")}
        {page.continuation ? " · CONTINUED" : ""}
      </p>
      <h2 className="mt-4 font-serif text-2xl leading-tight text-[#332b20] sm:mt-5 sm:text-3xl">
        {page.chapterTitle}
      </h2>
      <div className="my-4 h-px w-12 shrink-0 bg-[#c7a96c]" />
      <div className="storybook-page-content font-serif text-sm leading-6 text-[#51483b] sm:text-base sm:leading-7">
        {renderStoryFormatting(page.content)}
      </div>
      <div className="mt-auto flex items-end justify-between gap-2 pt-4 text-[10px] text-[#82704f]">
        <span className="truncate">{author}</span>
        <span>{pageNumber}</span>
      </div>
    </article>
  );
}
