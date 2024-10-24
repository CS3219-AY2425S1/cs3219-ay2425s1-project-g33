import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'ws';
import * as Y from 'yjs';
import { setupWSConnection } from 'y-websocket/bin/utils';

@WebSocketGateway({
  path: '/yjs',
  cors: {
    origin: '*',
  },
})
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private documents = new Map<string, Y.Doc>();

  handleConnection(client: WebSocket, request: Request) {
    try {
      console.log('Client connected');

      const url = new URL(request.url, 'http://${request.headers.host}');
      const sessionId = url.searchParams.get('sessionId');

      console.log('Session ID:', sessionId);

      if (!sessionId) {
        console.error('No session ID provided');
        client.close(1008, 'No session ID provided');
        return;
      }

      let doc = this.documents.get(sessionId);
      if (!doc) {
        console.log(`Creating a new document for session ID: ${sessionId}`);
        doc = new Y.Doc();
        this.documents.set(sessionId, doc);
      }

      setupWSConnection(client, request, { doc });
    } catch (error) {
      console.error('Error handling connection:', error);
      client.close(1011, 'Internal server error');
    }
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected');
  }
}
