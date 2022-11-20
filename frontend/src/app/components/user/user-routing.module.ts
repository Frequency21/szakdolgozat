import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasketComponent } from './basket/basket.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
   {
      path: 'profile',
      component: ProfileComponent,
   },
   {
      path: 'messages',
      component: MessagesComponent,
   },
   {
      path: 'messages/:userId',
      component: MessagesComponent,
   },
   {
      path: 'create-product',
      component: CreateProductComponent,
   },
   {
      path: 'basket',
      component: BasketComponent,
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class UserRoutingModule {}
