import { Controller, Get } from "@nestjs/common";
import { MascotDialoguesService } from "./services/mascot-dialogues.service.js";

@Controller("mascot-dialogues")
export class MascotDialoguesController {
  constructor(private readonly mascotDialoguesService: MascotDialoguesService) {}
  @Get() findPublished() {
    return this.mascotDialoguesService.findPublished();
  }
}
