import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './user.service';

@Component({
   selector: 'app-user',
   templateUrl: './user.component.html',
   styleUrls: ['./user.component.scss'],
})
export class UserComponent {
   form: FormGroup;

   response?: string | null;

   constructor(private fb: FormBuilder, private userService: UserService) {
      this.form = this.fb.group({
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
