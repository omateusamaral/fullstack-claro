import { IsEmpty, IsNotEmpty, MaxLength, Min, MinLength } from "class-validator";

export class CreateTeamDto{
    @IsNotEmpty()
    @MaxLength(100)
        @MinLength(3)
    name: string;
    
    @IsNotEmpty()
    @MaxLength(7)
    @MinLength(4)
    colorHex: string;

    @IsEmpty()
        @MaxLength(200)
    description?: string;
}