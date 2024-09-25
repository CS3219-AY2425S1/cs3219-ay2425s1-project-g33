import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsString, ValidateNested } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    example: 'Example Question Title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Example Question Description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Either Easy, Medium, or Hard',
    example: 'Easy',
  })
  @IsString()
  @IsIn(['Easy', 'Medium', 'Hard'])
  difficulty: string;

  @ApiProperty({
    example: ['Stack', 'String'],
  })
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  categories: string[];
}

export class UpdateQuestionDto {
  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => CreateQuestionDto)
  updatedQuestionInfo: CreateQuestionDto;
}
