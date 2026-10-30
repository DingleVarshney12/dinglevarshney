import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
      autoLoadEntities: true,
      synchronize: false,
      migrationsRun: false,
      migrationsTableName: "typeorm_migrations",
      migrations: ["dist/database/migrations/*.js"],
      retryAttempts: 1,
    }),
  ],
})
export class DatabaseModule {}
