import { CreateTeamDto } from '../../presentation/dtos/create-team.dto';
import { TeamEntity } from '../entities/teams.entity';

export abstract class TeamRepository {
    abstract create(data: CreateTeamDto): Promise<TeamEntity>;
}
