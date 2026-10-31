import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
import { TaskEntity } from '../../domain/entities/tasks.entity';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { UpdateTaskUseCase } from '../../application/use-cases/update-task.use-case';
import { FindOneTaskUseCase } from '../../application/use-cases/find-one-task.use-case';
import { DeleteTaskUseCase } from '../../application/use-cases/delete-task.use-case';
import { FindAllTasksDto } from '../dtos/find-all-tasks.dto';
import { FindAllTasksUseCase } from '../../application/use-cases/find-all-tasks.use-case';

@Controller('tasks')
export class TasksController {
    constructor(
        private readonly findOneTaskUseCase: FindOneTaskUseCase,
        private readonly findAllTasksUseCase: FindAllTasksUseCase,
        private readonly createTaskUseCase: CreateTaskUseCase,
        private readonly updateTaskUseCase: UpdateTaskUseCase,
        private readonly deleteTaskUseCase: DeleteTaskUseCase,
    ) {}
    @Get(':taskId')
    findOne(
        @Param('taskId', new ParseUUIDPipe()) taskId: string,
    ): Promise<TaskEntity> {
        return this.findOneTaskUseCase.execute(taskId);
    }

    @Get()
    findAll(@Query() query: FindAllTasksDto): Promise<{
        tasks: TaskEntity[];
        limit: number;
        offset: number;
        total: number;
    }> {
        return this.findAllTasksUseCase.execute(query);
    }

    @Post()
    create(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
        return this.createTaskUseCase.execute(createTaskDto);
    }

    @Put(':taskId')
    update(
        @Body() updateTaskDto: UpdateTaskDto,
        @Param('taskId', new ParseUUIDPipe()) taskId: string,
    ): Promise<TaskEntity> {
        return this.updateTaskUseCase.execute(updateTaskDto, taskId);
    }

    @Delete(':taskId')
    delete(
        @Param('taskId', new ParseUUIDPipe()) taskId: string,
    ): Promise<void> {
        return this.deleteTaskUseCase.execute(taskId);
    }
}
