import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
   constructor(private injector: Injector) {}

   handleError(error: any): void {
      this.injector.get(NgZone).run(() => {
         console.error(error);
         this.injector.get(MessageService).add({
            key: 'app',
            summary: 'error',
            data: [error?.error?.message ?? error],
            severity: 'error',
            sticky: true,
         });
      });
   }
}
