import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { combineLatest, map, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Category } from './models/category.model';
import {
   CategoryService,
   deepCloneTree,
} from './shared/services/category.service';

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
      private categoryService: CategoryService,
      private router: Router,
      private http: HttpClient,
   ) {
      this.authService.loggedIn$
         .pipe(takeUntil(this.destroyed$))
         .subscribe(loggedIn => (this.loggedIn = loggedIn));

      const loggedIn$ = this.authService.loggedIn$.pipe(
         takeUntil(this.destroyed$),
      );
      const categories$ = this.categoryService
         .getAllCategory()
         .pipe(takeUntil(this.destroyed$));

      this.items$ = combineLatest([loggedIn$, categories$]).pipe(
         map(args => this.getMenuItems(...args)),
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

   private getMenuItems(
      isLoggedIn: boolean,
      categories: Category[],
   ): MenuItem[] {
      const initialItems = categories
         .slice()
         .sort((a, b) => a.name.localeCompare(b.name))
         .map(category =>
            deepCloneTree(
               category,
               c =>
                  ({
                     label: c.name,
                     items: c.subCategories.length > 0 ? [] : undefined,
                  } as MenuItem),
               'items',
               true,
            ),
         );

      const categoriesItem: MenuItem = {
         label: 'Kategóriák',
         items: initialItems.length > 0 ? initialItems : undefined,
      };

      return [
         {
            label: 'Profil',
            icon: 'pi pi-fw pi-user',
            routerLink: ['users/profile'],
            visible: isLoggedIn,
         },
         categoriesItem,
         {
            label: 'Users',
            icon: 'pi pi-fw pi-user',
            routerLink: ['users'],
         },
      ];
   }
}
