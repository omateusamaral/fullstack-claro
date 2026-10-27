import { Module } from '@nestjs/common';
import { TeamsController } from './presentation/controllers/teams.controller';

@Module({
    imports: [],
    controllers: [TeamsController],
    providers: [],
})
export class TeamsModule {}
