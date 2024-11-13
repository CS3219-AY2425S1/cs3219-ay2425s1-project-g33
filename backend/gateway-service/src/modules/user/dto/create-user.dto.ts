import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'test@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
