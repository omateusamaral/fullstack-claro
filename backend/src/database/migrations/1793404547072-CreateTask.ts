import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTask1793404547072 implements MigrationInterface {
    name = 'CreateTask1793404547072';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."tasks_status_enum" AS ENUM('pendente', 'em progresso', 'concluído', 'pronta para desenvolvimento')`,
        );
        await queryRunner.query(
            `CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" character varying(200), "status" "public"."tasks_status_enum" DEFAULT 'pronta para desenvolvimento', "dueDate" TIMESTAMP, "teamId" uuid NOT NULL, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "tasks" ADD CONSTRAINT "FK_12c5f5304c7d7c4deb27046671d" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tasks" DROP CONSTRAINT "FK_12c5f5304c7d7c4deb27046671d"`,
        );
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
    }
}
