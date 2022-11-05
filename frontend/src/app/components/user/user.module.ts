import { NgModule } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TreeSelectModule } from 'primeng/treeselect';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
   declarations: [UserComponent, ProfileComponent, MessagesComponent],
   imports: [
      SharedModule,
      UserRoutingModule,
      TreeSelectModule,
      FileUploadModule,
      ProgressBarModule,
      SkeletonModule,
      BadgeModule,
   ],
})
export class UserModule {}
