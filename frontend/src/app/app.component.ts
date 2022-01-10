import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
})
export class AppComponent {
   items: MenuItem[];

   constructor() {
      this.items = [
         {
            label: 'Users',
            icon: 'pi pi-fw pi-user',
            routerLink: ['users'],
         },
      ];
   }
}
