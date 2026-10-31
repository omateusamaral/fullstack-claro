import { Injectable, Logger } from '@nestjs/common';
import { CreateTaskDto } from '../../presentation/dtos/create-task.dto';
import { TaskEntity } from '../../domain/entities/tasks.entity';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { plainToInstance } from 'class-transformer';
import { FindOneTeamUseCase } from '../../../teams/application/use-cases/find-one-team.use-case';

@Injectable()
export class CreateTaskUseCase {
    private readonly logger = new Logger(CreateTaskUseCase.name);
    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly findOneTeamUseCase: FindOneTeamUseCase,
    ) {}

    async execute(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
        try {
            const team = await this.findOneTeamUseCase.execute(
                createTaskDto.teamId,
            );

            const taskEntityTransformed = plainToInstance(TaskEntity, {
                ...createTaskDto,
                team,
            });
            const task = await this.taskRepository.create(
                taskEntityTransformed,
            );
            this.logger.log('Task created successfully', {
                taskId: task.id,
                taskName: task.title,
                teamId: task.team.id,
            });
            return task;
        } catch (error) {
            this.logger.error('Error creating task for the team', {
                error,
                taskName: createTaskDto.title,
                teamId: createTaskDto.teamId,
            });
            throw error;
        }
    }
}
