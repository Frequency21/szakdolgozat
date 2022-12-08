import { NgModule } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { BasketComponent } from './basket/basket.component';
import { CategoryFiltersComponent } from './category-filters/category-filters.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
   declarations: [
      ProfileComponent,
      MessagesComponent,
      CreateProductComponent,
      BasketComponent,
      CategoryFiltersComponent,
   ],
   imports: [SharedModule, UserRoutingModule, ProgressBarModule],
})
export class UserModule {}
