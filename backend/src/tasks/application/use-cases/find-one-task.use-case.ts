import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TaskEntity } from '../../domain/entities/tasks.entity';
import { TaskRepository } from '../../domain/repositories/task.repository';

@Injectable()
export class FindOneTaskUseCase {
    private readonly logger = new Logger(FindOneTaskUseCase.name);
    constructor(private readonly taskRepository: TaskRepository) {}

    async execute(taskId: string): Promise<TaskEntity> {
        const task = await this.taskRepository.findOneById(taskId);
        if (!task) {
            this.logger.error('Task not found', { taskId });
            throw new NotFoundException(`Task ${taskId} not found`);
        }
        return task;
    }
}
