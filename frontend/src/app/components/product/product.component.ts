import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { map, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import {
   Delivery,
   DISPLAY_CONDITION,
   DISPLAY_DELIVERY,
   Product,
   ProductSimple,
} from 'src/app/models/product.model';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from '../user/user.service';

@Component({
   selector: 'app-product',
   templateUrl: './product.component.html',
   styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
   product?: Product;
   basket?: ProductSimple[];
   galleryData: { previewImageSrc: string; thumbnailImageSrc: string }[] = [];
   displayCondition = DISPLAY_CONDITION;
   bidValue = 0;

   constructor(
      private route: ActivatedRoute,
      private productService: ProductService,
      private userService: UserService,
      private messageService: MessagesService,
      private primeNgMessageService: MessageService,
      private authService: AuthService,
   ) {}

   destroyed$ = new ReplaySubject<void>(1);

   ngOnInit(): void {
      this.userService.basket$$
         .pipe(takeUntil(this.destroyed$))
         .subscribe(basket => (this.basket = basket));
      this.route.paramMap
         .pipe(
            takeUntil(this.destroyed$),
            map(paramMap => +paramMap.get('id')!),
            switchMap(productId => this.productService.getProduct(productId)),
         )
         .subscribe(product => {
            this.product = product;
            this.galleryData = product.pictures.map(p => ({
               previewImageSrc: p,
               thumbnailImageSrc: p,
            }));
         });
   }

   ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   sendMessage(input: HTMLTextAreaElement, sellerId: number) {
      if (!input.value) return;
      this.messageService
         .sendMessage(sellerId, input.value)
         .subscribe(success => {
            if (success) {
               input.value = '';
            }
         });
   }

   displayDeliveryOptions = (options: Delivery[]) =>
      options.map(o => DISPLAY_DELIVERY[o]).join(', ');

   addToBasket(product: Product) {
      this.userService.addToBasket(product).subscribe();
   }

   removeFromBasket(productId: number) {
      this.userService.removeFromBasket(productId).subscribe();
   }

   productIsInBasket(productId: number) {
      return this.basket?.findIndex(p => p.id === productId) !== -1;
   }

   bid(newPrice: number, productId: number) {
      this.productService.bid(newPrice, productId).subscribe(response => {
         this.bidValue = 0;

         if (!response.success) {
            this.product!.price = response.product.price;
            this.product!.highestBidder!.name =
               response.product.highestBidder.name;
            return;
         }

         this.product!.price = newPrice;
         this.product!.highestBidder!.name = this.authService.user!.name;
         this.primeNgMessageService.add({
            key: 'app',
            data: ['Sikeres licit!'],
            sticky: false,
            life: 2000,
            severity: 'success',
         });
      });
   }
}
