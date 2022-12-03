import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { LoginComponent } from './components/login/login.component';
import { ProductComponent } from './components/product/product.component';
import { RegisterComponent } from './components/register/register.component';
import { Role } from './models/user.model';

const routes: Routes = [
   {
      path: '',
      pathMatch: 'full',
      redirectTo: 'users',
   },
   {
      path: 'login',
      component: LoginComponent,
   },
   {
      path: 'register',
      component: RegisterComponent,
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
      path: 'products',
      loadChildren: () =>
         import('./components/products/products.module').then(
            m => m.ProductsModule,
         ),
   },
   {
      path: 'users',
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
