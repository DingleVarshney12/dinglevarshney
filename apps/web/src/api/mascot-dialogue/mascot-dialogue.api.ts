import { apiClient } from "../api-client";
import type {
  MascotDialogue,
  MascotDialogueInput,
  UpdateMascotDialogueInput,
} from "./mascot-dialogue.type";

export function getMascotDialogues(): Promise<MascotDialogue[]> {
  return apiClient.get<MascotDialogue[]>("/mascot-dialogues");
}

export function getAdminMascotDialogues(accessToken: string): Promise<MascotDialogue[]> {
  return apiClient.get<MascotDialogue[]>("/admin/mascot-dialogues", accessToken);
}

export function createMascotDialogue(
  input: MascotDialogueInput,
  accessToken: string,
): Promise<MascotDialogue> {
  return apiClient.post<MascotDialogueInput, MascotDialogue>(
    "/admin/mascot-dialogues",
    input,
    accessToken,
  );
}

export function updateMascotDialogue(
  id: string,
  input: UpdateMascotDialogueInput,
  accessToken: string,
): Promise<MascotDialogue> {
  return apiClient.patch<UpdateMascotDialogueInput, MascotDialogue>(
    `/admin/mascot-dialogues/${id}`,
    input,
    accessToken,
  );
}

export function deleteMascotDialogue(id: string, accessToken: string): Promise<void> {
  return apiClient.delete<void>(`/admin/mascot-dialogues/${id}`, accessToken);
}
