import { Injectable, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
   providedIn: 'root',
})
export class WebsocketService {
   private mainSocket?: Socket;

   constructor(private ngZone: NgZone) {
      this.ngZone.runOutsideAngular(() => {
         this.connect();
      });
   }

   connect() {
      if (this.mainSocket) {
         this.mainSocket.disconnect();
      }
      this.mainSocket = io('/api/messages', {
         withCredentials: true,
      });

      this.mainSocket.onAny((event, ...args) => {
         console.debug(event, args);
      });

      this.mainSocket.on('connect', () => {
         console.log('Main socket connected');
         this.mainSocket?.emit('events', { test: 'test' });
         this.mainSocket?.emit('identity', 0, (response: any) =>
            console.log('Identity:', response),
         );
      });
      this.mainSocket.on('events', data => {
         this.ngZone.run(() => {
            console.log('event', data);
         });
      });
      this.mainSocket.on('exception', function (data) {
         console.log('event', data);
      });
      this.mainSocket.on('disconnect', function () {
         console.log('Disconnected');
      });
   }
}
