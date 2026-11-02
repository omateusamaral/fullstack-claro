import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData1793404547073 implements MigrationInterface {
    name = 'SeedInitialData1793404547073';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "teams" ("id", "name", "colorHex", "description")
            VALUES
                ('00000000-0000-0000-0000-000000000001', 'Produto', '#2563EB', 'Time responsável pela evolução do produto'),
                ('00000000-0000-0000-0000-000000000002', 'Engenharia', '#16A34A', 'Time responsável pelo desenvolvimento e qualidade'),
                ('00000000-0000-0000-0000-000000000003', 'Design', '#9333EA', 'Time responsável pela experiência do usuário')
            ON CONFLICT ("id") DO NOTHING
        `);

        await queryRunner.query(`
            INSERT INTO "tasks" ("id", "title", "description", "status", "dueDate", "teamId")
            VALUES
                ('10000000-0000-0000-0000-000000000001', 'Definir roadmap do próximo ciclo', 'Priorizar as entregas do próximo ciclo do produto', 'concluído', '2026-12-01T12:00:00.000Z', '00000000-0000-0000-0000-000000000001'),
                ('10000000-0000-0000-0000-000000000002', 'Mapear feedbacks dos usuários', 'Consolidar os principais feedbacks recebidos', 'em progresso', '2026-12-10T12:00:00.000Z', '00000000-0000-0000-0000-000000000001'),
                ('10000000-0000-0000-0000-000000000003', 'Implementar autenticação', 'Adicionar autenticação segura à aplicação', 'pronta para desenvolvimento', '2026-12-20T12:00:00.000Z', '00000000-0000-0000-0000-000000000002'),
                ('10000000-0000-0000-0000-000000000004', 'Criar endpoint de tarefas', 'Disponibilizar operações de consulta e cadastro de tarefas', 'concluído', '2026-12-03T12:00:00.000Z', '00000000-0000-0000-0000-000000000002'),
                ('10000000-0000-0000-0000-000000000005', 'Adicionar validação de payloads', 'Validar os dados recebidos pela API', 'em progresso', '2026-11-15T12:00:00.000Z', '00000000-0000-0000-0000-000000000002'),
                ('10000000-0000-0000-0000-000000000006', 'Revisar fluxo de navegação', 'Avaliar e melhorar a navegação entre as telas', 'pronta para desenvolvimento', '2026-12-05T12:00:00.000Z', '00000000-0000-0000-0000-000000000003'),
                ('10000000-0000-0000-0000-000000000007', 'Criar protótipo da tela inicial', 'Preparar protótipo navegável da tela inicial', 'concluído', '2026-12-07T12:00:00.000Z', '00000000-0000-0000-0000-000000000003'),
                ('10000000-0000-0000-0000-000000000008', 'Definir tokens visuais', 'Documentar cores, tipografia e espaçamentos', 'em progresso', '2026-11-25T12:00:00.000Z', '00000000-0000-0000-0000-000000000003'),
                ('10000000-0000-0000-0000-000000000009', 'Configurar pipeline de CI', 'Automatizar validações para pull requests', 'pendente', '2026-12-15T12:00:00.000Z', '00000000-0000-0000-0000-000000000002'),
                ('10000000-0000-0000-0000-000000000010', 'Planejar teste de usabilidade', 'Organizar roteiro e participantes do teste', 'pendente', '2026-12-18T12:00:00.000Z', '00000000-0000-0000-0000-000000000003')
            ON CONFLICT ("id") DO NOTHING
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "tasks"
            WHERE "id" IN (
                '10000000-0000-0000-0000-000000000001',
                '10000000-0000-0000-0000-000000000002',
                '10000000-0000-0000-0000-000000000003',
                '10000000-0000-0000-0000-000000000004',
                '10000000-0000-0000-0000-000000000005',
                '10000000-0000-0000-0000-000000000006',
                '10000000-0000-0000-0000-000000000007',
                '10000000-0000-0000-0000-000000000008',
                '10000000-0000-0000-0000-000000000009',
                '10000000-0000-0000-0000-000000000010'
            )
        `);
        await queryRunner.query(`
            DELETE FROM "teams"
            WHERE "id" IN (
                '00000000-0000-0000-0000-000000000001',
                '00000000-0000-0000-0000-000000000002',
                '00000000-0000-0000-0000-000000000003'
            )
        `);
    }
}
