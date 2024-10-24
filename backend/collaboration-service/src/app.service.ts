import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CodeChangeEvent } from './interfaces';
import {
  appendCodeChangeEvent,
  checkRoomExists,
  initialiseRoom,
  readEventsForRoom,
} from './event-handler';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CollabSession } from './schema/collab-session.schema';
import { CodeChangeDto, CreateSessionDto } from './dto';
import { OTEngineService } from './ot-engine.service';
import { CollabEventSnapshot } from './schema/collab-event.schema';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    private readonly redisService: RedisService,
    @InjectModel('CollabSession')
    private readonly sessionModel: Model<CollabSession>,
    @InjectModel('CollabEventSnapshot')
    private readonly collabEventSnapshotModel: Model<CollabEventSnapshot>,
    private readonly otEngine: OTEngineService,
  ) {}

  async processCodeChange(data: CodeChangeDto): Promise<void> {
    const event: CodeChangeEvent = {
      eventId: uuidv4(),
      roomId: data.roomId,
      userId: data.userId,
      operationType: data.operationType,
      position: data.position,
      text: data.text,
      version: 1, // Need to decide how to handle versioning
      timestamp: new Date(),
    };
    await appendCodeChangeEvent(event);
  }

  async getCodeChangesForRoom(roomId: string): Promise<CodeChangeEvent[]> {
    return readEventsForRoom(roomId);
  }

  async processAddUserToRoom(roomId: string, userId: string): Promise<void> {
    this.redisService.addUserToRoom(roomId, userId);
    let session = await this.sessionModel.findOne({ roomId }).exec();

    if (!session) {
      session = new this.sessionModel({
        roomId,
        userIds: [userId],
      });
      await session.save();
    } else {
      // If user already exists in the session, do nothing (likely rejoined)
      const userExists = session.userIds.some((id) => id === userId);
      if (!userExists) {
        await this.sessionModel.updateOne(
          { roomId },
          { $addToSet: { userIds: userId } },
        );
      }
    }

    // Event store
    const roomExists = await checkRoomExists(roomId);
    if (!roomExists) {
      await initialiseRoom(roomId);
    }
  }

  async processRemoveUserFromRoom(
    roomId: string,
    userId: string,
  ): Promise<void> {
    this.redisService.removeUserFromRoom(roomId, userId);
  }

  async saveDocumentSnapshot(roomId: string): Promise<void> {
    // Logic to save the document snapshot to MongoDB
    const documentState = await this.reconstructDocumentFromEvents(roomId);
    // Find the snapshot for the room
    const latestSnapshot = await this.collabEventSnapshotModel
      .findOne({ roomId })
      .exec();
    const payload = {
      roomId,
      documentState,
      version: latestSnapshot ? latestSnapshot.version + 1 : 1,
    };
    // If a snapshot already exists, update it
    if (latestSnapshot) {
      await this.collabEventSnapshotModel.updateOne(payload);
    } else {
      // If no snapshot exists, create a new one
      const snapshot = new this.collabEventSnapshotModel(payload);
      await snapshot.save();
    }
    console.log(`Snapshot saved for room ${roomId}`);
  }

  private async reconstructDocumentFromEvents(roomId: string): Promise<string> {
    const events = await readEventsForRoom(roomId);
    let documentState = '';
    for (const event of events) {
      documentState = this.otEngine.applyOperation(documentState, event);
    }
    return documentState;
  }

  async getSessionDetails(sessionId: string): Promise<CollabSession> {
    try {
      const session = await this.sessionModel.findOne({ _id: sessionId }).exec();
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
        questionId: data.question
      });
      await newSession.save();
      return newSession;
    } catch (error) {
      throw new RpcException(`Failed to create session: ${error.message}`);
    }
  }
}
