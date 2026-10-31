import { NotFoundException } from '@nestjs/common';
import { FindOneTeamUseCase } from '../../../../src/teams/application/use-cases/find-one-team.use-case';
import { TeamEntity } from '../../../../src/teams/domain/entities/teams.entity';
import { TeamRepository } from '../../../../src/teams/domain/repositories/team.repository';

describe('FindOneTeamUseCase', () => {
    let useCase: FindOneTeamUseCase;
    let teamRepository: jest.Mocked<TeamRepository>;

    beforeEach(() => {
        teamRepository = {
            create: jest.fn(),
            update: jest.fn(),
            findOneById: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
        };
        useCase = new FindOneTeamUseCase(teamRepository);
    });

    it('returns the team when it exists', async () => {
        // Arrange
        const teamId = 'team-id';
        const team = Object.assign(new TeamEntity(), { id: teamId });
        teamRepository.findOneById.mockResolvedValue(team);

        // Act
        const result = await useCase.execute(teamId);

        // Assert
        expect(result).toBe(team);
        expect(teamRepository.findOneById).toHaveBeenCalledWith(teamId);
    });

    it('throws NotFoundException when the team does not exist', async () => {
        // Arrange
        const teamId = 'missing-team-id';
        teamRepository.findOneById.mockResolvedValue(null);

        // Act
        const action = useCase.execute(teamId);

        // Assert
        await expect(action).rejects.toBeInstanceOf(NotFoundException);
        await expect(action).rejects.toThrow(`Team ${teamId} not found`);
    });

    it('propagates repository errors', async () => {
        // Arrange
        const error = new Error('Unable to find team');
        teamRepository.findOneById.mockRejectedValue(error);

        // Act
        const action = useCase.execute('team-id');

        // Assert
        await expect(action).rejects.toBe(error);
    });
});
