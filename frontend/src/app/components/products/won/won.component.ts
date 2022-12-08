import { Component, OnDestroy } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ProductSimple, SellerRatingDto } from 'src/app/models/product.model';
import { BarionService } from 'src/app/shared/services/barion.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
   selector: 'app-won',
   templateUrl: './won.component.html',
   styleUrls: ['./won.component.scss'],
})
export class WonComponent implements OnDestroy {
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
      private barionService: BarionService,
   ) {
      this.productService
         .getWonAuctions()
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
         ...(product.sellerRating as any),
         productId: product!.id,
      });
      this.ratingDialogVisible = true;
   }

   closeDialog() {
      const value = this.ratingForm.value;
      const dto: SellerRatingDto = {
         id: value.id!,
         productId: value.productId!,
         communication: '' + value.communication,
         transaction: '' + value.transaction,
         quality: '' + value.quality,
         delivery: '' + value.delivery,
      };

      this.productService.rateSeller(dto).subscribe(() => {
         this.ratingDialogVisible = false;
         const index = this.products.findIndex(p => p.id === dto.productId);
         if (!index) return;
         this.products[index].sellerRating = dto;
      });
   }

   onBuy(product: ProductSimple) {
      this.barionService
         .initializePayment([product.id])
         .subscribe(
            barionGatewayUrl => (window.location.href = barionGatewayUrl),
         );
   }
}
