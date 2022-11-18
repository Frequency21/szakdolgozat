import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductComponent } from './components/product/product.component';
import { Role } from './models/user.model';

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
      path: 'categories/:id',
      component: CategoriesComponent,
   },
   {
      path: 'product/:id',
      component: ProductComponent,
   },
   {
      path: 'users',
      canActivate: [AuthGuard],
      data: {
         roles: [Role.customer],
      },
      loadChildren: () =>
         import('./components/user/user.module').then(m => m.UserModule),
   },
   {
      path: 'admin',
      loadChildren: () =>
         import('./components/admin/admin.module').then(m => m.AdminModule),
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
