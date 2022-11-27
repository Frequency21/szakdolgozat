import { DOCUMENT } from '@angular/common';
import { Component, Inject, NgZone, OnInit, Renderer2 } from '@angular/core';
import {
   UntypedFormBuilder,
   UntypedFormGroup,
   Validators,
} from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Role, LoginData } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

// will be defined by google client script
declare var google: any;

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
   loginForm: UntypedFormGroup;

   constructor(
      private fb: UntypedFormBuilder,
      private router: Router,
      private auth: AuthService,
      private meta: Meta,
      private renderer: Renderer2,
      @Inject(DOCUMENT) private doc: Document,
      private ngZone: NgZone,
   ) {
      this.loginForm = this.fb.group({
         email: this.fb.control(null, [Validators.required]),
         password: this.fb.control(null, [Validators.required]),
      });
   }

   ngOnInit(): void {
      this.meta.addTag({
         name: 'google-signin-client_id',
         content: environment.googleClientId,
      });
      let gsiClient = this.doc.createElement('script');
      gsiClient.src = 'https://accounts.google.com/gsi/client';
      gsiClient.async = gsiClient.defer = true;
      gsiClient.onload = () => {
         google.accounts.id.initialize({
            client_id: environment.googleClientId,
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

   handleCredentialResponse = (response: any) => {
      this.ngZone.run(() => {
         this.auth
            .googleSignIn(response.credential)
            .subscribe(this.handleLogin);
      });
   };

   onSubmit(): void {
      this.auth
         .login(this.loginForm.value['email'], this.loginForm.value['password'])
         .subscribe(this.handleLogin);
   }

   handleLogin = (user: LoginData | null) => {
      if (!user) {
         return;
      }

      this.router.navigateByUrl(
         user.role === Role.admin ? '/admin' : '/users/profile',
      );
   };

   onRegister(): void {
      this.router.navigateByUrl('/register');
   }
}
