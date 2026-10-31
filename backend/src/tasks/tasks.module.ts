import { Module } from '@nestjs/common';
import { TaskEntity } from './domain/entities/tasks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './presentation/controllers/tasks.controller';
import { TeamsModule } from '../teams/teams.module';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { TaskRepository } from './domain/repositories/task.repository';
import { TypeOrmTaskRepository } from './infra/repositories/typeorm-task.repository';

@Module({
    imports: [TypeOrmModule.forFeature([TaskEntity]), TeamsModule],
    controllers: [TasksController],
    providers: [
        CreateTaskUseCase,
        { provide: TaskRepository, useClass: TypeOrmTaskRepository },
    ],
})
export class TasksModule {}
