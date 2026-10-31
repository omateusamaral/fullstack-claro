import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../../domain/entities/tasks.entity';
import { TaskRepository } from '../../domain/repositories/task.repository';

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
            relations: { team: true },
        });
    }

    async delete(taskId: string): Promise<void> {
        await this.repository.delete(taskId);
    }
}
