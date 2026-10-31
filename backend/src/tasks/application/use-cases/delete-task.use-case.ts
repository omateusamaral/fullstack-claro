import { Injectable, Logger } from '@nestjs/common';
import { FindOneTaskUseCase } from './find-one-task.use-case';
import { TaskRepository } from '../../domain/repositories/task.repository';

@Injectable()
export class DeleteTaskUseCase {
    private readonly logger = new Logger(DeleteTaskUseCase.name);
    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly findOneTaskUseCase: FindOneTaskUseCase,
    ) {}

    async execute(taskId: string): Promise<void> {
        try {
            const task = await this.findOneTaskUseCase.execute(taskId);
            await this.taskRepository.delete(taskId);
            this.logger.log('Task deleted successfully', {
                taskId,
                taskTitle: task.title,
                teamId: task.team.id,
            });
        } catch (error) {
            this.logger.error('Error deleting task', {
                error,
                taskId,
            });
            throw error;
        }
    }
}
