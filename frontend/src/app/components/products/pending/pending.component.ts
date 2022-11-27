import { Component, OnDestroy } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ProductSimple } from 'src/app/models/product.model';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
   selector: 'app-pending',
   templateUrl: './pending.component.html',
   styleUrls: ['./pending.component.scss'],
})
export class PendingComponent implements OnDestroy {
   products: ProductSimple[] = [];
   destroyed$ = new ReplaySubject<void>(1);

   constructor(private productService: ProductService) {
      this.productService
         .getPendingProducts()
         .pipe(takeUntil(this.destroyed$))
         .subscribe(products => (this.products = products));
   }

   ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   onProductDelete(id: number) {
      const index = this.products.findIndex(pr => pr.id === id);
      if (!index) return;
      this.products.splice(index, 1);
   }
}
