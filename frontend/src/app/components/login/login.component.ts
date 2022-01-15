import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
   loginForm: FormGroup;

   constructor(
      private fb: FormBuilder,
      private router: Router,
      private auth: AuthService,
   ) {
      this.loginForm = this.fb.group({
         email: this.fb.control(null, [Validators.required]),
         password: this.fb.control(null, [Validators.required]),
      });
   }

   onSubmit(): void {
      this.auth
         .login(
            this.loginForm.value?.['email'],
            this.loginForm.value?.['password'],
         )
         .subscribe(resp => console.log(resp));
   }

   onRegister(): void {
      this.router.navigateByUrl('/register');
   }
}
