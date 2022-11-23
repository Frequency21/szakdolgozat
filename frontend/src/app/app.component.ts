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
import { OverlayPanel } from 'primeng/overlaypanel';
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
import { UserService } from './components/user/user.service';
import { Category } from './models/category.model';
import { Notification } from './models/notification.model';
import { ProductSimple } from './models/product.model';
import { LoginData, Role } from './models/user.model';
import {
   CategoryService,
   deepCloneCategories,
} from './shared/services/category.service';
import { WebsocketService } from './shared/services/websocket.service';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
   private destroyed$ = new ReplaySubject<void>();

   notifications: Notification[] = [];

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
      private userService: UserService,
      private router: Router,
      private http: HttpClient,
      private ngZone: NgZone,
      // initialize ws client
      private webSocketService: WebsocketService,
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
      const basket$ = this.userService.basket$$;

      this.items$ = combineLatest([user$, categories$, basket$]).pipe(
         map(args => this.getMenuItems(...args)),
      );

      this.webSocketService.notifications$.subscribe(notifications => {
         console.log('new notifications', notifications);
         this.notifications = notifications;
      });
   }

   ngAfterViewChecked(): void {
      console.warn('After view checked');
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

   async selectProduct(
      { id, product: { id: productId } }: Notification,
      op: OverlayPanel,
   ) {
      const success = await this.router.navigate(['product', productId]);
      if (success) {
         op.hide();
         this.webSocketService.seenNotification(id);
      }
   }

   private getMenuItems(
      user: LoginData | null,
      categories: Category[],
      basket: ProductSimple[],
   ): MenuItem[] {
      const initialItems = deepCloneCategories(
         categories,
         c =>
            ({
               label: c.name,
               items: c.subCategories.length > 0 ? [] : undefined,
               // levelél kategóriáknál navigáció
               ...(c.subCategories.length > 0
                  ? {}
                  : {
                       command: () => {
                          this.router.navigate(['categories', c.id]);
                       },
                    }),
            } as MenuItem),
         'items',
         true,
      );

      const categoriesItem: MenuItem = {
         label: 'Kategóriák',
         items: initialItems.length > 0 ? initialItems : undefined,
      };

      if (!user) {
         return [categoriesItem];
      }

      if (user.role === Role.admin) {
         return [
            {
               label: 'Új kategória',
               routerLink: ['admin/create-category'],
            },
            categoriesItem,
         ];
      }

      return [
         {
            label: 'Profil',
            icon: 'pi pi-fw pi-user',
            routerLink: ['users/profile'],
         },
         {
            label: 'Üzeneteim',
            icon: 'pi pi-envelope',
            routerLink: ['users/messages'],
         },
         categoriesItem,
         {
            label: 'Megfigyelt kategóriák',
            icon: 'pi pi-filter',
            routerLink: ['users', 'category-filters'],
         },
         {
            label: 'Hírdetés feladása',
            icon: 'pi pi-box',
            routerLink: ['users', 'create-product'],
         },
         {
            label: 'Kosaram',
            icon: 'pi pi-shopping-cart',
            routerLink: ['users', 'basket'],
            badge: basket.length > 0 ? '' + basket.length : '',
         },
      ];
   }
}
