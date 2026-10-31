import { Module } from '@nestjs/common';
import { TaskEntity } from './domain/entities/tasks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './presentation/controllers/tasks.controller';
import { TeamsModule } from '../teams/teams.module';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { TaskRepository } from './domain/repositories/task.repository';
import { TypeOrmTaskRepository } from './infra/repositories/typeorm-task.repository';
import { FindOneTaskUseCase } from './application/use-cases/find-one-task.use-case';
import { UpdateTaskUseCase } from './application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from './application/use-cases/delete-task.use-case';
import { FindAllTasksUseCase } from './application/use-cases/find-all-tasks.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([TaskEntity]), TeamsModule],
    controllers: [TasksController],
    providers: [
        CreateTaskUseCase,
        UpdateTaskUseCase,
        FindOneTaskUseCase,
        DeleteTaskUseCase,
        FindAllTasksUseCase,
        { provide: TaskRepository, useClass: TypeOrmTaskRepository },
    ],
})
export class TasksModule {}
