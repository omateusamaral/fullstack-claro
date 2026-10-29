import { FindOneTeamUseCase } from '../../../../src/teams/application/use-cases/find-one-team.use-case';
import { UpdateTeamUseCase } from '../../../../src/teams/application/use-cases/update-team.use-case';
import { TeamEntity } from '../../../../src/teams/domain/entities/teams.entity';
import { TeamRepository } from '../../../../src/teams/domain/repositories/team.repository';
import { UpdateTeamDto } from '../../../../src/teams/presentation/dtos/update-team.dto';

describe('UpdateTeamUseCase', () => {
    let useCase: UpdateTeamUseCase;
    let teamRepository: jest.Mocked<TeamRepository>;
    let findOneTeamUseCase: FindOneTeamUseCase;
    let findOneByIdMock: jest.SpiedFunction<FindOneTeamUseCase['findOneById']>;

    beforeEach(() => {
        teamRepository = {
            create: jest.fn(),
            update: jest.fn(),
            findOneById: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
        };
        findOneTeamUseCase = new FindOneTeamUseCase(teamRepository);
        findOneByIdMock = jest.spyOn(findOneTeamUseCase, 'findOneById');
        useCase = new UpdateTeamUseCase(teamRepository, findOneTeamUseCase);
    });

    it('checks that the team exists, updates it, and returns it', async () => {
        // Arrange
        const teamId = 'team-id';
        const updateTeamDto: UpdateTeamDto = {
            name: 'Updated Team',
            colorHex: '#00FF00',
        };
        const existingTeam = Object.assign(new TeamEntity(), {
            id: teamId,
            name: 'Old Team',
        });
        const updatedTeam = Object.assign(new TeamEntity(), {
            id: teamId,
            ...updateTeamDto,
        });
        findOneByIdMock.mockResolvedValue(existingTeam);
        teamRepository.update.mockResolvedValue(updatedTeam);

        // Act
        const result = await useCase.execute(updateTeamDto, teamId);

        // Assert
        expect(result).toBe(updatedTeam);
        expect(findOneByIdMock).toHaveBeenCalledWith(teamId);
        expect(teamRepository.update).toHaveBeenCalledWith(
            existingTeam,
            expect.objectContaining(updateTeamDto),
        );
        expect(teamRepository.update.mock.calls[0][1]).toBeInstanceOf(
            TeamEntity,
        );
    });

    it('does not update when checking the team fails', async () => {
        // Arrange
        const error = new Error('Team team-id not found');
        findOneByIdMock.mockRejectedValue(error);

        // Act
        const action = useCase.execute({ name: 'Updated Team' }, 'team-id');

        // Assert
        await expect(action).rejects.toBe(error);
        expect(teamRepository.update).not.toHaveBeenCalled();
    });

    it('propagates repository update errors', async () => {
        // Arrange
        const teamId = 'team-id';
        const updateTeamDto: UpdateTeamDto = { name: 'Updated Team' };
        const existingTeam = Object.assign(new TeamEntity(), { id: teamId });
        const error = new Error('Unable to update team');
        findOneByIdMock.mockResolvedValue(existingTeam);
        teamRepository.update.mockRejectedValue(error);

        // Act
        const action = useCase.execute(updateTeamDto, teamId);

        // Assert
        await expect(action).rejects.toBe(error);
    });
});
