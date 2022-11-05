import { Inject, Logger, UseGuards } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
   MessageBody,
   OnGatewayConnection,
   OnGatewayDisconnect,
   SubscribeMessage,
   WebSocketGateway,
   WebSocketServer,
   WsResponse,
} from '@nestjs/websockets';
import { env } from 'process';
import { from, Observable, of } from 'rxjs';
import { concatMap, delay, map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { LogoutPayload, LOGOUT_EVENT } from 'src/auth/auth.service';
import { WsCookieAuthGuard } from 'src/auth/guards/ws-cookie-auth.guard';
import { SocketAuth } from 'src/auth/types/socket-auth.type';
import { SessionStore, SESSION_STORE } from 'src/config/redis/redis.const';
import {
   SentMessagePayload,
   SENT_MESSAGE_EVENT,
} from 'src/message/message.controller';
import { MessageService } from 'src/message/message.service';
import { WsSession } from 'src/shared/decorators/ws-session.decorators';
import { WsUser } from 'src/shared/decorators/ws-user.decorator';
import { User } from 'src/user/entities/user.entity';

// REFERENCIA: https://stackoverflow.com/a/74253785/19302002
@WebSocketGateway({
   cors: {
      origin:
         env.NODE_ENV === 'production'
            ? 'https://deep-market.herokuapp.com'
            : 'http://localhost:4200',
      credentials: true,
   },
   namespace: 'messages',
})
export class WsMessagesGateway
   implements OnGatewayConnection, OnGatewayDisconnect
{
   private readonly logger = new Logger(WsMessagesGateway.name);

   @WebSocketServer()
   server!: Server;

   constructor(
      @Inject(SESSION_STORE) private sessionStore: SessionStore,
      private messageService: MessageService,
   ) {}

   handleConnection(socket: SocketAuth, ...args: any[]) {
      socket.join('' + socket.userId);
      this.logger.debug(`join socket to userId ${socket.userId}`);
      this.messageService.getPartners(socket.userId).then((partnerIds) => {
         socket.emit('partners', partnerIds);
         this.server.emit('online', socket.userId);
      });
   }

   handleDisconnect(socket: SocketAuth) {
      if (!socket.userId) return;
      const userId = '' + socket.userId;
      this.server
         .in(userId)
         .fetchSockets()
         .then((sockets) => {
            if (sockets.length !== 0) return;
            socket.broadcast.emit('offline', userId);
         });
   }

   @OnEvent(LOGOUT_EVENT)
   handleLogout(payload: LogoutPayload) {
      if (payload.userId === undefined) {
         return;
      }
      this.server.in('' + payload.userId).disconnectSockets();
   }

   @OnEvent(SENT_MESSAGE_EVENT)
   handleSentMessage(payload: SentMessagePayload) {
      this.logger.debug(`handle sent message event ${JSON.stringify(payload)}`);
      this.server
         .in('' + payload.to)
         .emit('got message', { text: payload.text, from: payload.from });
   }

   @UseGuards(WsCookieAuthGuard)
   @SubscribeMessage('events')
   findAll(
      @WsSession() session: Record<string, any>,
      @WsUser() user: User,
   ): Observable<WsResponse<number>> {
      return from([1, 2, 3]).pipe(
         concatMap((v) => of(v).pipe(delay(2000))),
         map((item) => ({ event: 'events', data: item })),
      );
   }

   @SubscribeMessage('identity')
   async identity(@MessageBody() data: number): Promise<number> {
      return data;
   }
}
