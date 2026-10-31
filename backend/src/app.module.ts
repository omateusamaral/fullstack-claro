import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TeamsModule } from './teams/teams.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
    imports: [DatabaseModule, TeamsModule, TasksModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
