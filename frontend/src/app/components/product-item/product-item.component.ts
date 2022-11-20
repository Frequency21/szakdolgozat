import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DISPLAY_CONDITION, ProductSimple } from 'src/app/models/product.model';
import { UserService } from '../user/user.service';

@Component({
   selector: 'app-product-item',
   templateUrl: './product-item.component.html',
   styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
   @Input() product!: ProductSimple;

   @Input() showRemove = false;

   displayCondition = DISPLAY_CONDITION;

   constructor(private router: Router, private userService: UserService) {}

   ngOnInit(): void {}

   navigateToProduct(id: number) {
      this.router.navigate(['product', id]);
   }

   removeFromBasket(productId: number) {
      this.userService.removeFromBasket(productId).subscribe();
   }
}
