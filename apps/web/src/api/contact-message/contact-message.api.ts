import { apiClient } from "../api-client";
import type { ContactMessage, CreateContactMessageInput } from "./contact-message.type";
import type { ContactMessageStatus } from "./contact-message.type";

export function createContactMessage(input: CreateContactMessageInput): Promise<ContactMessage> {
  return apiClient.post<CreateContactMessageInput, ContactMessage>("/contact-messages", input);
}

export function getAdminContactMessages(accessToken: string): Promise<ContactMessage[]> {
  return apiClient.get<ContactMessage[]>("/admin/contact-messages", accessToken);
}

export function updateContactMessageStatus(
  id: string,
  status: ContactMessageStatus,
  accessToken: string,
): Promise<ContactMessage> {
  return apiClient.patch<{ status: ContactMessageStatus }, ContactMessage>(
    `/admin/contact-messages/${id}`,
    { status },
    accessToken,
  );
}
