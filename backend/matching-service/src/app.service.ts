import { Injectable } from '@nestjs/common';
import { MatchRequestDto } from './dto/match-request.dto';
import { RedisService } from './services/redis.service';
import { MatchResponse } from './interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { MatchHistory } from './schema/match-history.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    private redisService: RedisService,
    @InjectModel('MatchHistory')
    private readonly matchHistoryModel: Model<MatchHistory>,
  ) {}

  // Add user to the Redis pool
  async requestMatch(data: MatchRequestDto): Promise<MatchResponse> {
    return this.redisService.addUserToPool(data);
  }

  // Remove user from the Redis pool
  async cancelMatch(userId: string): Promise<MatchResponse> {
    return this.redisService.removeUsersFromPool([userId]);
  }

  // Handle match confirmed event
  async matchConfirmed(matchId: string, sessionId: string): Promise<void> {
    const match = await this.findMatchByMatchId(matchId);
    
    if (!match) {
      throw new Error('Match not found');
    }
    match.sessionId = sessionId;
    match.status = 'confirmed';
    await match.save();
  }

  // Handle match declined event
  async matchDeclined(matchId: string): Promise<void> {
    const match = await this.findMatchByMatchId(matchId);
    
    if (!match) {
      throw new Error('Match not found');
    }

    match.status = 'cancelled';
    await match.save();
  }

  async createMatchHistoryDocument(data: {userIds: string[], topicPreference: string[], difficultyPreference: string}): Promise<MatchHistory> {
    const match = new this.matchHistoryModel({
      userIds: data.userIds,
      topicPreference: data.topicPreference,
      difficultyPreference: data.difficultyPreference,
      status: 'pending',
    });
    return match.save();
  }

  async getMatchHistory(sessionId: string): Promise<MatchHistory> {
    return this.matchHistoryModel.findOne({ sessionId }).exec();
  }


  private async findMatchByMatchId(matchId: string): Promise<MatchHistory> {
    const objectId = new Types.ObjectId(matchId);
    return this.matchHistoryModel.findById(objectId).exec();
  }
}
