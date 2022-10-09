import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { map, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
   private destroyed$ = new ReplaySubject<void>();

   loggedIn!: boolean;

   items$: Observable<MenuItem[]>;

   constructor(
      private primengConfig: PrimeNGConfig,
      private authService: AuthService,
      private router: Router,
      private http: HttpClient,
   ) {
      this.authService.loggedIn$
         .pipe(takeUntil(this.destroyed$))
         .subscribe(loggedIn => (this.loggedIn = loggedIn));

      this.items$ = this.authService.loggedIn$.pipe(
         takeUntil(this.destroyed$),
         map(this.getMenuItems.bind(this)),
      );
   }

   ngOnInit(): void {
      this.primengConfig.ripple = true;
      this.authService.autoLogin();
   }

   ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   onLogin(): void {
      this.router.navigateByUrl('/login');
   }

   onLogout(): void {
      this.authService.logout().subscribe();
   }

   onAuth(): void {
      this.http
         .get('/api/auth', { observe: 'response' })
         .subscribe(resp => console.log(resp));
   }

   onDeleteSession(): void {
      this.http
         .delete('/api/auth/destroy-session', { observe: 'response' })
         .subscribe(resp => console.log(resp));
   }

   private getMenuItems(isLoggedIn: boolean): MenuItem[] {
      return [
         {
            label: 'Profil',
            icon: 'pi pi-fw pi-user',
            routerLink: ['users/profile'],
            visible: isLoggedIn,
         },
         {
            label: 'Users',
            icon: 'pi pi-fw pi-user',
            routerLink: ['users'],
         },
      ];
   }
}
