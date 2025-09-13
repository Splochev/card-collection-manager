import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'card-manager', cors: { origin: '*' } })
export class ScrapeGateway {
  @WebSocketServer()
  server: Server;
  notifySearchFinished(
    payload: {
      collectionName: string;
      count?: number;
      cardSetCode?: string;
    },
    socketId?: string,
  ) {
    try {
      if (socketId) {
        this.server?.to(socketId).emit('searchCardSetFinished', payload);
      }
    } catch (e) {
      // swallow to avoid crashing the service if sockets not initialized
    }
  }
}
