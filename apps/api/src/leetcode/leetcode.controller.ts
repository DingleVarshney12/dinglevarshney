import { Controller, Get } from "@nestjs/common";
import { LeetcodeService } from "./services/leetcode.service.js";

@Controller("leetcode")
export class LeetcodeController {
  constructor(private readonly leetcodeService: LeetcodeService) {}

  @Get("stats")
  getStats() {
    return this.leetcodeService.getSolvedStats();
  }
}
