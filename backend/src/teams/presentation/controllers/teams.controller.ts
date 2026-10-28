import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTeamDto } from '../dtos/create-team.dto';
import { CreateTeamUseCase } from '../../application/use-cases/create-team.use-case';
import { TeamEntity } from '../../domain/entities/teams.entity';

@Controller('teams')
export class TeamsController {
    constructor(private readonly createTeamUseCase: CreateTeamUseCase) {}
    @Get()
    findAll() {
        return 'This action returns all teams';
    }
    @Post()
    create(@Body() createTeamDto: CreateTeamDto): Promise<TeamEntity> {
        return this.createTeamUseCase.execute(createTeamDto);
    }
}
