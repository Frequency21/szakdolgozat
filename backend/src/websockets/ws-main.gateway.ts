import { Inject, Logger, UseGuards } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
   MessageBody,
   OnGatewayConnection,
   OnGatewayDisconnect,
   SubscribeMessage,
   WebSocketGateway,
   WebSocketServer,
} from '@nestjs/websockets';
import { env } from 'process';
import { Server } from 'socket.io';
import { WsCookieAuthGuard } from 'src/auth/guards/ws-cookie-auth.guard';
import { SocketAuth } from 'src/auth/types/socket-auth.type';
import { SessionStore, SESSION_STORE } from 'src/config/redis/redis.const';
import {
   CreatedProductPayload,
   CREATED_PRODUCT_EVENT,
} from 'src/events/created-product.event';
import { LogoutPayload, LOGOUT_EVENT } from 'src/events/logout.event';
import {
   SentMessagePayload,
   SENT_MESSAGE_EVENT,
} from 'src/events/sent-message.event';
import { MessageService } from 'src/message/message.service';
import { NotificationService } from 'src/notification/notification.service';
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
})
export class WsMainGateway implements OnGatewayConnection, OnGatewayDisconnect {
   private readonly logger = new Logger(WsMainGateway.name);

   @WebSocketServer()
   server!: Server;

   constructor(
      @Inject(SESSION_STORE) private sessionStore: SessionStore,
      private messageService: MessageService,
      private notificationService: NotificationService,
   ) {}

   handleConnection(socket: SocketAuth, ...args: any[]) {
      socket.join('' + socket.userId);
      this.logger.debug(`join socket to userId ${socket.userId}`);
      this.messageService.getPartners(socket.userId).then((partners) => {
         socket.emit('partners', partners);
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

   @OnEvent(CREATED_PRODUCT_EVENT)
   async handleCreatedProduct(payload: CreatedProductPayload) {
      const {
         userIdNotificationIdPair,
         product: {
            id: productId,
            name,
            price,
            pictures: [picture],
         },
      } = await this.notificationService.findAllSubscriber(payload);

      for (const [userId, notificationId] of userIdNotificationIdPair) {
         this.server.in(userId).emit('new product', {
            id: notificationId,
            productId,
            name,
            price,
            picture,
         });
      }
   }

   @UseGuards(WsCookieAuthGuard)
   @SubscribeMessage('seen messages')
   readMessages(@WsUser() user: User, @MessageBody() partnerId: number) {
      this.messageService.seenMessages(user.id, partnerId);
   }

   @UseGuards(WsCookieAuthGuard)
   @SubscribeMessage('seen notification')
   async seenNotification(@MessageBody() notificationId: number) {
      const { affected } = await this.notificationService.seenNotification(
         notificationId,
      );
      this.logger.debug(
         `seen notification ${notificationId} affected rows ${affected}`,
      );
      return {
         event: 'seen notification',
         data: { success: !!affected, notificationId },
      };
   }

   @UseGuards(WsCookieAuthGuard)
   @SubscribeMessage('partners')
   async refreshPartners(@WsUser() user: User) {
      const partners = await this.messageService.getPartners(user.id);
      return {
         event: 'partners',
         data: partners,
      };
   }

   // példa a session és passport user elérésére
   // @UseGuards(WsCookieAuthGuard)
   // @SubscribeMessage('events')
   // findAll(
   //    @WsSession() session: Record<string, any>,
   //    @WsUser() user: User,
   // ): Observable<WsResponse<number>> {
   //    console.log('session', session);
   //    console.log('user', user);
   //    return from([1, 2, 3]).pipe(
   //       concatMap((v) => of(v).pipe(delay(2000))),
   //       map((item) => ({ event: 'events', data: item })),
   //    );
   // }
}
