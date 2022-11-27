import { Component, OnDestroy } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ProductSimple, SellerRatingDto } from 'src/app/models/product.model';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
   selector: 'app-bought',
   templateUrl: './bought.component.html',
   styleUrls: ['./bought.component.scss'],
})
export class BoughtComponent implements OnDestroy {
   products: ProductSimple[] = [];

   ratingDialogVisible = false;
   ratingForm = this.fb.group({
      id: 0,
      productId: 0,
      quality: 1,
      transaction: 1,
      delivery: 1,
      communication: 1,
   });

   destroyed$ = new ReplaySubject<void>(1);

   constructor(
      private productService: ProductService,
      private fb: NonNullableFormBuilder,
   ) {
      this.productService
         .getBoughtProducts()
         .pipe(takeUntil(this.destroyed$))
         .subscribe(products => (this.products = products));
   }

   ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   showRatingDialog(product: ProductSimple) {
      this.ratingForm.patchValue({
         ...product.sellerRating,
         productId: product!.id,
      });
      this.ratingDialogVisible = true;
   }

   closeDialog() {
      const value = this.ratingForm.value;
      const dto: SellerRatingDto = {
         id: value.id,
         productId: value.productId!,
         communication: '' + value.communication,
         transaction: '' + value.transaction,
         quality: '' + value.quality,
         delivery: '' + value.delivery,
      };

      this.productService
         .rateSeller(dto)
         .subscribe(() => (this.ratingDialogVisible = false));
   }
}
