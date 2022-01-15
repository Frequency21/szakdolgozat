import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
   {
      path: '',
      pathMatch: 'full',
      redirectTo: 'users',
   },
   {
      path: 'login',
      loadChildren: () =>
         import('./components/login/login.module').then(m => m.LoginModule),
   },
   {
      path: 'register',
      loadChildren: () =>
         import('./components/register/register.module').then(
            m => m.RegisterModule,
         ),
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
