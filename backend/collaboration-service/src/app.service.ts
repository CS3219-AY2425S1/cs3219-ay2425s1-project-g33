import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CollabSession } from './schema/collab-session.schema';
import mongoose, { Model } from 'mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateSessionDto } from './dto';
import { CollabSessionHistory } from './interfaces/collab-history.interface';
import { firstValueFrom } from 'rxjs';
import { ChatSendMessageRequestDto } from './dto/add-chat-message-request.dto';
import { RedisService } from './services/redis.service';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('CollabSession')
    private readonly sessionModel: Model<CollabSession>,
    @Inject('QUESTION_SERVICE') private readonly questionClient: ClientProxy,
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

  async getUserSessionHistory(userId: string): Promise<CollabSessionHistory[]> {
    try {
      const sessions = await this.sessionModel.find({ userIds: userId }).exec();

      const sessionPromises = sessions.map(async (session: CollabSession) => {
        const question = await firstValueFrom(
          this.questionClient.send(
            { cmd: 'get-question-by-id' },
            { id: session.questionId },
          ),
        );

        const entry: CollabSessionHistory = {
          sessionId: session._id.toString(),
          difficultyPreference: session.difficultyPreference,
          topicPreference: session.topicPreference,
          question: {
            id: session.questionId,
            title: question.title,
          },
          status: session.status,
          date: session.createdAt,
        };

        return entry;
      });

      const results = await Promise.all(sessionPromises);
      return results;
    } catch (error) {
      throw new RpcException(
        `Failed to get user session history: ${error.message}`,
      );
    }
  }

  async updateSessionStatus(
    id: string,
    status: string,
  ): Promise<CollabSession> {
    try {
      const session = await this.sessionModel
        .findByIdAndUpdate(id, { status }, { new: true })
        .exec();
      if (!session) {
        throw new RpcException('Session not found');
      }
      return session;
    } catch (error) {
      throw new RpcException(
        `Failed to update session status: ${error.message}`,
      );
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
