import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import * as Y from 'yjs';
import { Server, WebSocket } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';

const documents = new Map<string, Y.Doc>();

@WebSocketGateway({
  path: '/yjs',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true,
  },
})
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(connection: WebSocket, request: any) {
    try {
      console.log('Client connected:', connection);

      // Parse room ID from the URL or use a default
      const url = new URL(request.url, `http://${request.headers.host}`);
      const roomId = url.searchParams.get('roomId') || 'default-room';

      // Retrieve or create a Yjs document for this room
      let doc = documents.get(roomId);
      if (!doc) {
        doc = new Y.Doc();
        documents.set(roomId, doc);
      }

      // Set up the Yjs WebSocket connection
      setupWSConnection(connection, request, { doc });

      // Optional: Handle WebSocket errors for better diagnostics
      connection.on('error', (err) => {
        console.error('WebSocket connection error:', err);
      });

      // Listen for connection close event
      connection.on('close', () => {
        console.log(`Connection to room ${roomId} closed`);
      });
    } catch (error) {
      console.error('Error handling connection:', error);
      connection.close(1011, 'Internal server error'); // Close with a meaningful code
    }
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected:', client);
  }
}
