import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
} from '@nestjs/common';
import { CreateTeamDto } from '../dtos/create-team.dto';
import { CreateTeamUseCase } from '../../application/use-cases/create-team.use-case';
import { TeamEntity } from '../../domain/entities/teams.entity';
import { UpdateTeamDto } from '../dtos/update-team.dto';
import { UpdateTeamUseCase } from '../../application/use-cases/update-team.use-case';

@Controller('teams')
export class TeamsController {
    constructor(
        private readonly createTeamUseCase: CreateTeamUseCase,
        private readonly updateTeamUseCase: UpdateTeamUseCase,
    ) {}
    @Get()
    findAll() {
        return 'This action returns all teams';
    }
    @Post()
    create(@Body() createTeamDto: CreateTeamDto): Promise<TeamEntity> {
        return this.createTeamUseCase.execute(createTeamDto);
    }

    @Put(':teamId')
    update(
        @Body() updateTeamDto: UpdateTeamDto,
        @Param('teamId', new ParseUUIDPipe()) teamId: string,
    ): Promise<TeamEntity> {
        return this.updateTeamUseCase.execute(updateTeamDto, teamId);
    }
}
