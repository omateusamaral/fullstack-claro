import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class FindAllTeamsDto {
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
    @IsEnum(['asc', 'desc'])
    order?: 'asc' | 'desc' = 'asc';
}
