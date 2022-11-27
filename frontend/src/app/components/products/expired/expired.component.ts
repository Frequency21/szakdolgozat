import { Component, OnDestroy } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ProductSimple } from 'src/app/models/product.model';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
   selector: 'app-expired',
   templateUrl: './expired.component.html',
   styleUrls: ['./expired.component.scss'],
})
export class ExpiredComponent implements OnDestroy {
   products: ProductSimple[] = [];
   destroyed$ = new ReplaySubject<void>(1);

   constructor(private productService: ProductService) {
      this.productService
         .getExpiredAuctions()
         .pipe(takeUntil(this.destroyed$))
         .subscribe(products => (this.products = products));
   }

   ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   deletedProduct(id: number) {
      const index = this.products.findIndex(p => p.id === id);
      if (!index) return;
      this.products.splice(index, 1);
   }
}
