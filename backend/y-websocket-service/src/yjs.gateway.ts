import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'ws';
import * as Y from 'yjs';
import { setupWSConnection } from 'y-websocket/bin/utils';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@WebSocketGateway({
  path: '/yjs',
  cors: {
    origin: '*',
  },
})
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private documents = new Map<string, Y.Doc>();

  constructor(
    @Inject('COLLABORATION_SERVICE')
    private readonly collaborationClient: ClientProxy,
  ) {}

  async handleConnection(client: WebSocket, request: Request) {
    try {
      const url = new URL(request.url, 'http://${request.headers.host}');
      const sessionId = url.searchParams.get('sessionId');
      const userId = url.searchParams.get('userId');

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

      console.log('Session ID:', sessionId, 'User ID:', userId);

      const sessionDetails = await this.validateSessionDetails(
        sessionId,
        userId,
      );
      if (!sessionDetails.isValid) {
        console.error(sessionDetails.message);
        client.close(1008, sessionDetails.message);
        return;
      }

      let doc = this.documents.get(sessionId);
      if (!doc) {
        console.log(`Creating a new document for session ID: ${sessionId}`);
        doc = new Y.Doc();
        this.documents.set(sessionId, doc);
      }

      setupWSConnection(client, request, { doc });

      client.send(`Connected to y-websocket via session: ${sessionId}`);
    } catch (error) {
      console.error('Error handling connection:', error);
      client.close(1011, 'Internal server error');
    }
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected');
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
}
