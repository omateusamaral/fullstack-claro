import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateTeamDto } from '../../presentation/dtos/create-team.dto';
import { TeamEntity } from '../../domain/entities/teams.entity';
import { TeamRepository } from '../../domain/repositories/team.repository';
import { plainToInstance } from 'class-transformer';
import { FindAllTeamsDto } from '../../presentation/dtos/find-all-teams.dto';

@Injectable()
export class FindAllTeamsUseCase {
    private readonly logger = new Logger(FindAllTeamsUseCase.name);
    constructor(private readonly teamRepository: TeamRepository) {}

    async execute(query: FindAllTeamsDto): Promise<{
        teams: TeamEntity[];
        limit: number;
        offset: number;
        total: number;
    }> {
        try {
            const teams = await this.teamRepository.findAll(query);
            this.logger.log('Teams retrieved successfully', {
                limit: query.limit,
                offset: query.offset,
                search: query.search,
            });
            return teams;
        } catch (error) {
            this.logger.error('Error retrieving teams', {
                error,
                limit: query.limit,
                offset: query.offset,
                search: query.search,
            });
            throw error;
        }
    }
}
