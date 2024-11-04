import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CollabSession } from './schema/collab-session.schema';
import mongoose, { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { CreateSessionDto } from './dto';
import { ChatSendMessageRequestDto } from './dto/add-chat-message-request.dto';
import { RedisService } from './services/redis.service';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('CollabSession')
    private readonly sessionModel: Model<CollabSession>,
    private redisService: RedisService,
  ) {}

  async getSessionDetails(id: string): Promise<CollabSession> {
    console.log('session details: ' + id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RpcException('Invalid session Id format');
    }

    try {
      const session = await this.sessionModel.findById(id).exec();
      if (!session) {
        throw new RpcException('Session not found');
      }
      return session;
    } catch (error) {
      throw new RpcException(`Failed to get session details: ${error.message}`);
    }
  }

  async createSession(data: CreateSessionDto): Promise<CollabSession> {
    try {
      const newSession = new this.sessionModel({
        userIds: data.userIds,
        difficultyPreference: data.difficulty,
        topicPreference: data.topics,
        questionId: data.question,
      });
      await newSession.save();
      return newSession;
    } catch (error) {
      throw new RpcException(`Failed to create session: ${error.message}`);
    }
  }

  async addChatMessage(data: ChatSendMessageRequestDto) {
    await this.redisService.addChatMessage(data);
    return true;
  }

  async getAllChatMessages(id: string) {
    return await this.redisService.getAllChatMessages(id);
  }
}
