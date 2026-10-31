import { UpdateTaskUseCase } from '../../../../src/tasks/application/use-cases/update-task.use-case';
import {
    TaskEntity,
    TaskStatus,
} from '../../../../src/tasks/domain/entities/tasks.entity';
import { TaskRepository } from '../../../../src/tasks/domain/repositories/task.repository';
import { FindOneTaskUseCase } from '../../../../src/tasks/application/use-cases/find-one-task.use-case';

describe('UpdateTaskUseCase', () => {
    const task = {
        id: 'task-id',
        title: 'Old title',
        team: { id: 'team-id', name: 'Team' },
    } as unknown as TaskEntity;

    it('updates a task successfully', async () => {
        // Arrange
        const updateTaskDto = {
            title: 'New title',
            status: TaskStatus.IN_PROGRESS,
        };
        const updatedTask = {
            ...task,
            ...updateTaskDto,
        } as TaskEntity;
        const taskRepository = {
            update: jest.fn().mockResolvedValue(updatedTask),
        } as unknown as jest.Mocked<TaskRepository>;
        const findOneTaskUseCase = {
            execute: jest.fn().mockResolvedValue(task),
        } as unknown as jest.Mocked<FindOneTaskUseCase>;
        const useCase = new UpdateTaskUseCase(
            taskRepository,
            findOneTaskUseCase,
        );

        // Act
        const result = await useCase.execute(
            updateTaskDto,
            task.id,
            task.team.id,
        );

        // Assert
        expect(result).toBe(updatedTask);
        expect(findOneTaskUseCase.execute).toHaveBeenCalledWith(
            task.id,
            task.team.id,
        );
        expect(taskRepository.update).toHaveBeenCalledWith(
            task,
            expect.objectContaining(updateTaskDto),
        );
    });

    it('propagates an error when the task cannot be found', async () => {
        // Arrange
        const error = new Error('Task lookup failed');
        const updateTaskDto = { title: 'New title' };
        const taskRepository = {
            update: jest.fn(),
        } as unknown as jest.Mocked<TaskRepository>;
        const findOneTaskUseCase = {
            execute: jest.fn().mockRejectedValue(error),
        } as unknown as jest.Mocked<FindOneTaskUseCase>;
        const useCase = new UpdateTaskUseCase(
            taskRepository,
            findOneTaskUseCase,
        );

        // Act
        const result = useCase.execute(updateTaskDto, task.id, task.team.id);

        // Assert
        await expect(result).rejects.toBe(error);
        expect(taskRepository.update).not.toHaveBeenCalled();
    });
});
