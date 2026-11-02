import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { TeamRepository } from '../../domain/repositories/team.repository';
import { TeamEntity } from '../../domain/entities/teams.entity';
import { CreateTeamDto } from '../../presentation/dtos/create-team.dto';
import { UpdateTeamDto } from '../../presentation/dtos/update-team.dto';
import { FindAllTeamsDto } from '../../presentation/dtos/find-all-teams.dto';

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

    async findAll(query: FindAllTeamsDto): Promise<{
        teams: TeamEntity[];
        limit: number;
        offset: number;
        total: number;
    }> {
        const { limit, offset } = query;
        const search = query.search ? query.search.trim() : undefined;
        const [teams, total] = await this.repository.findAndCount({
            where: search
                ? [
                      { name: ILike(`%${search}%`) },
                      { colorHex: ILike(`%${search}%`) },
                  ]
                : {},
            take: limit,
            skip: offset,
            order: { name: query?.order?.toUpperCase() as 'ASC' | 'DESC' },
        });

        return { teams, limit, offset, total };
    }

    async delete(teamId: string): Promise<void> {
        await this.repository.delete(teamId);
    }
}
