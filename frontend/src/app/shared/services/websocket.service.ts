import { Injectable, NgZone } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { AuthService } from 'src/app/auth/auth.service';

export type Partner = { id: number; name: string; picture: string };

export type IncomingMessage = {
   text: string;
   from: number;
};

@Injectable({
   providedIn: 'root',
})
export class WebsocketService {
   private mainSocket = io('/messages', {
      withCredentials: true,
      autoConnect: false,
   });

   private message$$ = new Subject<IncomingMessage>();
   private partners$$ = new ReplaySubject<Partner[]>(1);
   partners$ = this.partners$$.pipe();
   incomingMessage$ = this.message$$.pipe();

   constructor(private ngZone: NgZone, private auth: AuthService) {
      this.ngZone.runOutsideAngular(() => {
         this.auth.user$.subscribe(user => {
            if (user) {
               this.connect(user.id);
            }
         });
      });

      this.mainSocket.on('connect', () => {
         console.log('Main socket connected');
      });

      this.mainSocket.on('exception', function (data) {
         console.log('event', data);
      });

      this.mainSocket.on('disconnect', function () {
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

      this.mainSocket.on('offline', data => {
         console.log('offline', data);
      });

      this.mainSocket.onAny((event, ...args) => {
         console.debug(event, args);
      });
   }

   private connect(userId: number) {
      if (this.mainSocket.connected) {
         return;
      }
      this.mainSocket.auth = cb => {
         cb({ userId });
      };
      this.mainSocket.connect();
   }
}
