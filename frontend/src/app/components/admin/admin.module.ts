import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { CreateCategoryComponent } from './create-category/create-category.component';

@NgModule({
   declarations: [AdminComponent, CreateCategoryComponent],
   imports: [SharedModule, AdminRoutingModule],
})
export class AdminModule {}
