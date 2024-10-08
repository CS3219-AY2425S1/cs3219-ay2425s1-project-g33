import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Operation } from '../interfaces/operation.interface';

export class SessionOperationRequestDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsNotEmpty()
  operation: Operation;
}
