import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordRequestDto {
  @ApiProperty({
    example: 'test@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

}
