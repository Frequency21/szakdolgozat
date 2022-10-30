import { NgModule } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TreeSelectModule } from 'primeng/treeselect';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageComponent } from './message/message.component';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
   declarations: [
      UserComponent,
      ProfileComponent,
      MessagesComponent,
      MessageComponent,
   ],
   imports: [
      SharedModule,
      UserRoutingModule,
      TreeSelectModule,
      FileUploadModule,
      ProgressBarModule,
      SkeletonModule,
   ],
})
export class UserModule {}
