import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamRepository } from '../../domain/repositories/team.repository';
import { TeamEntity } from '../../domain/entities/teams.entity';
import { CreateTeamDto } from '../../presentation/dtos/create-team.dto';

@Injectable()
export class TypeOrmTeamRepository implements TeamRepository {
    constructor(
        @InjectRepository(TeamEntity)
        private readonly repository: Repository<TeamEntity>,
    ) {}

    async create(data: CreateTeamDto): Promise<TeamEntity> {
        const team = this.repository.create(data);

        return await this.repository.save(team);
    }
}
