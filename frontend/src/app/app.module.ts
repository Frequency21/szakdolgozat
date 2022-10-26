import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { GlobalErrorHandler } from './shared/global.error.handler';
import { SharedModule } from './shared/shared.module';

@NgModule({
   declarations: [AppComponent],
   imports: [
      AppRoutingModule,
      SharedModule,
      // Angular
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      // PrimeNG
      MenubarModule,
   ],
   providers: [
      MessageService,
      {
         provide: HTTP_INTERCEPTORS,
         useClass: AuthInterceptor,
         multi: true,
      },
      { provide: ErrorHandler, useClass: GlobalErrorHandler },
   ],
   bootstrap: [AppComponent],
})
export class AppModule {}
