import { Injectable, Logger } from '@nestjs/common';
import { TeamEntity } from '../../domain/entities/teams.entity';
import { TeamRepository } from '../../domain/repositories/team.repository';
import { plainToInstance } from 'class-transformer';
import { UpdateTeamDto } from '../../presentation/dtos/update-team.dto';
import { FindOneTeamUseCase } from './find-one-team.use-case';

@Injectable()
export class UpdateTeamUseCase {
    private readonly logger = new Logger(UpdateTeamUseCase.name);
    constructor(
        private readonly teamRepository: TeamRepository,
        private readonly findOneTeamUseCase: FindOneTeamUseCase,
    ) {}

    async execute(
        updateTeamDto: UpdateTeamDto,
        teamId: string,
    ): Promise<TeamEntity> {
        try {
            const teamToBeUpdated =
                await this.findOneTeamUseCase.findOneById(teamId);
            const teamEntityTransformed = plainToInstance(
                TeamEntity,
                updateTeamDto,
            );
            const team = await this.teamRepository.update(
                teamToBeUpdated,
                teamEntityTransformed,
            );
            this.logger.log('Team updated successfully', {
                teamId: team.id,
                teamName: team.name,
            });
            return team;
        } catch (error) {
            this.logger.error('Error updating team', {
                error,
                teamId,
                teamName: updateTeamDto.name,
            });
            throw error;
        }
    }
}
