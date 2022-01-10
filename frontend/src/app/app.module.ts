import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MenubarModule } from 'primeng/menubar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
   declarations: [AppComponent],
   imports: [
      AppRoutingModule,
      SharedModule,
      // Angular
      BrowserModule,
      HttpClientModule,
      // PrimeNG
      MenubarModule,
   ],
   providers: [],
   bootstrap: [AppComponent],
})
export class AppModule {}
