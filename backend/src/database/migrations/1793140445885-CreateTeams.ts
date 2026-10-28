import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTeams1793140445885 implements MigrationInterface {
    name = 'CreateTeams1793140445885';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(
            `CREATE TABLE "teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "colorHex" character varying(7) NOT NULL, "description" character varying(200), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "teams"`);
    }
}
