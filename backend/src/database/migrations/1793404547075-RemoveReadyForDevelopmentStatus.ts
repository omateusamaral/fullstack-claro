import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveReadyForDevelopmentStatus1793404547075
    implements MigrationInterface
{
    name = 'RemoveReadyForDevelopmentStatus1793404547075';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "tasks"
            SET "status" = 'pendente'
            WHERE "status" = 'pronta para desenvolvimento'
        `);
        await queryRunner.query(`
            ALTER TABLE "tasks"
            ALTER COLUMN "status" DROP DEFAULT
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."tasks_status_enum_new"
            AS ENUM('pendente', 'em progresso', 'concluído')
        `);
        await queryRunner.query(`
            ALTER TABLE "tasks"
            ALTER COLUMN "status"
            TYPE "public"."tasks_status_enum_new"
            USING "status"::text::"public"."tasks_status_enum_new"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."tasks_status_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."tasks_status_enum_new"
            RENAME TO "tasks_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "tasks"
            ALTER COLUMN "status" SET DEFAULT 'pendente'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tasks"
            ALTER COLUMN "status" DROP DEFAULT
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."tasks_status_enum_old"
            AS ENUM('pendente', 'em progresso', 'concluído', 'pronta para desenvolvimento')
        `);
        await queryRunner.query(`
            ALTER TABLE "tasks"
            ALTER COLUMN "status"
            TYPE "public"."tasks_status_enum_old"
            USING "status"::text::"public"."tasks_status_enum_old"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."tasks_status_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."tasks_status_enum_old"
            RENAME TO "tasks_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "tasks"
            ALTER COLUMN "status" SET DEFAULT 'pronta para desenvolvimento'
        `);
    }
}
