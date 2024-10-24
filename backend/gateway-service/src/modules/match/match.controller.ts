import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { RedisMatchService } from './redis.service';
import { v4 as uuidv4 } from 'uuid';
import { MatchAcceptDto, MatchDeclineDto, MatchRequestDto } from './dto';
import {
  MATCH_FOUND,
  MATCH_CANCELLED,
  MATCH_CONFIRMED,
  MATCH_TIMEOUT,
  MATCH_REQUESTED,
  MATCH_ACCEPTED,
  MATCH_ERROR,
  EXCEPTION,
  MATCH_DECLINED,
  CONNECTED,
} from './match.event';
import {
  ACCEPT_MATCH,
  CANCEL_MATCH,
  DECLINE_MATCH,
  FIND_MATCH,
} from './match.message';

@WebSocketGateway({
  namespace: '/match',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true,
  },
})
export class MatchGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private userSockets: Map<string, string> = new Map();
  private matchConfirmations: Map<string, Set<string>> = new Map();
  private matchParticipants: Map<string, Set<string>> = new Map();

  constructor(
    @Inject('MATCHING_SERVICE') private matchingClient: ClientProxy,
    @Inject('COLLABORATION_SERVICE') private collaborationClient: ClientProxy,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private redisService: RedisMatchService,
  ) {}

  afterInit() {
    // Subscribe to Redis Pub/Sub for match notifications
    this.redisService.subscribeToMatchEvents(({ matchId, matchedUserIds }) => {
      this.notifyUsersWithMatch(matchId, matchedUserIds);
    });

    this.redisService.subscribeToTimeoutEvents((timedOutUsers) => {
      this.notifyUsersWithTimeout(timedOutUsers);
    });
  }

  @SubscribeMessage(FIND_MATCH)
  async handleRequestMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: MatchRequestDto,
  ) {
    const { userId, selectedTopic, selectedDifficulty } = payload;
    if (
      !userId ||
      !selectedTopic ||
      !selectedDifficulty ||
      selectedTopic.length === 0
    ) {
      client.emit(MATCH_ERROR, 'Invalid match request payload.');
      return;
    }

    if (!this.validateUserId(client, userId)) {
      return;
    }

    try {
      const result = await firstValueFrom(
        this.matchingClient.send('match-request', payload),
      );

      if (result.success) {
        this.server.to(client.id).emit(MATCH_REQUESTED, {
          message: result.message,
        });
      } else {
        client.emit(MATCH_ERROR, result.message);
      }
    } catch (error) {
      client.emit(EXCEPTION, `Error requesting match: ${error.message}`);
      return;
    }
  }

  @SubscribeMessage(CANCEL_MATCH)
  async handleCancelMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string },
  ) {
    const { userId } = payload;
    if (!userId) {
      client.emit(MATCH_ERROR, 'Invalid userId in payload.');
      return;
    }

    if (!this.validateUserId(client, userId)) {
      return;
    }

    try {
      const result = await firstValueFrom(
        this.matchingClient.send('match-cancel', { userId: userId }),
      );

      if (result.success) {
        this.server.to(client.id).emit(MATCH_CANCELLED, {
          message: result.message,
        });
      } else {
        client.emit(MATCH_ERROR, result.message);
      }
    } catch (error) {
      console.log(error);
      client.emit(EXCEPTION, `Error canceling match: ${error.message}`);
      return;
    }
  }

  @SubscribeMessage(ACCEPT_MATCH)
  async handleAcceptMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: MatchAcceptDto,
  ) {
    const { userId, matchId } = payload;

    if (!userId || !matchId) {
      client.emit(MATCH_ERROR, 'Invalid payload.');
      return;
    }

    if (!this.validateUserId(client, userId)) {
      return;
    }

    // Validate if the matchId exists and check if the user is a valid participant
    const participants = this.matchParticipants.get(matchId);
    if (!participants || !participants.has(userId)) {
      client.emit(MATCH_ERROR, 'You are not a participant of this match.');
      return;
    }

    // Check if the user has already accepted the match
    const confirmations = this.matchConfirmations.get(matchId) || new Set();
    if (confirmations.has(userId)) {
      client.emit(MATCH_ERROR, 'You have already accepted this match.');
      return;
    }

    // Add user's confirmation for the match
    confirmations.add(userId);
    this.matchConfirmations.set(matchId, confirmations);

    // Check if both participants have confirmed the match
    if (confirmations.size === 2) {
      const matchDetails = await firstValueFrom(
        this.matchingClient.send('match-details', { matchId }),
      );
      const sessionPayload = {
        userIds: Array.from(participants),
        difficulty: matchDetails.generatedDifficulty,
        topics: matchDetails.generatedTopics,
        question: matchDetails.selectedQuestionId,
      }
      const newSession = await firstValueFrom(
        this.collaborationClient.send('createSession', sessionPayload),
      );
      const sessionId = newSession._id;
      this.notifyUsersMatchConfirmed(sessionId, [...confirmations]);
      // Clean up match participants and confirmations
      this.matchConfirmations.delete(matchId);
      this.matchParticipants.delete(matchId);
    } else {
      client.emit(MATCH_ACCEPTED, {
        message: 'Waiting for the other user to accept the match.',
      });
    }
  }

  @SubscribeMessage(DECLINE_MATCH)
  async handleDeclineMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: MatchDeclineDto,
  ) {
    const { userId, matchId } = payload;

    if (!userId || !matchId) {
      client.emit(MATCH_ERROR, 'Invalid payload.');
      return;
    }

    if (!this.validateUserId(client, userId)) {
      return;
    }

    // Validate if the matchId exists and check if the user is a valid participant
    const participants = this.matchParticipants.get(matchId);
    if (!participants || !participants.has(userId)) {
      client.emit(MATCH_ERROR, 'You are not a participant of this match.');
      return;
    }

    // Notify the other user that the match has been declined
    this.notifyOtherUserMatchDeclined(matchId, userId);

    // Remove match-related data
    this.matchParticipants.delete(matchId);
    this.matchConfirmations.delete(matchId);
    client.emit(MATCH_DECLINED, {
      message: 'You have declined the match.',
      isDecliningUser: true,
    });
  }

  // Notify both users when they are matched
  async notifyUsersWithMatch(matchId: string, matchedUsers: string[]) {
    const [user1, user2] = matchedUsers;
    const user1SocketId = this.getUserSocketId(user1);
    const user2SocketId = this.getUserSocketId(user2);

    const user1Details = await firstValueFrom(
      this.userClient.send({ cmd: 'get-user-by-id' }, user1),
    );

    const user2Details = await firstValueFrom(
      this.userClient.send({ cmd: 'get-user-by-id' }, user2),
    );

    if (user1SocketId && user2SocketId) {
      this.server.to(user1SocketId).emit(MATCH_FOUND, {
        message: `You have found a match`,
        matchId,
        matchUserId: user2,
        matchUsername: user2Details.username,
      });
      this.server.to(user2SocketId).emit(MATCH_FOUND, {
        message: `You have found a match`,
        matchId,
        matchUserId: user1,
        matchUsername: user1Details.username,
      });

      // Store participants for this matchId
      this.matchParticipants.set(matchId, new Set([user1, user2]));
    }
  }

  // Notify both users when they both accept the match
  private notifyUsersMatchConfirmed(sessionId: string, users: string[]) {
    users.forEach((user) => {
      const socketId = this.getUserSocketId(user);
      if (socketId) {
        this.server.to(socketId).emit(MATCH_CONFIRMED, {
          message: `Match confirmed! New session created.`,
          sessionId,
        });
      }
    });
  }

  private notifyOtherUserMatchDeclined(
    matchId: string,
    decliningUserId: string,
  ) {
    const participants = this.matchParticipants.get(matchId);
    participants?.forEach((participantId) => {
      if (participantId !== decliningUserId) {
        const socketId = this.getUserSocketId(participantId);
        if (socketId) {
          this.server.to(socketId).emit(MATCH_DECLINED, {
            message: 'The other user has declined the match.',
            isDecliningUser: false,
          });
        }
      }
    });
  }

  private notifyUsersWithTimeout(timedOutUsers: string[]) {
    timedOutUsers.forEach((user) => {
      const socketId = this.getUserSocketId(user);
      if (socketId) {
        this.server.to(socketId).emit(MATCH_TIMEOUT, {
          message: `You have been timed out.`,
          timedOutUserId: user,
        });
      }
    });
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (!userId) {
      this.emitExceptionAndDisconnect(client, 'Invalid userId.');
      return;
    }

    try {
      // Check if user is already connected
      const existingSocketId = this.userSockets.get(userId);
      if (existingSocketId && existingSocketId !== client.id) {
        this.emitExceptionAndDisconnect(
          client,
          `User ${userId} is already connected with socket ID ${existingSocketId}`,
        );
        return;
      }

      // Check if valid user exists in database
      const existingUser = await firstValueFrom(
        this.userClient.send({ cmd: 'get-user-by-id' }, userId),
      );

      if (!existingUser) {
        this.emitExceptionAndDisconnect(client, `User ${userId} not found.`);
        return;
      }

      this.userSockets.set(userId, client.id);

      client.emit(CONNECTED, {
        message: `User ${userId} connected with socket ID ${client.id}`,
      });
      console.log(`User ${userId} connected with socket ID ${client.id}`);
    } catch (error) {
      this.emitExceptionAndDisconnect(client, error.message);
      return;
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = [...this.userSockets.entries()].find(
      ([, socketId]) => socketId === client.id,
    )?.[0];

    if (!userId) {
      this.emitExceptionAndDisconnect(
        client,
        'User not found in userSockets at disconnect.',
      );
      return;
    }

    try {
      // Remove user from Redis pool
      const result = await firstValueFrom(
        this.matchingClient.send('match-cancel', { userId }),
      );

      if (result.success) {
        console.log(`Match auto cancelled user ${userId} at disconnect`);
      } else {
        console.log(`No match cancelled: ${result.message}`);
      }

      // Remove user from matchParticipants and matchConfirmations
      let matchIdToRemove: string | null = null;

      this.matchParticipants.forEach((participants, matchId) => {
        if (participants.has(userId)) {
          this.notifyOtherUserMatchDeclined(matchId, userId);
          matchIdToRemove = matchId;
        }
      });

      if (matchIdToRemove) {
        this.matchParticipants.delete(matchIdToRemove);
        this.matchConfirmations.delete(matchIdToRemove);
      }

      // Remove user from userSockets
      this.userSockets.delete(userId);
      console.log(`User ${userId} disconnected and removed from userSockets.`);
    } catch (error) {
      client.emit(
        EXCEPTION,
        `Error disconnecting user ${userId}: ${error.message}`,
      );
    }
  }

  private getUserSocketId(userId: string): string | undefined {
    return this.userSockets.get(userId);
  }

  private generateMatchId(): string {
    return uuidv4();
  }

  // TODO - to be replaced with colab method in the future
  private generateSessionId(): string {
    return uuidv4();
  }

  private emitExceptionAndDisconnect(client: Socket, message: string) {
    client.emit(EXCEPTION, `Error: ${message}`);
    client.disconnect();
  }

  // Method to validate the userId associated with the current socket
  private validateUserId(client: Socket, userId: string): boolean {
    const storedUserId = [...this.userSockets.entries()].find(
      ([, socketId]) => socketId === client.id,
    )?.[0];
    if (!storedUserId || storedUserId !== userId) {
      client.emit(EXCEPTION, 'UserId does not match the current socket.');
      return false;
    }
    return true;
  }
}
