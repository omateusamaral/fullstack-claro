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

    async execute(taskId: string, teamId: string): Promise<void> {
        try {
            const task = await this.findOneTaskUseCase.execute(taskId, teamId);
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

    async deleteAllDueDateTasks(): Promise<void> {
        try {
            const tasks = await this.taskRepository.findDueDateTasks();

            for (const task of tasks) {
                this.logger.log('Task deleted successfully', {
                    taskId: task.id,
                    taskTitle: task.title,
                    teamId: task.team.id,
                });
            }
        } catch (error) {
            this.logger.error('Error deleting tasks', {
                error,
            });
            throw error;
        }
    }
}
