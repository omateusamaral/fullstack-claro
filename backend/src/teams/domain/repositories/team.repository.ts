import { UpdateResult } from 'typeorm';
import { CreateTeamDto } from '../../presentation/dtos/create-team.dto';
import { UpdateTeamDto } from '../../presentation/dtos/update-team.dto';
import { TeamEntity } from '../entities/teams.entity';

export abstract class TeamRepository {
    abstract create(data: CreateTeamDto): Promise<TeamEntity>;
    abstract update(
        teamToBeUpdated: TeamEntity,
        data: UpdateTeamDto,
    ): Promise<TeamEntity>;
    abstract findOneById(teamId: string): Promise<TeamEntity | null>;
}
