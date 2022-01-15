import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { matchValidator } from 'src/app/validators/match.validator';

@Component({
   selector: 'app-register',
   templateUrl: './register.component.html',
   styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
   registerForm: FormGroup;

   constructor(
      private fb: FormBuilder,
      private router: Router,
      private auth: AuthService,
      private messageService: MessageService,
   ) {
      this.registerForm = this.fb.group({
         name: this.fb.control(null, [Validators.required]),
         email: this.fb.control(null, [Validators.required]),
         password: this.fb.control(null, [Validators.required]),
         passwordRe: this.fb.control(null, [
            Validators.required,
            matchValidator('password'),
         ]),
      });
   }

   onSubmit(): void {
      if (this.registerForm.valid) {
         this.auth
            .register(
               this.registerForm.get('name')?.value,
               this.registerForm.get('email')?.value,
               this.registerForm.get('password')?.value,
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
