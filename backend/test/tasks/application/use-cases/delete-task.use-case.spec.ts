import { DeleteTaskUseCase } from '../../../../src/tasks/application/use-cases/delete-task.use-case';
import { TaskEntity } from '../../../../src/tasks/domain/entities/tasks.entity';
import { TaskRepository } from '../../../../src/tasks/domain/repositories/task.repository';
import { FindOneTaskUseCase } from '../../../../src/tasks/application/use-cases/find-one-task.use-case';

describe('DeleteTaskUseCase', () => {
    const task = {
        id: 'task-id',
        title: 'Task title',
        team: { id: 'team-id', name: 'Team' },
    } as unknown as TaskEntity;

    it('deletes a task successfully', async () => {
        // Arrange
        const taskRepository = {
            delete: jest.fn().mockResolvedValue(undefined),
        } as unknown as jest.Mocked<TaskRepository>;
        const findOneTaskUseCase = {
            execute: jest.fn().mockResolvedValue(task),
        } as unknown as jest.Mocked<FindOneTaskUseCase>;
        const useCase = new DeleteTaskUseCase(
            taskRepository,
            findOneTaskUseCase,
        );

        // Act
        await useCase.execute(task.id);

        // Assert
        expect(findOneTaskUseCase.execute).toHaveBeenCalledWith(task.id);
        expect(taskRepository.delete).toHaveBeenCalledWith(task.id);
    });

    it('propagates an error when deleting a task fails', async () => {
        // Arrange
        const error = new Error('Delete failed');
        const taskRepository = {
            delete: jest.fn().mockRejectedValue(error),
        } as unknown as jest.Mocked<TaskRepository>;
        const findOneTaskUseCase = {
            execute: jest.fn().mockResolvedValue(task),
        } as unknown as jest.Mocked<FindOneTaskUseCase>;
        const useCase = new DeleteTaskUseCase(
            taskRepository,
            findOneTaskUseCase,
        );

        // Act
        const result = useCase.execute(task.id);

        // Assert
        await expect(result).rejects.toBe(error);
        expect(findOneTaskUseCase.execute).toHaveBeenCalledWith(task.id);
    });

    it('finds all tasks with a due date successfully', async () => {
        // Arrange
        const taskRepository = {
            findDueDateTasks: jest.fn().mockResolvedValue([task]),
        } as unknown as jest.Mocked<TaskRepository>;
        const findOneTaskUseCase = {} as jest.Mocked<FindOneTaskUseCase>;
        const useCase = new DeleteTaskUseCase(
            taskRepository,
            findOneTaskUseCase,
        );

        // Act
        await useCase.deleteAllDueDateTasks();

        // Assert
        expect(taskRepository.findDueDateTasks).toHaveBeenCalled();
    });

    it('propagates an error when finding due-date tasks fails', async () => {
        // Arrange
        const error = new Error('Lookup failed');
        const taskRepository = {
            findDueDateTasks: jest.fn().mockRejectedValue(error),
        } as unknown as jest.Mocked<TaskRepository>;
        const findOneTaskUseCase = {} as jest.Mocked<FindOneTaskUseCase>;
        const useCase = new DeleteTaskUseCase(
            taskRepository,
            findOneTaskUseCase,
        );

        // Act
        const result = useCase.deleteAllDueDateTasks();

        // Assert
        await expect(result).rejects.toBe(error);
    });
});
