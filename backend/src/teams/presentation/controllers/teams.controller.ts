import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { CreateTeamDto } from '../dtos/create-team.dto';
import { CreateTeamUseCase } from '../../application/use-cases/create-team.use-case';
import { TeamEntity } from '../../domain/entities/teams.entity';
import { UpdateTeamDto } from '../dtos/update-team.dto';
import { UpdateTeamUseCase } from '../../application/use-cases/update-team.use-case';
import { FindAllTeamsUseCase } from '../../application/use-cases/find-all-teams.use-case';
import { FindAllTeamsDto } from '../dtos/find-all-teams.dto';
import { DeleteTeamUseCase } from '../../application/use-cases/delete-team.use-case';
import { FindOneTeamUseCase } from '../../application/use-cases/find-one-team.use-case';

@Controller('teams')
export class TeamsController {
    constructor(
        private readonly findOneTeamUseCase: FindOneTeamUseCase,
        private readonly findAllTeamsUseCase: FindAllTeamsUseCase,
        private readonly createTeamUseCase: CreateTeamUseCase,
        private readonly updateTeamUseCase: UpdateTeamUseCase,
        private readonly deleteTeamUseCase: DeleteTeamUseCase,
    ) {}
    @Get(':teamId')
    findOne(@Param('teamId', new ParseUUIDPipe()) teamId: string) {
        return this.findOneTeamUseCase.execute(teamId);
    }
    @Get()
    findAll(@Query() query: FindAllTeamsDto) {
        return this.findAllTeamsUseCase.execute(query);
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

    @Delete(':teamId')
    delete(
        @Param('teamId', new ParseUUIDPipe()) teamId: string,
    ): Promise<void> {
        return this.deleteTeamUseCase.execute(teamId);
    }
}
