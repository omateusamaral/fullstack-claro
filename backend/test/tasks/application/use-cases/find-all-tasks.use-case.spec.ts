import { FindAllTasksUseCase } from '../../../../src/tasks/application/use-cases/find-all-tasks.use-case';
import { TaskEntity } from '../../../../src/tasks/domain/entities/tasks.entity';
import { TaskRepository } from '../../../../src/tasks/domain/repositories/task.repository';
import { FindAllTasksDto } from '../../../../src/tasks/presentation/dtos/find-all-tasks.dto';

describe('FindAllTasksUseCase', () => {
    const query = {
        teamId: 'team-id',
        limit: 10,
        offset: 0,
    } as FindAllTasksDto;
    const tasks = [{ id: 'task-id', title: 'Task title' }] as TaskEntity[];

    it('returns all tasks successfully', async () => {
        // Arrange
        const expected = { tasks, limit: 10, offset: 0, total: 1 };
        const taskRepository = {
            findAll: jest.fn().mockResolvedValue(expected),
        } as unknown as jest.Mocked<TaskRepository>;
        const useCase = new FindAllTasksUseCase(taskRepository);

        // Act
        const result = await useCase.execute(query);

        // Assert
        expect(result).toBe(expected);
        expect(taskRepository.findAll).toHaveBeenCalledWith(query);
    });

    it('propagates an error when retrieving tasks fails', async () => {
        // Arrange
        const error = new Error('Retrieval failed');
        const taskRepository = {
            findAll: jest.fn().mockRejectedValue(error),
        } as unknown as jest.Mocked<TaskRepository>;
        const useCase = new FindAllTasksUseCase(taskRepository);

        // Act
        const result = useCase.execute(query);

        // Assert
        await expect(result).rejects.toBe(error);
    });
});
