import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProductComponent } from './create-product/create-product.component';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user.component';

const routes: Routes = [
   {
      path: '',
      pathMatch: 'full',
      component: UserComponent,
   },
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
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class UserRoutingModule {}
