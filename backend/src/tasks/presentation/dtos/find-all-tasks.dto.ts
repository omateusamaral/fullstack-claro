import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    Min,
} from 'class-validator';
import { TaskStatus } from '../../domain/entities/tasks.entity';

export class FindAllTasksDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(1000)
    offset: number = 0;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsUUID()
    teamId?: string;

    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    order?: 'ASC' | 'DESC' = 'ASC';
}
