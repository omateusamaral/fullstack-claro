import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { TeamRepository } from '../../domain/repositories/team.repository';
import { TeamEntity } from '../../domain/entities/teams.entity';
import { CreateTeamDto } from '../../presentation/dtos/create-team.dto';
import { UpdateTeamDto } from '../../presentation/dtos/update-team.dto';

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

    async update(
        teamToBeUpdated: TeamEntity,
        data: UpdateTeamDto,
    ): Promise<TeamEntity> {
        this.repository.merge(teamToBeUpdated, data);
        return await this.repository.save(teamToBeUpdated);
    }

    async findOneById(teamId: string): Promise<TeamEntity | null> {
        return await this.repository.findOne({ where: { id: teamId } });
    }
}
