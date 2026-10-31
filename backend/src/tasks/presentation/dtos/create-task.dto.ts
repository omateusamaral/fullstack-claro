import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsRFC3339,
    IsUUID,
    MaxLength,
    MinLength,
} from 'class-validator';
import { TaskStatus } from '../../domain/entities/tasks.entity';

export class CreateTaskDto {
    @IsNotEmpty()
    @MaxLength(100)
    @MinLength(3)
    title: string;

    @IsOptional()
    @MaxLength(200)
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus = TaskStatus.READY_FOR_DEVELOPMENT;

    @IsOptional()
    @IsRFC3339()
    dueDate?: Date;

    @IsNotEmpty()
    @IsUUID()
    teamId: string;
}
