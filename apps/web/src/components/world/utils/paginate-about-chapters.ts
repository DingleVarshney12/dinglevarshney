import type { AboutChapter } from "@/lib/types";

export type StoryPage = {
  chapterTitle: string;
  content: string;
  imageUrl?: string;
  imageOnly?: boolean;
  chapterNumber: number;
  continuation: boolean;
};

const WORDS_PER_PAGE = 65;

function splitParagraph(paragraph: string): string[] {
  const tokens =
    paragraph
      .trim()
      .match(
        /\*\*[\s\S]+?\*\*|__[\s\S]+?__|~~[\s\S]+?~~|\*[^*\n]+\*|_[^_\n]+_|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|\s+|\S+/g,
      ) ?? [];
  const chunks: string[] = [];
  let current = "";
  let wordCount = 0;

  for (const token of tokens) {
    const isWhitespace = /^\s+$/.test(token);
    const linkedText = token.match(/^\[([^\]]+)\]\(/)?.[1];
    const plainText = (linkedText ?? token)
      .replace(/^(\*\*|__|~~|`|\*|_)/, "")
      .replace(/(\*\*|__|~~|`|\*|_)$/, "");
    const tokenWordCount = isWhitespace ? 0 : (plainText.match(/\S+/g)?.length ?? 0);

    if (tokenWordCount > 0 && wordCount > 0 && wordCount + tokenWordCount > WORDS_PER_PAGE) {
      chunks.push(current.trimEnd());
      current = "";
      wordCount = 0;
    }

    current += token;
    wordCount += tokenWordCount;
  }

  if (current.trim()) chunks.push(current.trimEnd());
  return chunks;
}

function paginateContent(content: string): string[] {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const pages: string[] = [];
  let currentPage = "";

  for (const paragraph of paragraphs) {
    for (const chunk of splitParagraph(paragraph)) {
      const combined = currentPage ? `${currentPage}\n\n${chunk}` : chunk;
      if (combined.split(/\s+/).length > WORDS_PER_PAGE && currentPage) {
        pages.push(currentPage);
        currentPage = chunk;
      } else {
        currentPage = combined;
      }
    }
  }

  if (currentPage) pages.push(currentPage);
  return pages.length ? pages : [""];
}

export function paginateAboutChapters(
  chapters: Pick<AboutChapter, "title" | "content" | "imageUrl">[],
): StoryPage[] {
  return chapters.flatMap((chapter, chapterIndex) => {
    const contentPages = paginateContent(chapter.content);
    const storyPages = contentPages.map((content, pageIndex) => ({
      chapterTitle: chapter.title,
      content,
      chapterNumber: chapterIndex + 1,
      continuation: pageIndex > 0,
    }));

    if (!chapter.imageUrl) return storyPages;

    return [
      {
        chapterTitle: chapter.title,
        content: "",
        imageUrl: chapter.imageUrl,
        imageOnly: true,
        chapterNumber: chapterIndex + 1,
        continuation: false,
      },
      ...storyPages,
    ];
  });
}
