import { IsNotEmpty, IsString } from 'class-validator';

export class CodeChangeDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  operationType: 'insert' | 'delete';

  @IsNotEmpty()
  position: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}
