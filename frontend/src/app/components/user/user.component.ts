import { Component } from '@angular/core';
import {
   UntypedFormBuilder,
   UntypedFormGroup,
   Validators,
} from '@angular/forms';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { UserService } from './user.service';

@Component({
   selector: 'app-user',
   templateUrl: './user.component.html',
   styleUrls: ['./user.component.scss'],
})
export class UserComponent {
   form: UntypedFormGroup;

   response?: string | null;

   constructor(
      private fb: UntypedFormBuilder,
      private userService: UserService,
   ) {
      this.form = this.fb.group({
         receiverId: this.fb.control('', [Validators.required]),
         msg: this.fb.control('', [Validators.required]),
      });
   }

   onSubmit(): void {
      this.userService.greeting(this.form.value).subscribe(resp => {
         console.log(resp);
         return (this.response = resp);
      });
   }
}
