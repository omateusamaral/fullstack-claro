import { Injectable, Logger } from '@nestjs/common';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { TaskEntity } from '../../domain/entities/tasks.entity';
import { UpdateTaskDto } from '../../presentation/dtos/update-task.dto';
import { FindOneTaskUseCase } from './find-one-task.use-case';
import { plainToInstance } from 'class-transformer';
import { FindOneTeamUseCase } from '../../../teams/application/use-cases/find-one-team.use-case';
@Injectable()
export class UpdateTaskUseCase {
    private readonly logger = new Logger(UpdateTaskUseCase.name);
    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly FindOneTaskUseCase: FindOneTaskUseCase,
        private readonly findOneTeamUseCase: FindOneTeamUseCase,
    ) {}

    async execute(
        updateTaskDto: UpdateTaskDto,
        taskId: string,
    ): Promise<TaskEntity> {
        try {
            const taskToBeUpdated = await this.FindOneTaskUseCase.execute(
                taskId,
            );
            const { teamIds, ...taskData } = updateTaskDto;
            const teams = teamIds
                ? await Promise.all(
                      teamIds.map((teamId) =>
                          this.findOneTeamUseCase.execute(teamId),
                      ),
                  )
                : undefined;

            const taskEntityTransformed = plainToInstance(TaskEntity, {
                ...taskData,
                ...(teams ? { teams } : {}),
            });
            const task = await this.taskRepository.update(
                taskToBeUpdated,
                taskEntityTransformed,
            );

            this.logger.log('Task updated successfully', {
                taskId: task.id,
                taskTitle: task.title,
                teamIds: task.teams.map((team) => team.id),
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
