import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { BoughtComponent } from './bought/bought.component';
import { ExpiredComponent } from './expired/expired.component';
import { PendingComponent } from './pending/pending.component';
import { ProductsRoutingModule } from './products-routing.module';
import { SuccessComponent } from './success/success.component';
import { WonComponent } from './won/won.component';

@NgModule({
   declarations: [
      WonComponent,
      BoughtComponent,
      SuccessComponent,
      PendingComponent,
      ExpiredComponent,
   ],
   imports: [SharedModule, ProductsRoutingModule],
})
export class ProductsModule {}
