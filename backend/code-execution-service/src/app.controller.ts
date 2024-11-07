import { Controller } from "@nestjs/common";
import { AppService } from "./app.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ExecuteCodeDto } from "./dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: "execute-code" })
  async executeCode(@Payload() payload: ExecuteCodeDto) {
    return this.appService.runCode(payload);
  }
}
