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
import Redis from 'ioredis';

@WebSocketGateway({ namespace: '/session' })
export class CollaborationGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private redisPublisher: Redis;
  private redisSubscriber: Redis;

  constructor() {
    this.redisPublisher = new Redis(); // Publishes operations
    this.redisSubscriber = new Redis(); // Subscribes to transformed operations
  }

  afterInit() {
    // Subscribe to the "operationTransformed" channel
    this.redisSubscriber.subscribe('operationTransformed', (err, count) => {
      if (err) {
        console.error('Error subscribing to channel:', err);
      } else {
        console.log(`Subscribed to ${count} channel(s).`);
      }
    });

    // Handle transformed operations published by the microservice
    this.redisSubscriber.on('message', (channel, message) => {
      const transformedOperation = JSON.parse(message);
      // Emit the transformed operation to all clients in the same session
      this.server
        .to(transformedOperation.sessionId)
        .emit('operationUpdate', transformedOperation);
    });
  }

  // Handle incoming operation
  @SubscribeMessage('submitOperation')
  async handleOperation(
    @MessageBody() operation: any,
    @ConnectedSocket() client: Socket,
  ) {
    // Forward the operation to the microservice for processing
    this.redisPublisher.publish('submitOperation', JSON.stringify(operation));
  }

  // Handle joining a session (client joins a specific coding session)
  @SubscribeMessage('joinSession')
  handleJoinSession(
    @MessageBody('sessionId') sessionId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(sessionId); // Add the client to a room based on sessionId
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
