import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData1793404547073 implements MigrationInterface {
    name = 'SeedInitialData1793404547073';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "teams" ("id", "name", "colorHex", "description")
            VALUES
                ('55e4ce97-f966-48e3-9312-1b0aaa763c7c', 'Produto', '#2563EB', 'Time responsável pela evolução do produto'),
                ('8a398742-215e-4206-863f-3dc7fe59aeee', 'Engenharia', '#16A34A', 'Time responsável pelo desenvolvimento e qualidade'),
                ('058efad3-01e3-4a2d-adb2-de97db2e2946', 'Design', '#9333EA', 'Time responsável pela experiência do usuário')
            ON CONFLICT ("id") DO NOTHING
        `);

        await queryRunner.query(`
            INSERT INTO "tasks" ("id", "title", "description", "status", "dueDate", "teamId")
            VALUES
                ('4e0a642b-6f7c-4e4f-be8f-6ed9e9fa0c4e', 'Definir roadmap do próximo ciclo', 'Priorizar as entregas do próximo ciclo do produto', 'concluído', '2026-12-01T12:00:00.000Z', '55e4ce97-f966-48e3-9312-1b0aaa763c7c'),
                ('0ae04960-1d66-47a1-b04b-61e38483deca', 'Mapear feedbacks dos usuários', 'Consolidar os principais feedbacks recebidos', 'em progresso', '2026-12-10T12:00:00.000Z', '55e4ce97-f966-48e3-9312-1b0aaa763c7c'),
                ('8342f02c-f208-406a-bed5-66564abe624f', 'Implementar autenticação', 'Adicionar autenticação segura à aplicação', 'pronta para desenvolvimento', '2026-12-20T12:00:00.000Z', '8a398742-215e-4206-863f-3dc7fe59aeee'),
                ('b1f5a8c2-7d34-4e91-9a06-2c8f4b7d1e53', 'Criar endpoint de tarefas', 'Disponibilizar operações de consulta e cadastro de tarefas', 'concluído', '2026-12-03T12:00:00.000Z', '8a398742-215e-4206-863f-3dc7fe59aeee'),
                ('c7e2d9f4-3a81-4b65-8c20-5f6e1d9a742b', 'Adicionar validação de payloads', 'Validar os dados recebidos pela API', 'em progresso', '2026-11-15T12:00:00.000Z', '8a398742-215e-4206-863f-3dc7fe59aeee'),
                ('d4a9e6b3-2c70-4f18-a5d2-8b3e6c1f9074', 'Revisar fluxo de navegação', 'Avaliar e melhorar a navegação entre as telas', 'pronta para desenvolvimento', '2026-12-05T12:00:00.000Z', '058efad3-01e3-4a2d-adb2-de97db2e2946'),
                ('e8c1f7a5-6b29-4d03-b8e4-9f2a5c7d1b60', 'Criar protótipo da tela inicial', 'Preparar protótipo navegável da tela inicial', 'concluído', '2026-12-07T12:00:00.000Z', '058efad3-01e3-4a2d-adb2-de97db2e2946'),
                ('f2b6d8c4-9e15-47a0-8d3f-6c1a5b7e2948', 'Definir tokens visuais', 'Documentar cores, tipografia e espaçamentos', 'em progresso', '2026-11-25T12:00:00.000Z', '058efad3-01e3-4a2d-adb2-de97db2e2946'),
                ('a6d3f9b1-5c82-4e70-91a4-7b2c8d6f0359', 'Configurar pipeline de CI', 'Automatizar validações para pull requests', 'pendente', '2026-12-15T12:00:00.000Z', '8a398742-215e-4206-863f-3dc7fe59aeee'),
                ('b8e4c2f6-1a73-49d5-86b0-3c7f9e2d514a', 'Planejar teste de usabilidade', 'Organizar roteiro e participantes do teste', 'pendente', '2026-12-18T12:00:00.000Z', '058efad3-01e3-4a2d-adb2-de97db2e2946')
            ON CONFLICT ("id") DO NOTHING
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "tasks"
            WHERE "id" IN (
                '4e0a642b-6f7c-4e4f-be8f-6ed9e9fa0c4e',
                '0ae04960-1d66-47a1-b04b-61e38483deca',
                '8342f02c-f208-406a-bed5-66564abe624f',
                'b1f5a8c2-7d34-4e91-9a06-2c8f4b7d1e53',
                'c7e2d9f4-3a81-4b65-8c20-5f6e1d9a742b',
                'd4a9e6b3-2c70-4f18-a5d2-8b3e6c1f9074',
                'e8c1f7a5-6b29-4d03-b8e4-9f2a5c7d1b60',
                'f2b6d8c4-9e15-47a0-8d3f-6c1a5b7e2948',
                'a6d3f9b1-5c82-4e70-91a4-7b2c8d6f0359',
                'b8e4c2f6-1a73-49d5-86b0-3c7f9e2d514a'
            )
        `);
        await queryRunner.query(`
            DELETE FROM "teams"
            WHERE "id" IN (
                '55e4ce97-f966-48e3-9312-1b0aaa763c7c',
                '8a398742-215e-4206-863f-3dc7fe59aeee',
                '058efad3-01e3-4a2d-adb2-de97db2e2946'
            )
        `);
    }
}
