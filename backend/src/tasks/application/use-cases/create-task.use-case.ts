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
            const { teamIds, ...taskData } = createTaskDto;
            const teams = await Promise.all(
                teamIds.map((teamId) =>
                    this.findOneTeamUseCase.execute(teamId),
                ),
            );

            const taskEntityTransformed = plainToInstance(TaskEntity, {
                ...taskData,
                teams,
            });
            const task = await this.taskRepository.create(
                taskEntityTransformed,
            );
            this.logger.log('Task created successfully', {
                taskId: task.id,
                taskName: task.title,
                teamIds: task.teams.map((team) => team.id),
            });
            return task;
        } catch (error) {
            this.logger.error('Error creating task for the team', {
                error,
                taskName: createTaskDto.title,
                teamIds: createTaskDto.teamIds,
            });
            throw error;
        }
    }
}
