import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MenuItem, MessageService, TreeNode } from 'primeng/api';
import {
   concatMap,
   EMPTY,
   filter,
   finalize,
   ReplaySubject,
   switchMap,
   takeUntil,
} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/user.model';
import { AwsService } from 'src/app/shared/services/aws.service';
import { UserService } from '../user.service';

@Component({
   selector: 'app-profile',
   templateUrl: './profile.component.html',
   styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnDestroy {
   private readonly fbNonNull = this.fb.nonNullable;

   categoryForm = this.fbNonNull.group({
      categoryName: this.fbNonNull.control('', [Validators.required]),
      parentCategoryId: this.fbNonNull.control(''),
   });

   deleteCategoryForm = this.fbNonNull.group({
      categoryId: this.fbNonNull.control('', [Validators.required]),
   });

   profileData = this.fbNonNull.group({
      name: this.fbNonNull.control('', [Validators.required]),
      email: this.fbNonNull.control('', [Validators.required]),
      barionEmail: this.fbNonNull.control(''),
      barionPosKey: this.fbNonNull.control(''),
   });

   categoryMenuItems: MenuItem[] = [];
   categoryTreeNode: TreeNode[] = [];

   selectedNodes = [];

   uploadedFiles: any[] = [];

   choosenFile: any;

   user?: User;

   destroyed$ = new ReplaySubject<void>(1);

   constructor(
      private fb: FormBuilder,
      private http: HttpClient,
      private messageService: MessageService,
      private auth: AuthService,
      private aws: AwsService,
      private userService: UserService,
   ) {
      this.auth.user$
         .pipe(
            takeUntil(this.destroyed$),
            filter(user => user != null),
         )
         .subscribe(user => {
            this.profileData.setValue({
               barionEmail: user!.barionEmail ?? '',
               barionPosKey: user!.barionPosKey ?? '',
               email: user!.email,
               name: user!.name,
            });
            if (user!.idp) {
               this.profileData.controls.email.disable();
            }
            this.disableSubmitBtn = false;
            return (this.user = user!);
         });
   }

   ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   onSelect(event: any) {
      const file = event.currentFiles[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = _ => {
            this.choosenFile = reader.result;
         };
         reader.readAsDataURL(file);
      }
   }

   uploadHandler(evt: any, clearCb: Function) {
      const file = evt.files[0];
      if (file == null || !file.type || !file.name) {
         console.error('No file to upload');
         return;
      }

      this.aws
         .getSignedUrl()
         .pipe(
            switchMap(resp => {
               if (resp.ok && resp.body) {
                  return this.uploadFile(
                     file,
                     resp.body.signedUrl,
                     resp.body.url,
                  );
               }
               return EMPTY;
            }),
         )
         .subscribe(updatedUser => {
            this.auth.updateUser({
               picture: updatedUser.picture,
            });
            clearCb();
         });
   }

   /** fájl feltöltése az aws bucketbe,
    *  siker esetén a backenden is updateljük a user profile képét */
   uploadFile(file: File, signedRequest: string, url: string) {
      return this.http
         .put(signedRequest, file, {
            reportProgress: true,
            observe: 'events',
         })
         .pipe(
            // update profile if aws upload was successful
            concatMap(resp => {
               if (resp.type === HttpEventType.Response && resp.ok) {
                  return this.userService.updateUser({
                     id: this.user!.id,
                     picture: url,
                  });
               }
               return EMPTY;
            }),
            finalize(() => {
               this.messageService.add({
                  key: 'app',
                  summary: 'fileupload',
                  data: ['Profile picture upload', 'was successful!'],
                  severity: 'info',
                  life: 5000,
               });
            }),
         );
   }

   disableSubmitBtn = true;
   submitProfileData() {
      this.disableSubmitBtn = true;
      const formValue = this.profileData.value;
      this.userService
         .updateUser({
            ...formValue,
            id: this.user!.id,
         })
         .pipe(finalize(() => (this.disableSubmitBtn = false)))
         .subscribe(() => this.auth.updateUser({ ...formValue }));
   }
}
