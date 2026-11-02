import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { TeamRepository } from '../../domain/repositories/team.repository';
import { FindOneTeamUseCase } from './find-one-team.use-case';

@Injectable()
export class DeleteTeamUseCase {
    private readonly logger = new Logger(DeleteTeamUseCase.name);
    constructor(
        private readonly teamRepository: TeamRepository,
        private readonly findOneTeamUseCase: FindOneTeamUseCase,
    ) {}

    async execute(teamId: string): Promise<void> {
        try {
            const team = await this.findOneTeamUseCase.execute(teamId);
            if (team?.tasks?.length > 0) {
                throw new ConflictException(
                    'Cannot delete team with associated tasks',
                );
            }
            await this.teamRepository.delete(teamId);
            this.logger.log('Team deleted successfully', {
                teamId,
            });
        } catch (error) {
            this.logger.error('Error deleting team', {
                error,
                teamId,
            });
            throw error;
        }
    }
}
