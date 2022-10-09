import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class UserRoutingModule {}
