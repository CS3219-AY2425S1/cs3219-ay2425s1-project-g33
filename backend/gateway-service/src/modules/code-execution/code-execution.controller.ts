import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ExecuteCodeDto } from './dto/execute-code.dto'; // Create this DTO
import { ApiTags } from '@nestjs/swagger';

@ApiTags('code-execution')
@Controller('code-execution')
export class CodeExecutionController {
  constructor(
    @Inject('CODE_EXECUTION_SERVICE')
    private readonly codeExecutionClient: ClientProxy,
  ) {}

  // POST endpoint to submit code for execution
  @Post('submit')
  async submitCode(@Body() dto: ExecuteCodeDto) {
    return this.codeExecutionClient.send({ cmd: 'execute-code' }, dto);
  }
}
