import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

declare var google: any;

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
   loginForm: FormGroup;

   constructor(
      private fb: FormBuilder,
      private router: Router,
      private auth: AuthService,
      private meta: Meta,
      private renderer: Renderer2,
      @Inject(DOCUMENT) private doc: Document,
   ) {
      this.loginForm = this.fb.group({
         email: this.fb.control(null, [Validators.required]),
         password: this.fb.control(null, [Validators.required]),
      });
   }

   ngOnInit(): void {
      this.meta.addTag({
         name: 'google-signin-client_id',
         content:
            '841904817921-a66smqafskbantmcb7aqanilgaol22sq.apps.googleusercontent.com',
      });
      let gsiClient = this.doc.createElement('script');
      gsiClient.src = 'https://accounts.google.com/gsi/client';
      gsiClient.async = gsiClient.defer = true;
      gsiClient.onload = () => {
         google.accounts.id.initialize({
            client_id:
               '841904817921-a66smqafskbantmcb7aqanilgaol22sq.apps.googleusercontent.com',
            callback: this.handleCredentialResponse,
         });
         google.accounts.id.renderButton(
            document.getElementById('google-sign-in-btn'),
            {
               theme: 'outline',
               size: 'large',
            },
         );
         google.accounts.id.prompt();
      };
      this.renderer.appendChild(this.doc.body, gsiClient);
   }

   handleCredentialResponse(response: any) {
      console.log('Encoded JWT ID token: ' + response.credential);
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
