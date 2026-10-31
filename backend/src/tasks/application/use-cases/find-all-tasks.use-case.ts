import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { TaskEntity } from '../../domain/entities/tasks.entity';
import { FindAllTasksDto } from '../../presentation/dtos/find-all-tasks.dto';

@Injectable()
export class FindAllTasksUseCase {
    private readonly logger = new Logger(FindAllTasksUseCase.name);
    constructor(private readonly taskRepository: TaskRepository) {}

    async execute(query: FindAllTasksDto): Promise<{
        tasks: TaskEntity[];
        limit: number;
        offset: number;
        total: number;
    }> {
        try {
            const tasks = await this.taskRepository.findAll(query);
            this.logger.log('Tasks retrieved successfully', {
                limit: query.limit,
                offset: query.offset,
                search: query.search,
                status: query.status,
                teamId: query.teamId,
            });
            return tasks;
        } catch (error) {
            this.logger.error('Error retrieving tasks', {
                error,
                limit: query.limit,
                offset: query.offset,
                search: query.search,
                status: query.status,
                teamId: query.teamId,
            });
            throw error;
        }
    }
}
