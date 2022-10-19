import { NgModule } from '@angular/core';
import { TreeSelectModule } from 'primeng/treeselect';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
   declarations: [UserComponent, ProfileComponent],
   imports: [SharedModule, TreeSelectModule, UserRoutingModule],
})
export class UserModule {}
