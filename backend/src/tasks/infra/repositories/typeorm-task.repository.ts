import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { TaskEntity, TaskStatus } from '../../domain/entities/tasks.entity';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { FindAllTasksDto } from '../../presentation/dtos/find-all-tasks.dto';

@Injectable()
export class TypeOrmTaskRepository implements TaskRepository {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly repository: Repository<TaskEntity>,
    ) {}

    async create(data: TaskEntity): Promise<TaskEntity> {
        const task = this.repository.create(data);

        return await this.repository.save(task);
    }

    async update(
        taskToBeUpdated: TaskEntity,
        data: Partial<TaskEntity>,
    ): Promise<TaskEntity> {
        this.repository.merge(taskToBeUpdated, data);
        return await this.repository.save(taskToBeUpdated);
    }
    async findOneById(taskId: string): Promise<TaskEntity | null> {
        return await this.repository.findOne({
            where: { id: taskId },
            relations: { teams: true },
        });
    }

    async delete(taskId: string): Promise<void> {
        await this.repository.delete(taskId);
    }

    async findAll(query: FindAllTasksDto): Promise<{
        tasks: TaskEntity[];
        limit: number;
        offset: number;
        total: number;
    }> {
        const { limit, offset, search, status, teamId } = query;

        const queryBuilder = this.repository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.teams', 'team');

        if (teamId) {
            queryBuilder.andWhere('team.id = :teamId', { teamId });
        }

        if (search) {
            queryBuilder.andWhere(
                '(task.title ILIKE :search OR task.description ILIKE :search)',
                { search: `%${search}%` },
            );
        }

        if (status) {
            queryBuilder.andWhere('task.status = :status', { status });
        }

        const [tasks, total] = await queryBuilder
            .skip(offset)
            .take(limit)
            .getManyAndCount();
        return { tasks, limit, offset, total };
    }

    async findDueDateTasks(): Promise<TaskEntity[]> {
        return this.repository.find({
            where: {
                dueDate: LessThanOrEqual(new Date()),
                status: TaskStatus.COMPLETED,
            },
            relations: { teams: true },
        });
    }
}
