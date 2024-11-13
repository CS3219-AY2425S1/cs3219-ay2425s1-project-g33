import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'ws';
import * as Y from 'yjs';
import { setupWSConnection, setPersistence } from 'y-websocket/bin/utils';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { config } from './configs';
import { MongodbPersistence } from 'y-mongodb-provider';

@WebSocketGateway({
  path: '/yjs',
  cors: {
    origin: '*',
  },
})
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @Inject('COLLABORATION_SERVICE')
    private readonly collaborationClient: ClientProxy,
  ) {}

  async handleConnection(client: WebSocket, request: Request) {
    try {
      console.log('New connection:', request.url);
      const url = new URL(request.url, 'http://${request.headers.host}');
      const sessionId = url.searchParams.get('sessionId');
      const userIdParam = url.searchParams.get('userId');

      if (!userIdParam || !userIdParam.includes('/')) {
        console.error('Invalid user ID parameter');
        client.close(1008, 'Invalid user ID parameter');
        return;
      }

      const [userId, roomId] = userIdParam.split('/');

      if (!sessionId) {
        console.error('No session ID provided');
        client.close(1008, 'No session ID provided');
        return;
      }

      if (!userId) {
        console.error('No user ID provided');
        client.close(1008, 'No user ID provided');
        return;
      }

      console.log(
        'Session ID:',
        sessionId,
        'User ID:',
        userId,
        'Room ID:',
        roomId,
      );

      setupWSConnection(client, request, { docName: roomId, gc: true });

      const sessionDetails = await this.validateSessionDetails(
        sessionId,
        userId,
      );
      if (!sessionDetails.isValid) {
        console.error(sessionDetails.message);
        client.close(1008, sessionDetails.message);
        return;
      }

      this.setupPersistence(roomId);

      client.send(`Connected to y-websocket via session: ${sessionId}`);
    } catch (error) {
      console.error('Error handling connection:', error);
      client.close(1011, 'Internal server error');
    }
  }

  handleDisconnect(client: any) {
    client.close('Connection closed');
  }

  private async validateSessionDetails(sessionId: string, userId: string) {
    try {
      const payload = { id: sessionId };
      const sessionDetails = await firstValueFrom(
        this.collaborationClient.send(
          { cmd: 'get-session-details-by-id' },
          payload,
        ),
      );

      if (!sessionDetails || !sessionDetails.userIds.includes(userId)) {
        return {
          isValid: false,
          message:
            'Invalid session or the user is not a participant of the session',
        };
      }

      if (sessionDetails.status !== 'active') {
        return {
          isValid: false,
          message: 'Session is not currently active',
        };
      }

      return {
        isValid: true,
        message: 'Session details are validated',
      };
    } catch (error) {
      return {
        isValid: false,
        message: 'Error validating session details',
      };
    }
  }

  private setupPersistence(docName: string) {
    const mongoPersistence = new MongodbPersistence(
      config.mongo.connectionString,
      {
        collectionName: 'yjs-documents',
        flushSize: 100,
        multipleCollections: false,
      },
    );

    setPersistence({
      bindState: async (docName, ydoc) => {
        const persistedYdoc = await mongoPersistence.getYDoc(docName);
        const persistedStateVector = Y.encodeStateVector(persistedYdoc);

        const diff = Y.encodeStateAsUpdate(ydoc, persistedStateVector);
        if (
          diff.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          ) > 0
        ) {
          mongoPersistence.storeUpdate(docName, diff);
        }

        Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
        ydoc.on('update', async (update) => {
          mongoPersistence.storeUpdate(docName, update);
        });

        persistedYdoc.destroy();
      },
      writeState: async (docName, ydoc) => {
        await mongoPersistence.flushDocument(docName);
      },
    });
  }
}
