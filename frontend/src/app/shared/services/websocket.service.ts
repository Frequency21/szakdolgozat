import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { AuthService } from 'src/app/auth/auth.service';
import { Notification } from 'src/app/models/notification.model';

export type Partner = {
   id: number;
   name: string;
   picture: string;
   unseenMessages: number;
};

export type IncomingMessage = {
   text: string;
   from: number;
};

@Injectable({
   providedIn: 'root',
})
export class WebsocketService {
   private mainSocket = io({
      withCredentials: true,
      autoConnect: false,
   });

   private message$$ = new Subject<IncomingMessage>();
   private partners$$ = new ReplaySubject<Partner[]>(1);

   private notifications$$ = new BehaviorSubject<Notification[]>([]);
   notifications$ = this.notifications$$.pipe();

   partners$ = this.partners$$.pipe();
   incomingMessage$ = this.message$$.pipe();

   constructor(private ngZone: NgZone, private auth: AuthService) {
      this.ngZone.runOutsideAngular(() => {
         this.auth.user$.subscribe(user => {
            this.notifications$$.next(user?.notifications ?? []);
            if (user) {
               this.connect();
            }
         });
      });

      this.mainSocket.on('new product', (notification: Notification) => {
         const notis = this.notifications$$.value;
         if (notis.find(n => n.id === notification.id)) return;

         this.notifications$$.next([notification, ...notis]);
      });

      this.mainSocket.on('connect', () => {
         console.log('Main socket connected');
      });

      this.mainSocket.on('exception', data => {
         console.log('event', data);
      });

      this.mainSocket.on('disconnect', () => {
         console.log('Disconnected');
      });

      // a userId-jű user online státuszú lett
      this.mainSocket.on('online', userId => {
         console.log('online', userId);
      });

      this.mainSocket.on('partners', partners => {
         console.log('partners', partners);
         this.partners$$.next(partners);
      });

      this.mainSocket.on('got message', message => {
         console.log('Got message', message);
         this.message$$.next(message);
      });

      this.mainSocket.on(
         'seen notification',
         ({
            success,
            notificationId,
         }: {
            success: boolean;
            notificationId: number;
         }) => {
            if (!success) return;
            this.notifications$$.next(
               this.notifications$$.value.flatMap(n =>
                  n.id === notificationId ? [] : [n],
               ),
            );
         },
      );

      this.mainSocket.on('offline', data => {
         console.log('offline', data);
      });

      this.mainSocket.onAny((event, ...args) => {
         console.debug(event, args);
      });
   }

   seenMessages(partnerId: number) {
      this.mainSocket.emit('seen messages', partnerId);
   }

   seenNotification(notificationId: number) {
      this.mainSocket.emit('seen notification', notificationId);
   }

   refreshPartners() {
      this.mainSocket.emit('partners');
   }

   private connect() {
      if (this.mainSocket.connected) {
         return;
      }
      this.mainSocket.connect();
   }
}
