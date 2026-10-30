export type { ContactMessage } from "@/lib/types";
export type { ContactMessageStatus } from "@dinglevarshney/shared";

export interface CreateContactMessageInput {
  name: string;
  email: string;
  message: string;
}
