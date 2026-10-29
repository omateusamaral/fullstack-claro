import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TeamEntity } from '../../domain/entities/teams.entity';
import { TeamRepository } from '../../domain/repositories/team.repository';

@Injectable()
export class FindOneTeamUseCase {
    private readonly logger = new Logger(FindOneTeamUseCase.name);
    constructor(private readonly teamRepository: TeamRepository) {}

    async findOneById(teamId: string): Promise<TeamEntity> {
        const team = await this.teamRepository.findOneById(teamId);
        if (!team) {
            this.logger.error('Team not found', { teamId });
            throw new NotFoundException(`Team ${teamId} not found`);
        }
        return team;
    }
}
