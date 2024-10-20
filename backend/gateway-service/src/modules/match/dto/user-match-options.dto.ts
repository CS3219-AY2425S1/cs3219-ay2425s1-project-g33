import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UserMatchOptionsDto {

  @IsString()
  userId: string;
  
  @ApiProperty({
    description: 'Either Easy, Medium, or Hard',
    example: 'Easy',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['Easy', 'Medium', 'Hard'])
  selectedDifficulty: string;

  @ApiProperty({
    example: ['Stack', 'String'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @Type(() => String)
  selectedTopic: string[];
}
