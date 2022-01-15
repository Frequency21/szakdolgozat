import {
   HttpErrorResponse,
   HttpEvent,
   HttpHandler,
   HttpInterceptor,
   HttpRequest,
   HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
   constructor(
      private auth: AuthService,
      private messageService: MessageService,
   ) {}

   intercept(
      request: HttpRequest<unknown>,
      next: HttpHandler,
   ): Observable<HttpEvent<unknown>> {
      return next.handle(request).pipe(
         tap({
            error: (req: HttpErrorResponse) => {
               console.log(req);
               if (req.status === HttpStatusCode.Unauthorized) {
                  if (this.auth.loggedIn.value) {
                     this.messageService.add({
                        key: 'app',
                        data: [
                           'A rendszer automatikusan kijelentkeztetett!',
                           'Kérlek jelentkezz be újra',
                        ],
                        severity: 'warn',
                        sticky: true,
                     });
                  }
                  this.auth.loggedIn.next(false);
               }
            },
         }),
      );
   }
}
