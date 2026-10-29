import { ApiProperty } from '@nestjs/swagger';
import {
    IsHexColor,
    IsNotEmpty,
    IsOptional,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UpdateTeamDto {
    @IsOptional()
    @MaxLength(100)
    @MinLength(3)
    @ApiProperty({
        example: 'Agile Team',
    })
    name?: string;

    @IsOptional()
    @MaxLength(7)
    @MinLength(4)
    @IsHexColor()
    @ApiProperty({
        example: '#FF5733',
    })
    colorHex?: string;

    @IsOptional()
    @MaxLength(200)
    @ApiProperty({
        example: 'A description of the team',
    })
    description?: string;
}
