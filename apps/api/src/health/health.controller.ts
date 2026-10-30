import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: "ok",
      service: "dinglevarshney-api",
      database: process.env.DATABASE_URL ? "configured" : "not-configured",
    };
  }
}
