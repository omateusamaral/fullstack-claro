import {
    IsOptional,
    MaxLength,
    MinLength,
    IsEnum,
    IsRFC3339,
    ArrayUnique,
    IsArray,
    IsUUID,
} from 'class-validator';
import { TaskStatus } from '../../domain/entities/tasks.entity';

export class UpdateTaskDto {
    @IsOptional()
    @MaxLength(100)
    @MinLength(3)
    title?: string;

    @IsOptional()
    @MaxLength(200)
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsRFC3339()
    dueDate?: Date;

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsUUID('4', { each: true })
    teamIds?: string[];
}
