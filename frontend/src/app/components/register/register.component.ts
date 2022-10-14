import { Component } from '@angular/core';
import {
   FormBuilder,
   FormControl,
   FormGroup,
   Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { matchValidator } from 'src/app/validators/match.validator';
declare var google: any;

@Component({
   selector: 'app-register',
   templateUrl: './register.component.html',
   styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
   registerForm: FormGroup<{
      name: FormControl<string>;
      email: FormControl<string>;
      password: FormControl<string>;
      passwordRe: FormControl<string>;
   }>;

   constructor(
      private fb: FormBuilder,
      private router: Router,
      private auth: AuthService,
      private messageService: MessageService,
   ) {
      this.registerForm = this.fb.nonNullable.group({
         name: this.fb.nonNullable.control('', [Validators.required]),
         email: this.fb.nonNullable.control('', [Validators.required]),
         password: this.fb.nonNullable.control('', [Validators.required]),
         passwordRe: this.fb.nonNullable.control('', [
            Validators.required,
            matchValidator('password'),
         ]),
      });
   }

   onSubmit(): void {
      if (this.registerForm.valid) {
         this.auth
            .register(
               this.registerForm.value.name!,
               this.registerForm.value.email!,
               this.registerForm.value.password!,
            )
            .subscribe({
               next: success => {
                  if (success) {
                     this.messageService.add({
                        severity: 'success',
                        detail: 'Sikeres regisztráció',
                     });
                  } else {
                     this.messageService.add({
                        severity: 'error',
                        detail: 'Sikertelen regisztráció',
                     });
                  }
               },
               error: _ =>
                  this.messageService.add({
                     severity: 'error',
                     detail: 'Sikertelen regisztráció',
                  }),
            });
      }
   }

   onBackToLogin(): void {
      this.router.navigateByUrl('/login');
   }

   get passwordsMatch() {
      const passwordRe = this.registerForm.get('passwordRe');
      return passwordRe?.hasError('matching');
   }
}
