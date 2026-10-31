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
}
