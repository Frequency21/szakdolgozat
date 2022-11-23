import { NgModule } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { SharedModule } from 'src/app/shared/shared.module';
import { BasketComponent } from './basket/basket.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRoutingModule } from './user-routing.module';
import { CategoryFiltersComponent } from './category-filters/category-filters.component';

@NgModule({
   declarations: [
      ProfileComponent,
      MessagesComponent,
      CreateProductComponent,
      BasketComponent,
      CategoryFiltersComponent,
   ],
   imports: [
      SharedModule,
      UserRoutingModule,
      ProgressBarModule,
      SkeletonModule,
   ],
})
export class UserModule {}
