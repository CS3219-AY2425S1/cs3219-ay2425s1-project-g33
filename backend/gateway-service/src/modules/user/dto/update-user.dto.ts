import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { Languages, Proficiency } from 'src/constants';

export class UpdateUserDto {
  @ApiProperty({
    example: 'testUsername',
  })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({
    example: 'testDisplayname',
  })
  @IsString()
  @IsOptional()
  displayName: string;

  @ApiProperty({
    example: Proficiency.BEGINNER,
  })
  @IsEnum(Proficiency)
  @IsOptional()
  proficiency: Proficiency;

  @ApiProperty({
    example: [Languages.JAVA],
  })
  @IsEnum(Languages, { each: true })
  @IsOptional()
  languages: Languages[];

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isOnboarded: boolean;
}
