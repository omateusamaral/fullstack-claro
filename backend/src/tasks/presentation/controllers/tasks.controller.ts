import { Body, Controller, Post } from '@nestjs/common';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
import { TaskEntity } from '../../domain/entities/tasks.entity';

@Controller('tasks')
export class TasksController {
    constructor(private readonly createTaskUseCase: CreateTaskUseCase) {}

    @Post()
    create(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
        return this.createTaskUseCase.execute(createTaskDto);
    }
}
