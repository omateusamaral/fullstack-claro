import { TaskEntity } from '../entities/tasks.entity';

export abstract class TaskRepository {
    abstract create(data: TaskEntity): Promise<TaskEntity>;
    abstract update(
        taskToBeUpdated: TaskEntity,
        data: Partial<TaskEntity>,
    ): Promise<TaskEntity>;
    abstract findOneById(taskId: string): Promise<TaskEntity | null>;
    abstract delete(taskId: string): Promise<void>;
}
