import { UpdateTaskUseCase } from '../../../../src/tasks/application/use-cases/update-task.use-case';
import {
    TaskEntity,
    TaskStatus,
} from '../../../../src/tasks/domain/entities/tasks.entity';
import { TaskRepository } from '../../../../src/tasks/domain/repositories/task.repository';
import { FindOneTaskUseCase } from '../../../../src/tasks/application/use-cases/find-one-task.use-case';
import { FindOneTeamUseCase } from '../../../../src/teams/application/use-cases/find-one-team.use-case';

describe('UpdateTaskUseCase', () => {
    const task = {
        id: 'task-id',
        title: 'Old title',
        teams: [{ id: 'team-id', name: 'Team' }],
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
        const findOneTeamUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<FindOneTeamUseCase>;
        const useCase = new UpdateTaskUseCase(
            taskRepository,
            findOneTaskUseCase,
            findOneTeamUseCase,
        );

        // Act
        const result = await useCase.execute(
            updateTaskDto,
            task.id,
        );

        // Assert
        expect(result).toBe(updatedTask);
        expect(findOneTaskUseCase.execute).toHaveBeenCalledWith(task.id);
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
        const findOneTeamUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<FindOneTeamUseCase>;
        const useCase = new UpdateTaskUseCase(
            taskRepository,
            findOneTaskUseCase,
            findOneTeamUseCase,
        );

        // Act
        const result = useCase.execute(updateTaskDto, task.id);

        // Assert
        await expect(result).rejects.toBe(error);
        expect(taskRepository.update).not.toHaveBeenCalled();
    });

    it('clears all teams when an empty team list is provided', async () => {
        const updateTaskDto = { teamIds: [] };
        const taskRepository = {
            update: jest.fn().mockResolvedValue({
                ...task,
                teams: [],
            }),
        } as unknown as jest.Mocked<TaskRepository>;
        const findOneTaskUseCase = {
            execute: jest.fn().mockResolvedValue(task),
        } as unknown as jest.Mocked<FindOneTaskUseCase>;
        const findOneTeamUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<FindOneTeamUseCase>;
        const useCase = new UpdateTaskUseCase(
            taskRepository,
            findOneTaskUseCase,
            findOneTeamUseCase,
        );

        await useCase.execute(updateTaskDto, task.id);

        expect(taskRepository.update).toHaveBeenCalledWith(
            task,
            expect.objectContaining({ teams: [] }),
        );
        expect(findOneTeamUseCase.execute).not.toHaveBeenCalled();
    });
});
