import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CreateCategoryComponent } from './create-category/create-category.component';

const routes: Routes = [
   { path: '', pathMatch: 'full', component: AdminComponent },
   { path: 'create-category', component: CreateCategoryComponent },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class AdminRoutingModule {}
