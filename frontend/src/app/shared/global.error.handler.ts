import {
   ApplicationRef,
   ErrorHandler,
   Injectable,
   Injector,
} from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
   constructor(private injector: Injector) {}

   handleError(error: any): void {
      console.error(error);
      this.injector.get(MessageService).add({
         key: 'app',
         summary: 'error',
         data: [error.error.message],
         severity: 'error',
         life: 5000,
      });
      this.injector.get(ApplicationRef).tick();
   }
}
