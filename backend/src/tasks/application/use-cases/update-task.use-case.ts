import { Injectable, Logger } from '@nestjs/common';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { TaskEntity } from '../../domain/entities/tasks.entity';
import { UpdateTaskDto } from '../../presentation/dtos/update-task.dto';
import { FindOneTaskUseCase } from './find-one-task.use-case';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class UpdateTaskUseCase {
    private readonly logger = new Logger(UpdateTaskUseCase.name);
    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly FindOneTaskUseCase: FindOneTaskUseCase,
    ) {}

    async execute(
        updateTaskDto: UpdateTaskDto,
        taskId: string,
        teamId: string,
    ): Promise<TaskEntity> {
        try {
            const taskToBeUpdated = await this.FindOneTaskUseCase.execute(
                taskId,
                teamId,
            );

            const taskEntityTransformed = plainToInstance(TaskEntity, {
                ...updateTaskDto,
            });
            const task = await this.taskRepository.update(
                taskToBeUpdated,
                taskEntityTransformed,
            );

            this.logger.log('Task updated successfully', {
                taskId: task.id,
                taskTitle: task.title,
                teamId: task.team.id,
                teamName: task.team.name,
            });
            return task;
        } catch (error) {
            this.logger.error('Error updating task', {
                error,
                taskId,
                taskTitle: updateTaskDto.title,
            });
            throw error;
        }
    }
}
