import { CreateTeamUseCase } from '../../../../src/teams/application/use-cases/create-team.use-case';
import { TeamEntity } from '../../../../src/teams/domain/entities/teams.entity';
import { TeamRepository } from '../../../../src/teams/domain/repositories/team.repository';
import { CreateTeamDto } from '../../../../src/teams/presentation/dtos/create-team.dto';

describe('CreateTeamUseCase', () => {
    let useCase: CreateTeamUseCase;
    let teamRepository: jest.Mocked<TeamRepository>;

    beforeEach(() => {
        teamRepository = {
            create: jest.fn(),
            update: jest.fn(),
            findOneById: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
        };
        useCase = new CreateTeamUseCase(teamRepository);
    });

    it('creates and returns a team', async () => {
        // Arrange
        const createTeamDto: CreateTeamDto = {
            name: 'Agile Team',
            colorHex: '#FF5733',
            description: 'A description of the team',
        };
        const createdTeam = Object.assign(new TeamEntity(), {
            id: 'team-id',
            ...createTeamDto,
        });
        teamRepository.create.mockResolvedValue(createdTeam);

        // Act
        const result = await useCase.execute(createTeamDto);

        // Assert
        expect(result).toBe(createdTeam);
        expect(teamRepository.create).toHaveBeenCalledTimes(1);
        expect(teamRepository.create).toHaveBeenCalledWith(
            expect.objectContaining(createTeamDto),
        );
        expect(teamRepository.create.mock.calls[0][0]).toBeInstanceOf(
            TeamEntity,
        );
    });

    it('propagates repository errors', async () => {
        // Arrange
        const createTeamDto: CreateTeamDto = {
            name: 'Agile Team',
            colorHex: '#FF5733',
        };
        const error = new Error('Unable to create team');
        teamRepository.create.mockRejectedValue(error);

        // Act
        const action = useCase.execute(createTeamDto);

        // Assert
        await expect(action).rejects.toBe(error);
    });
});
