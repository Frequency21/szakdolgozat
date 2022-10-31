import { Inject, Logger, UseGuards } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
   MessageBody,
   OnGatewayConnection,
   SubscribeMessage,
   WebSocketGateway,
   WebSocketServer,
   WsResponse,
} from '@nestjs/websockets';
import { User } from 'aws-sdk/clients/appstream';
import { env } from 'process';
import { from, Observable, of } from 'rxjs';
import { concatMap, delay, map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { WsCookieAuthGuard } from 'src/auth/guards/ws-cookie-auth.guard';
import { SessionStore, SESSION_STORE } from 'src/config/redis/redis.const';
import { MessageService } from 'src/message/message.service';
import { WsSession } from 'src/shared/decorators/ws-session.decorators';
import { WsUser } from 'src/shared/decorators/ws-user.decorator';

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
export class WsMessagesGateway implements OnGatewayConnection {
   private readonly logger = new Logger(WsMessagesGateway.name);

   @WebSocketServer()
   server!: Server;

   constructor(
      @Inject(SESSION_STORE) private sessionStore: SessionStore,
      private messageService: MessageService,
   ) {}

   handleConnection(socket: any, ...args: any[]) {
      // access data accross client.request.user and client.request.session
      this.logger.debug(`join socket to session id ${socket.sessionId}`);
      socket.join(socket.sessionId);
      socket.request.session.online = true;
      socket.request.session.save((err) => {
         if (err) {
            this.logger.error(
               `error during session save ${JSON.stringify(err)}`,
            );
         }
         this.logger.debug(
            `saved session ${JSON.stringify(socket.request.session)}`,
         );
      });
   }

   @OnEvent('authentication.logout')
   handleLogout(payload: any) {
      this.logger.debug(
         `handling logout with payload ${JSON.stringify(payload)}`,
      );
      this.server.to(payload.sessionId).disconnectSockets();
      this.sessionStore.get(payload.sessionId, (err, session: any) => {
         if (err) {
            this.logger.debug(
               `error while fetching session with session id ${JSON.stringify(
                  payload.sessionId,
               )}`,
            );
            return;
         }
         this.logger.debug(`got session ${JSON.stringify(session)}`);
         session.online = false;
         session.save((err) => {
            if (err) {
               this.logger.debug(`error during session save`);
               return;
            }
            this.logger.debug(`saved session ${JSON.stringify(session)}`);
         });
      });

      this.sessionStore.all?.((err, sessions) => {
         this.logger.debug(`All sessions: ${JSON.stringify(sessions)}`);
      });
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
