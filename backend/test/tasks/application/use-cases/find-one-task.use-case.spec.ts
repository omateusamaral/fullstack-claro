import { NotFoundException } from '@nestjs/common';
import { FindOneTaskUseCase } from '../../../../src/tasks/application/use-cases/find-one-task.use-case';
import { TaskEntity } from '../../../../src/tasks/domain/entities/tasks.entity';
import { TaskRepository } from '../../../../src/tasks/domain/repositories/task.repository';

describe('FindOneTaskUseCase', () => {
    const task = {
        id: 'task-id',
        title: 'Task title',
        teams: [{
            id: 'team-id',
        }],
    } as TaskEntity;

    it('returns a task successfully', async () => {
        // Arrange
        const taskRepository = {
            findOneById: jest.fn().mockResolvedValue(task),
        } as unknown as jest.Mocked<TaskRepository>;
        const useCase = new FindOneTaskUseCase(taskRepository);

        // Act
        const result = await useCase.execute(task.id);

        // Assert
        expect(result).toBe(task);
        expect(taskRepository.findOneById).toHaveBeenCalledWith(task.id);
    });

    it('throws NotFoundException when the task does not exist', async () => {
        // Arrange
        const taskRepository = {
            findOneById: jest.fn().mockResolvedValue(null),
        } as unknown as jest.Mocked<TaskRepository>;
        const useCase = new FindOneTaskUseCase(taskRepository);

        // Act
        const result = useCase.execute(task.id);

        // Assert
        await expect(result).rejects.toBeInstanceOf(NotFoundException);
        await expect(result).rejects.toThrow(`Task ${task.id} not found`);
    });
});
