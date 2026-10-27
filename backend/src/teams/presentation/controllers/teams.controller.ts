import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTeamDto } from '../dtos/create-team.dto';

@Controller('teams')
export class TeamsController {
    @Get()
    findAll() {
        return 'This action returns all teams';
    }
    @Post()
    create(@Body() createTeamDto: CreateTeamDto) {
        console.log(createTeamDto);
    }
}
