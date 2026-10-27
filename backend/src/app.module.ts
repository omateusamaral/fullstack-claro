import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TeamsModule } from './teams/teams.module';

@Module({
    imports: [DatabaseModule, TeamsModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
