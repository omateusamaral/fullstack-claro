import { CreateTaskUseCase } from '../../../../src/tasks/application/use-cases/create-task.use-case';
import { TaskEntity, TaskStatus } from '../../../../src/tasks/domain/entities/tasks.entity';
import { TaskRepository } from '../../../../src/tasks/domain/repositories/task.repository';
import { FindOneTeamUseCase } from '../../../../src/teams/application/use-cases/find-one-team.use-case';

describe('CreateTaskUseCase', () => {
    const team = {
        id: 'team-id',
        name: 'Team',
        colorHex: '#FFFFFF',
        tasks: [],
    };
    const task = {
        id: 'task-id',
        title: 'Task title',
        description: 'Task description',
        status: TaskStatus.PENDING,
        teams: [team],
    } as unknown as TaskEntity;

    it('creates a task successfully', async () => {
        // Arrange
        const createTaskDto = {
            title: task.title,
            description: task.description,
            status: task.status,
            teamIds: [team.id],
        };
        const taskRepository = {
            create: jest.fn().mockResolvedValue(task),
        } as unknown as jest.Mocked<TaskRepository>;
        const findOneTeamUseCase = {
            execute: jest.fn().mockResolvedValue(team),
        } as unknown as jest.Mocked<FindOneTeamUseCase>;
        const useCase = new CreateTaskUseCase(
            taskRepository,
            findOneTeamUseCase,
        );

        // Act
        const result = await useCase.execute(createTaskDto);

        // Assert
        expect(result).toBe(task);
        expect(findOneTeamUseCase.execute).toHaveBeenCalledWith(team.id);
        expect(taskRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                title: createTaskDto.title,
                teams: [team],
            }),
        );
    });

    it('creates a task without teams', async () => {
        // Arrange
        const createTaskDto = {
            title: task.title,
            teamIds: [],
        };
        const taskWithoutTeams = {
            ...task,
            teams: [],
        } as TaskEntity;
        const taskRepository = {
            create: jest.fn().mockResolvedValue(taskWithoutTeams),
        } as unknown as jest.Mocked<TaskRepository>;
        const findOneTeamUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<FindOneTeamUseCase>;
        const useCase = new CreateTaskUseCase(
            taskRepository,
            findOneTeamUseCase,
        );

        // Act
        const result = await useCase.execute(createTaskDto);

        // Assert
        expect(result).toBe(taskWithoutTeams);
        expect(findOneTeamUseCase.execute).not.toHaveBeenCalled();
        expect(taskRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                title: createTaskDto.title,
                teams: [],
            }),
        );
    });

    it('propagates an error when the team cannot be found', async () => {
        // Arrange
        const error = new Error('Team lookup failed');
        const createTaskDto = { title: 'Task title', teamIds: [team.id] };
        const taskRepository = {
            create: jest.fn(),
        } as unknown as jest.Mocked<TaskRepository>;
        const findOneTeamUseCase = {
            execute: jest.fn().mockRejectedValue(error),
        } as unknown as jest.Mocked<FindOneTeamUseCase>;
        const useCase = new CreateTaskUseCase(
            taskRepository,
            findOneTeamUseCase,
        );

        // Act
        const result = useCase.execute(createTaskDto);

        // Assert
        await expect(result).rejects.toBe(error);
        expect(taskRepository.create).not.toHaveBeenCalled();
    });
});
