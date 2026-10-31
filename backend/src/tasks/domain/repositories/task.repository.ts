import { TaskEntity } from '../entities/tasks.entity';

export abstract class TaskRepository {
    abstract create(data: TaskEntity): Promise<TaskEntity>;
}
