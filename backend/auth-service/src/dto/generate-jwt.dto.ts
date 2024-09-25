import { IsEmail, IsNotEmpty } from 'class-validator';

export class GenerateJwtDto {
    @IsNotEmpty()
    _id: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;
}