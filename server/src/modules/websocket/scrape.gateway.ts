import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'scrape', cors: { origin: '*' } })
export class ScrapeGateway {
  @WebSocketServer()
  server: Server;
  notifyScrapeFinished(
    payload: { collectionName: string; count?: number; cardNumber?: string },
    socketId?: string,
  ) {
    try {
      if (socketId) {
        // emit only to the socket that initiated the request
        this.server?.to(socketId).emit('scrapeFinished', payload);
      }
    } catch (e) {
      // swallow to avoid crashing the service if sockets not initialized
    }
  }
}
