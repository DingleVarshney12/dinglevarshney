import { Module } from "@nestjs/common";
import { LeetcodeController } from "./leetcode.controller.js";
import { LeetcodeService } from "./services/leetcode.service.js";

@Module({ controllers: [LeetcodeController], providers: [LeetcodeService] })
export class LeetcodeModule {}
