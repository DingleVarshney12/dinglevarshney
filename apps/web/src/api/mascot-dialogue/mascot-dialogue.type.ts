export type { MascotDialogue } from "@/lib/types";
import type { MascotDialogue } from "@/lib/types";

export type MascotDialogueInput = Omit<MascotDialogue, "id" | "createdAt" | "updatedAt">;
export type UpdateMascotDialogueInput = Partial<MascotDialogueInput>;
