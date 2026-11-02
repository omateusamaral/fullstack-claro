import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsRFC3339,
    IsUUID,
    ArrayNotEmpty,
    ArrayUnique,
    IsArray,
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
    status?: TaskStatus = TaskStatus.PENDING;

    @IsOptional()
    @IsRFC3339()
    dueDate?: Date;

    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsUUID('4', { each: true })
    teamIds: string[];
}
