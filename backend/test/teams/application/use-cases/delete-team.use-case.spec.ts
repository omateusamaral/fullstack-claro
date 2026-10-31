import { DeleteTeamUseCase } from '../../../../src/teams/application/use-cases/delete-team.use-case';
import { FindOneTeamUseCase } from '../../../../src/teams/application/use-cases/find-one-team.use-case';
import { TeamRepository } from '../../../../src/teams/domain/repositories/team.repository';

describe('DeleteTeamUseCase', () => {
    let useCase: DeleteTeamUseCase;
    let teamRepository: jest.Mocked<TeamRepository>;
    let findOneTeamUseCase: FindOneTeamUseCase;
    let findOneByIdMock: jest.SpiedFunction<FindOneTeamUseCase['execute']>;

    beforeEach(() => {
        teamRepository = {
            create: jest.fn(),
            update: jest.fn(),
            findOneById: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
        };
        findOneTeamUseCase = new FindOneTeamUseCase(teamRepository);
        findOneByIdMock = jest.spyOn(findOneTeamUseCase, 'execute');
        useCase = new DeleteTeamUseCase(teamRepository, findOneTeamUseCase);
    });

    it('checks that the team exists and deletes it', async () => {
        // Arrange
        const teamId = 'team-id';
        findOneByIdMock.mockResolvedValue({ id: teamId } as never);
        teamRepository.delete.mockResolvedValue(undefined);

        // Act
        await useCase.execute(teamId);

        // Assert
        expect(findOneByIdMock).toHaveBeenCalledWith(teamId);
        expect(teamRepository.delete).toHaveBeenCalledWith(teamId);
    });

    it('does not delete when checking the team fails', async () => {
        // Arrange
        const teamId = 'team-id';
        const error = new Error(`Team ${teamId} not found`);
        findOneByIdMock.mockRejectedValue(error);

        // Act
        const action = useCase.execute(teamId);

        // Assert
        await expect(action).rejects.toBe(error);
        expect(teamRepository.delete).not.toHaveBeenCalled();
    });

    it('propagates repository deletion errors', async () => {
        // Arrange
        const teamId = 'team-id';
        const error = new Error('Unable to delete team');
        findOneByIdMock.mockResolvedValue({ id: teamId } as never);
        teamRepository.delete.mockRejectedValue(error);

        // Act
        const action = useCase.execute(teamId);

        // Assert
        await expect(action).rejects.toBe(error);
    });
});
