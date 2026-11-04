import { Body, Controller, Get, Module, Put, UseGuards } from "@nestjs/common";
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SupabaseAdminGuard } from "../common/guards/supabase-admin.guard.js";
import { NoticeBannerEntity } from "./notice-banner.entity.js";
import { SaveNoticeBannerDto } from "./notice-banner.dto.js";

@Controller()
class NoticeBannerController {
  constructor(
    @InjectRepository(NoticeBannerEntity) private readonly repo: Repository<NoticeBannerEntity>,
  ) {}
  @Get("notice-banner") getPublic() {
    return this.repo.findOneBy({ id: "main", isEnabled: true }).then((item) => item ?? null);
  }
  @Get("admin/notice-banner") @UseGuards(SupabaseAdminGuard) getAdmin() {
    return this.repo.findOneBy({ id: "main" });
  }
  @Put("admin/notice-banner") @UseGuards(SupabaseAdminGuard) save(
    @Body() input: SaveNoticeBannerDto,
  ) {
    return this.repo.save({ id: "main", ...input });
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([NoticeBannerEntity])],
  controllers: [NoticeBannerController],
  providers: [SupabaseAdminGuard],
})
export class NoticeBannerModule {}
