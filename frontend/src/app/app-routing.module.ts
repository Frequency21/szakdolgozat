import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
   {
      path: '',
      pathMatch: 'full',
      redirectTo: 'users',
   },
   {
      path: 'users',
      loadChildren: () =>
         import('./components/user/user.module').then(m => m.UserModule),
   },
   {
      path: '**',
      redirectTo: 'users',
   },
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule],
})
export class AppRoutingModule {}
