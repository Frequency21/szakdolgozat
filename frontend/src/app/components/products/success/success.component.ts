import { Component, OnDestroy } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';
import { BuyerRatingDto, ProductSimple } from 'src/app/models/product.model';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
   selector: 'app-success',
   templateUrl: './success.component.html',
   styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnDestroy {
   products: ProductSimple[] = [];

   ratingDialogVisible = false;
   ratingForm = this.fb.group({
      id: 0,
      productId: 0,
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
         .getSuccessProducts()
         .pipe(takeUntil(this.destroyed$))
         .subscribe(products => (this.products = products));
   }

   ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   showRatingDialog(product: ProductSimple) {
      this.ratingForm.reset();
      this.ratingForm.patchValue({
         ...(product.buyerRating as any),
         productId: product!.id,
      });
      this.ratingDialogVisible = true;
   }

   closeDialog() {
      const value = this.ratingForm.value;
      const dto: BuyerRatingDto = {
         id: value.id,
         productId: value.productId!,
         communication: '' + value.communication,
         transaction: '' + value.transaction,
         delivery: '' + value.delivery,
      };

      this.productService.rateBuyer(dto).subscribe(() => {
         this.ratingDialogVisible = false;
         const index = this.products.findIndex(p => p.id === dto.productId);
         if (!index) return;
         this.products[index].buyerRating = dto;
      });
   }
}
