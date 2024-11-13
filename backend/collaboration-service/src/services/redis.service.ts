import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { config } from 'src/configs';
import { ChatSendMessageRequestDto } from 'src/dto/add-chat-message-request.dto';
import { ChatMessagesResponse } from 'src/interfaces/chat-messages-response.interface';

@Injectable()
export class RedisService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: config.redis.host,
      port: config.redis.port,
    });
  }

  async addChatMessage(data: ChatSendMessageRequestDto): Promise<void> {
    const message = JSON.stringify(data);

    await this.redisClient.rpush(`session:${data.sessionId}:messages`, message);
  }

  async getAllChatMessages(sessionId: string): Promise<ChatMessagesResponse> {
    // Get all messages with LRANGE
    const messages = await this.redisClient.lrange(
      `session:${sessionId}:messages`,
      0,
      -1,
    );
    // Parse each message from JSON format
    return {
      messages: messages.map((msg) => {
        return JSON.parse(msg);
      }),
    };
  }
}
