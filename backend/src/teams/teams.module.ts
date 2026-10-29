import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsController } from './presentation/controllers/teams.controller';
import { CreateTeamUseCase } from './application/use-cases/create-team.use-case';
import { TeamRepository } from './domain/repositories/team.repository';
import { TeamEntity } from './domain/entities/teams.entity';
import { TypeOrmTeamRepository } from './infra/repositories/typeorm-team.repository';
import { UpdateTeamUseCase } from './application/use-cases/update-team.use-case';
import { FindAllTeamsUseCase } from './application/use-cases/find-all-teams.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([TeamEntity])],
    controllers: [TeamsController],
    providers: [
        CreateTeamUseCase,
        UpdateTeamUseCase,
        FindAllTeamsUseCase,
        { provide: TeamRepository, useClass: TypeOrmTeamRepository },
    ],
})
export class TeamsModule {}
