/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FilesService } from '../files/files.service';
import { JwtService } from '@nestjs/jwt';
import * as Y from 'yjs';

// Define the payload structure for JWT tokens
interface JwtPayload {
  id: string;
  email: string;
}

// Define custom socket type with properly typed data
interface TypedSocket extends Socket {
  data: {
    user?: JwtPayload;
  };
}

interface DocumentRoom {
  fileId: string;
  doc: Y.Doc;
  users: Set<string>;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CollaborationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private documents = new Map<string, DocumentRoom>();

  constructor(
    private readonly filesService: FilesService,
    private readonly jwtService: JwtService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async handleConnection(client: TypedSocket) {
    try {
      const token =
        (client.handshake.auth.token as string) ||
        (client.handshake.headers.authorization?.split(' ')[1] as string);

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);

      client.data.user = payload;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _error = error;
      client.disconnect();
    }
  }

  handleDisconnect(client: TypedSocket) {
    // Remove user from all document rooms they're in
    this.documents.forEach((room, fileId) => {
      if (client.data.user && room.users.has(client.data.user.id)) {
        room.users.delete(client.data.user.id);
        void client.leave(fileId);

        // Notify others that user has left
        this.server.to(fileId).emit('user-disconnected', {
          userId: client.data.user.id,
          email: client.data.user.email,
        });
      }
    });
  }

  @SubscribeMessage('join-document')
  async handleJoinDocument(client: TypedSocket, fileId: string) {
    try {
      if (!client.data.user) {
        return { error: 'Unauthorized' };
      }

      // Check if user has access to this file
      try {
        await this.filesService.getFileById(client.data.user.id, fileId);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _error = error;
        return { error: 'Access denied to this document' };
      }

      // Create a document room if it doesn't exist
      if (!this.documents.has(fileId)) {
        const doc = new Y.Doc();
        this.documents.set(fileId, {
          fileId,
          doc,
          users: new Set<string>(),
        });
      }

      const room = this.documents.get(fileId)!; // Use non-null assertion
      room.users.add(client.data.user.id);

      // Join the socket.io room
      void client.join(fileId);

      // Notify others that a new user has joined
      void client.to(fileId).emit('user-connected', {
        userId: client.data.user.id,
        email: client.data.user.email,
      });

      // Get all current users in the document
      const users = Array.from(room.users).map((userId) => {
        return { userId };
      });

      return {
        success: true,
        users,
        // Send the current document state encoded
        document: Y.encodeStateAsUpdate(room.doc),
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _error = error;
      return { error: 'Failed to join document' };
    }
  }

  @SubscribeMessage('sync-update')
  handleSyncUpdate(
    client: TypedSocket,
    payload: { fileId: string; update: Uint8Array },
  ) {
    try {
      if (!client.data.user) {
        return { error: 'Unauthorized' };
      }

      const { fileId, update } = payload;
      const room = this.documents.get(fileId);

      if (!room) {
        return { error: 'Document not found' };
      }

      // Apply the update to the document
      Y.applyUpdate(room.doc, update);

      // Broadcast the update to all other clients in the room
      void client.to(fileId).emit('update', {
        update,
        userId: client.data.user.id,
      });

      return { success: true };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _error = error;
      return { error: 'Failed to sync update' };
    }
  }
}
