import { IsIn } from "class-validator";
import type { ContactMessageStatus } from "@dinglevarshney/shared";

export class UpdateContactMessageDto {
  @IsIn(["new", "read", "replied", "archived"])
  status!: ContactMessageStatus;
}
