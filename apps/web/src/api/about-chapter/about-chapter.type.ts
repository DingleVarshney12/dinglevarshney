export type { AboutChapter } from "@/lib/types";

export type AboutChapterInput = Pick<
  import("@/lib/types").AboutChapter,
  "title" | "content" | "year" | "imageUrl" | "isPublished" | "sortOrder"
>;

export type UpdateAboutChapterInput = Partial<AboutChapterInput>;
