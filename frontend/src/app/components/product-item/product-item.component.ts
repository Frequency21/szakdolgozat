import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DISPLAY_CONDITION, ProductSimple } from 'src/app/models/product.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from '../user/user.service';

@Component({
   selector: 'app-product-item',
   templateUrl: './product-item.component.html',
   styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
   @Input() product!: ProductSimple;

   @Input() showRemove = false;
   @Input() showDelete = false;
   @Input() showBuy = false;

   @Input() showRating = false;
   @Input() ratingBtnLabel = '';

   @Output() deleted = new EventEmitter<boolean>();
   @Output() rating = new EventEmitter<void>();
   @Output() buy = new EventEmitter<void>();

   displayCondition = DISPLAY_CONDITION;

   constructor(
      private router: Router,
      private userService: UserService,
      private productService: ProductService,
   ) {}

   ngOnInit(): void {}

   navigateToProduct(id: number) {
      this.router.navigate(['product', id]);
   }

   removeFromBasket(productId: number) {
      this.userService.removeFromBasket(productId).subscribe();
   }

   deleteProduct(id: number) {
      this.productService.deleteProduct(id).subscribe({
         next: () => this.deleted.emit(true),
         error: () => this.deleted.emit(false),
      });
   }

   navigateToProfile(id: number) {
      this.router.navigate(['profile', id]);
   }
}
