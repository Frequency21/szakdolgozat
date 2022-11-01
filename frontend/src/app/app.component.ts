import { HttpClient } from '@angular/common/http';
import {
   AfterViewChecked,
   Component,
   NgZone,
   OnDestroy,
   OnInit,
   ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import {
   combineLatest,
   debounceTime,
   distinctUntilChanged,
   fromEvent,
   map,
   merge,
   Observable,
   ReplaySubject,
   shareReplay,
   startWith,
   Subject,
   switchMap,
   takeUntil,
} from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Category } from './models/category.model';
import { User } from './models/user.model';
import {
   CategoryService,
   deepCloneTree,
} from './shared/services/category.service';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
   private destroyed$ = new ReplaySubject<void>();

   private readonly resizeObservable = (element: Element | undefined) => {
      return new Observable<ResizeObserverEntry[]>(observer => {
         const ro = new ResizeObserver(entries => observer.next(entries));
         if (element) {
            ro.observe(element);
         } else {
            observer.complete();
         }

         return () => {
            if (element) {
               ro.unobserve(element);
            }
         };
      });
   };

   private menuBar$$ = new Subject<Element | undefined>();
   @ViewChild('menuBar') set menuBar(menuBar: any) {
      // get the first child of p-menubar component which is the actual html element
      this.menuBar$$.next(menuBar?.el?.nativeElement?.firstChild);
   }

   loggedIn!: boolean;

   private resize$ = fromEvent(window, 'resize').pipe(debounceTime(100));
   private orientation$ = fromEvent(window, 'orientationchange').pipe(
      debounceTime(100),
   );
   private windowInnerHeight$ = merge(this.resize$, this.orientation$).pipe(
      map(event => {
         return (event!.target as Window).innerHeight;
      }),
      distinctUntilChanged(),
      startWith(window.innerHeight),
      shareReplay(1),
   );

   private menuBarHeight$ = this.menuBar$$.pipe(
      switchMap(this.resizeObservable),
      map(entries => {
         for (const entry of entries) {
            if (entry.borderBoxSize) {
               const borderBoxSize: ResizeObserverSize = Array.isArray(
                  entry.borderBoxSize,
               )
                  ? entry.borderBoxSize[0]
                  : entry.borderBoxSize;
               return borderBoxSize.blockSize;
            }
         }
         throw new Error('No entries found in resizeObservable');
      }),
      debounceTime(50),
      distinctUntilChanged(),
   );

   items$: Observable<MenuItem[]>;

   constructor(
      private primengConfig: PrimeNGConfig,
      private authService: AuthService,
      private categoryService: CategoryService,
      private router: Router,
      private http: HttpClient,
      private ngZone: NgZone,
   ) {
      this.ngZone.runOutsideAngular(() => {
         combineLatest({
            menuBarHeight: this.menuBarHeight$,
            windowHeight: this.windowInnerHeight$,
         }).subscribe(({ menuBarHeight, windowHeight }) => {
            const vh = windowHeight / 100;
            const vhc = (windowHeight - menuBarHeight) / 100;
            document.documentElement.style.setProperty('--vh', vh + 'px');
            document.documentElement.style.setProperty('--vhc', vhc + 'px');
         });
      });

      this.authService.loggedIn$
         .pipe(takeUntil(this.destroyed$))
         .subscribe(loggedIn => (this.loggedIn = loggedIn));

      const user$ = this.authService.user$.pipe(takeUntil(this.destroyed$));
      const categories$ = this.categoryService
         .getAllCategory()
         .pipe(takeUntil(this.destroyed$));

      this.items$ = combineLatest([user$, categories$]).pipe(
         map(args => this.getMenuItems(...args)),
      );
   }

   ngAfterViewChecked(): void {
      console.log('After view checked');
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

   private getMenuItems(user: User | null, categories: Category[]): MenuItem[] {
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
            visible: user != null,
         },
         {
            label: 'Üzeneteim',
            icon: 'pi pi-envelope',
            routerLink: ['users/messages'],
            visible: user != null,
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
