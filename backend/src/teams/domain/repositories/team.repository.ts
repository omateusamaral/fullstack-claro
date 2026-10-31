import { UpdateTeamDto } from '../../presentation/dtos/update-team.dto';
import { TeamEntity } from '../entities/teams.entity';
import { FindAllTeamsDto } from '../../presentation/dtos/find-all-teams.dto';

export abstract class TeamRepository {
    abstract create(data: TeamEntity): Promise<TeamEntity>;
    abstract update(
        teamToBeUpdated: TeamEntity,
        data: UpdateTeamDto,
    ): Promise<TeamEntity>;
    abstract findOneById(teamId: string): Promise<TeamEntity | null>;
    abstract findAll(query: FindAllTeamsDto): Promise<{
        teams: TeamEntity[];
        limit: number;
        offset: number;
        total: number;
    }>;
    abstract delete(teamId: string): Promise<void>;
}
