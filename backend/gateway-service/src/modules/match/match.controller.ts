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
import { RedisService } from './redis.service';
import { MatchRequestDto } from './dto';
import { MATCH_SUCCESS, MATCH_TIMEOUT } from './match.event';

@WebSocketGateway({ namespace: '/match' })
export class MatchGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private userSockets: Map<string, string> = new Map();

  constructor(
    @Inject('MATCHING_SERVICE') private matchingClient: ClientProxy,
    private redisService: RedisService,
  ) {}

  afterInit() {
    // Subscribe to Redis Pub/Sub for match notifications
    this.redisService.subscribeToMatchEvents((matchedUsers) => {
      this.notifyUsersWithMatch(matchedUsers);
    }); 

    this.redisService.subscribeToTimeoutEvents((timedOutUsers) => {
      this.notifyUsersWithTimeout(timedOutUsers);
    });
  }

  @SubscribeMessage('matchRequest')
  async handleRequestMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: MatchRequestDto,
  ) {
    const matchPayload = {
      userId: payload.userId,
      selectedTopic: payload.selectedTopic,
      selectedDifficulty: payload.selectedDifficulty,
    };

    // Send the match request to the microservice
    try {
      await firstValueFrom(this.matchingClient.send('match.request', matchPayload));
    } catch (error) {
      client.emit('matchError', `Error requesting match: ${error.message}`);
      return;
    }
  }

  // Notify both matched users via WebSocket
  notifyUsersWithMatch(matchedUsers: string[]) {
    const [user1, user2] = matchedUsers;
    const user1SocketId = this.getUserSocketId(user1);
    const user2SocketId = this.getUserSocketId(user2);
    if (user1SocketId) {
      this.server.to(user1SocketId).emit(MATCH_SUCCESS, {
        message: `You have been matched with user ${user2}`,
        matchedUserId: user2,
      });
    }

    if (user2SocketId) {
      this.server.to(user2SocketId).emit(MATCH_SUCCESS, {
        message: `You have been matched with user ${user1}`,
        matchedUserId: user1,
      });
    }
  }

  notifyUsersWithTimeout(timedOutUsers: string[]) {
    timedOutUsers.forEach(user => {
      const socketId = this.getUserSocketId(user);
      if (socketId) {
        this.server.to(socketId).emit(MATCH_TIMEOUT, {
          message: `You have been timed out.`,
          timedOutUserId: user,
        });
      }
    });
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      this.userSockets.set(userId as string, client.id);
      console.log(`User ${userId} connected with socket ID ${client.id}`);
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = [...this.userSockets.entries()].find(
      ([, socketId]) => socketId === client.id,
    )?.[0];

    if (userId) {
      this.userSockets.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  getUserSocketId(userId: string): string | undefined {
    return this.userSockets.get(userId);
  }
}
