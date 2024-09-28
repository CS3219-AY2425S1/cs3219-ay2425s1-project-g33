import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogOutDto {
  @ApiProperty({
    example: '66f66ea4f4767e112dh5189f',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
