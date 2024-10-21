import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload, MessagePattern } from '@nestjs/microservices';
import { CodeChangeDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Handle incoming code change events from Redis
  @EventPattern('codeChange')
  async handleCodeChange(@Payload() data: CodeChangeDto) {
    console.log('Received code change:', data);
    // Process the code change using the AppService
    await this.appService.processCodeChange(data);
  }

  @EventPattern('addUserToRoom')
  async handleAddUserToRoom(@Payload() data: { roomId: string; userId: string }) {
    console.log('Received add user to room:', data);
    // Process the add user to room using the AppService
    await this.appService.processAddUserToRoom(data.roomId, data.userId);
  }

  @EventPattern('removeUserFromRoom')
  async handleRemoveUserFromRoom(@Payload() data: { roomId: string; userId: string }) {
    console.log('Received remove user from room:', data);
    // Process the remove user from room using the AppService
    await this.appService.processRemoveUserFromRoom(data.roomId, data.userId);
  }

  @MessagePattern('getCodeChangesForRoom')
  async handleGetCodeChangesForRoom(@Payload() data: { roomId: string }) {
    console.log('Received get code changes for room:', data);
    // Process the get code changes for room using the AppService
    const codeChanges = await this.appService.getCodeChangesForRoom(data.roomId);
    return codeChanges;
  }
}
