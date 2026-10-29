import { FindAllTeamsUseCase } from '../../../../src/teams/application/use-cases/find-all-teams.use-case';
import { TeamEntity } from '../../../../src/teams/domain/entities/teams.entity';
import { TeamRepository } from '../../../../src/teams/domain/repositories/team.repository';
import { FindAllTeamsDto } from '../../../../src/teams/presentation/dtos/find-all-teams.dto';

describe('FindAllTeamsUseCase', () => {
    let useCase: FindAllTeamsUseCase;
    let teamRepository: jest.Mocked<TeamRepository>;

    beforeEach(() => {
        teamRepository = {
            create: jest.fn(),
            update: jest.fn(),
            findOneById: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
        };
        useCase = new FindAllTeamsUseCase(teamRepository);
    });

    it('returns the paginated teams result', async () => {
        // Arrange
        const query: FindAllTeamsDto = { limit: 10, offset: 0, search: 'Agile' };
        const result = {
            teams: [Object.assign(new TeamEntity(), { id: 'team-id' })],
            limit: 10,
            offset: 0,
            total: 1,
        };
        teamRepository.findAll.mockResolvedValue(result);

        // Act
        const response = await useCase.execute(query);

        // Assert
        expect(response).toBe(result);
        expect(teamRepository.findAll).toHaveBeenCalledWith(query);
    });

    it('propagates repository errors', async () => {
        // Arrange
        const query: FindAllTeamsDto = { limit: 10, offset: 0 };
        const error = new Error('Unable to retrieve teams');
        teamRepository.findAll.mockRejectedValue(error);

        // Act
        const action = useCase.execute(query);

        // Assert
        await expect(action).rejects.toBe(error);
    });
});
