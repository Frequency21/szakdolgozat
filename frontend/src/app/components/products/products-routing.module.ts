import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoughtComponent } from './bought/bought.component';
import { ExpiredComponent } from './expired/expired.component';
import { PendingComponent } from './pending/pending.component';
import { SuccessComponent } from './success/success.component';
import { WonComponent } from './won/won.component';

const routes: Routes = [
   {
      path: 'bought',
      component: BoughtComponent,
   },
   {
      path: 'expired',
      component: ExpiredComponent,
   },
   {
      path: 'pending',
      component: PendingComponent,
   },
   {
      path: 'success',
      component: SuccessComponent,
   },
   {
      path: 'won',
      component: WonComponent,
   },
];
@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class ProductsRoutingModule {}
