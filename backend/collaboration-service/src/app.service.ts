import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from './redis.service';
import { Operation } from './interfaces/operation.interface';
import { Session } from './schema/session.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Session') private readonly sessionModel: Model<Session>,
    private redisService: RedisService,
    private eventEmitter: EventEmitter2,
  ) {
    this.setupRedisSubscription();
  }

  private setupRedisSubscription() {
    this.redisService.subscribe('sessionUpdate', (sessionId) => {
      this.eventEmitter.emit('updateDb', sessionId);
    });
  }

  async handleOperation(
    sessionId: string,
    operation: Operation,
  ): Promise<Operation> {
    const session = await this.redisService.get(sessionId);

    // Apply Operational Transformation for any pending remote operations
    for (const pastOp of session.history) {
      operation = this.transform(operation, pastOp);
    }

    // Apply the transformed operation to the document
    session.document = this.applyOperation(operation, session.document);

    // Update the session history
    session.history.push(operation);

    // Save updated session back to Redis
    await this.redisService.set(sessionId, session);

    return operation; // Return the transformed operation for broadcasting
  }

  applyOperation(operation: Operation, document: string): string {
    if (operation.type === 'insert') {
      document =
        document.slice(0, operation.position) +
        operation.text +
        document.slice(operation.position);
    } else if (operation.type === 'delete') {
      document =
        document.slice(0, operation.position) +
        document.slice(operation.position + operation.length);
    }
    return document;
  }

  transform(opA: Operation, opB: Operation): Operation {
    if (opA.type === 'insert' && opB.type === 'insert') {
      if (opA.position <= opB.position) {
        opB.position += opA.text.length;
      } else {
        opA.position += opB.text.length;
      }
    } else if (opA.type === 'delete' && opB.type === 'delete') {
      if (opA.position < opB.position) {
        opB.position -= opA.length;
      } else {
        opA.position -= opB.length;
      }
    } else if (opA.type === 'insert' && opB.type === 'delete') {
      if (opA.position <= opB.position) {
        opB.position += opA.text.length;
      }
    } else if (opA.type === 'delete' && opB.type === 'insert') {
      if (opA.position >= opB.position) {
        opA.position += opB.text.length;
      }
    }
    return opA;
  }

  // Event listener for MongoDB update
  @OnEvent('updateDb')
  async updateMongoDB(sessionId: string) {
    const session = await this.redisService.get(sessionId);
    if (session) {
      await this.sessionModel.findOneAndUpdate(
        { sessionId },
        {
          $set: { document: session.document },
          $push: { history: { $each: session.history } },
        },
        { upsert: true, new: true },
      );

      session.history = [];
      await this.redisService.set(sessionId, session);
    }
  }
}
