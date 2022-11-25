import { Component, OnInit } from '@angular/core';
import { ProductSimple } from 'src/app/models/product.model';
import { BarionService } from 'src/app/shared/services/barion.service';
import { UserService } from '../user.service';

@Component({
   selector: 'app-basket',
   templateUrl: './basket.component.html',
   styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit {
   basket$ = this.userService.basket$$;

   constructor(
      private userService: UserService,
      private barionService: BarionService,
   ) {}

   ngOnInit(): void {}

   buyProducts(products: ProductSimple[]) {
      this.barionService
         .initializePayment(products.map(p => p.id))
         .subscribe(
            barionGatewayUrl => (window.location.href = barionGatewayUrl),
         );
   }
}
