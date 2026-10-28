import { Injectable, Logger } from '@nestjs/common';
import { CreateTeamDto } from '../../presentation/dtos/create-team.dto';
import { TeamEntity } from '../../domain/entities/teams.entity';
import { TeamRepository } from '../../domain/repositories/team.repository';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CreateTeamUseCase {
    private readonly logger = new Logger(CreateTeamUseCase.name);
    constructor(private readonly teamRepository: TeamRepository) {}

    async execute(createTeamDto: CreateTeamDto): Promise<TeamEntity> {
        try {
            const teamEntityTransformed = plainToClass(
                TeamEntity,
                createTeamDto,
            );
            const team = await this.teamRepository.create(
                teamEntityTransformed,
            );
            this.logger.log('Team created successfully', {
                teamId: team.id,
                teamName: team.name,
            });
            return team;
        } catch (error) {
            this.logger.error('Error creating team', {
                error,
                teamName: createTeamDto.name,
            });
            throw error;
        }
    }
}
