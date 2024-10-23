import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { RedisCollaborationService } from './redis.service';
import * as Y from 'yjs';

@WebSocketGateway({
  namespace: '/collaboration',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true,
  },
})
export class YjsCollaborationGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(
    @Inject('COLLABORATION_SERVICE') private collaborationClient: ClientProxy,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private redisService: RedisCollaborationService,
  ) {}

  afterInit() {
    // Subscribe to Redis Pub/Sub for collaboration notifications
    this.redisService.subscribeToCollaborationEvents((matchedUsers) => {
      {
      }
    });

    this.server.on('connectYjsWs', (ws: any, req) => {
      const userId = req.url
        .split('?')[1]
        ?.split('&')
        .find((param) => param.startsWith('userId='))
        ?.split('=')[1];
      const roomId = req.url
        .split('?')[1]
        ?.split('&')
        .find((param) => param.startsWith('roomId='))
        ?.split('=')[1];

      if (!userId || !roomId) {
        ws.close(1000, 'Invalid user or room ID');
        return;
      }

      console.log(`User ${userId} connected to room ${roomId}`);
      const ydoc = new Y.Doc(); // Create a new Y.Doc (or fetch it from persistence if needed)

      ws.on('message', (message: Uint8Array) => {
        // Apply the received update to the document
        Y.applyUpdate(ydoc, new Uint8Array(message));

        // Broadcast the update to other connected clients
        this.server.clients.forEach((client) => {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send(message);
          }
        });
      });

      // Send the current document state to the connected client
      const initialState = Y.encodeStateAsUpdate(ydoc);
      ws.send(initialState);
    });
  }
}
