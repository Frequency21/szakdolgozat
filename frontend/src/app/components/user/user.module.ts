import { NgModule } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateProductComponent } from './create-product/create-product.component';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
   declarations: [
      UserComponent,
      ProfileComponent,
      MessagesComponent,
      CreateProductComponent,
   ],
   imports: [
      SharedModule,
      UserRoutingModule,
      ProgressBarModule,
      SkeletonModule,
      BadgeModule,
   ],
})
export class UserModule {}
