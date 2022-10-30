import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessageComponent } from './message/message.component';
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
      component: MessageComponent,
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class UserRoutingModule {}
