import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskTeams1793404547074 implements MigrationInterface {
    name = 'TaskTeams1793404547074';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "task_teams" (
                "taskId" uuid NOT NULL,
                "teamId" uuid NOT NULL,
                CONSTRAINT "PK_task_teams" PRIMARY KEY ("taskId", "teamId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "task_teams" ("taskId", "teamId")
            SELECT "id", "teamId" FROM "tasks"
        `);
        await queryRunner.query(`
            ALTER TABLE "task_teams"
            ADD CONSTRAINT "FK_task_teams_task"
            FOREIGN KEY ("taskId") REFERENCES "tasks"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "task_teams"
            ADD CONSTRAINT "FK_task_teams_team"
            FOREIGN KEY ("teamId") REFERENCES "teams"("id")
            ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "tasks" DROP CONSTRAINT "FK_12c5f5304c7d7c4deb27046671d"
        `);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "teamId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tasks" ADD "teamId" uuid`,
        );
        await queryRunner.query(`
            UPDATE "tasks" task
            SET "teamId" = relation."teamId"
            FROM (
                SELECT DISTINCT ON ("taskId") "taskId", "teamId"
                FROM "task_teams"
                ORDER BY "taskId", "teamId"
            ) relation
            WHERE task."id" = relation."taskId"
        `);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "teamId" SET NOT NULL`);
        await queryRunner.query(`
            ALTER TABLE "tasks"
            ADD CONSTRAINT "FK_12c5f5304c7d7c4deb27046671d"
            FOREIGN KEY ("teamId") REFERENCES "teams"("id")
            ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
        await queryRunner.query(`DROP TABLE "task_teams"`);
    }
}
