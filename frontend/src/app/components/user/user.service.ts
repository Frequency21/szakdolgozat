import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import {
   BuyerRatingStatistics,
   Product,
   ProductSimple,
   SellerRatingStatistics,
} from 'src/app/models/product.model';
import { LoginData, UpdateUserDto, User } from 'src/app/models/user.model';

export type RatingsStatistics = {
   profileData: Pick<User, 'id' | 'name' | 'picture' | 'email'>;
   sellerRatingStatistics?: SellerRatingStatistics;
   buyerRatingStatistics?: BuyerRatingStatistics;
};

@Injectable({
   providedIn: 'root',
})
export class UserService {
   basket$$ = new BehaviorSubject<ProductSimple[]>([]);

   constructor(private http: HttpClient, private auth: AuthService) {
      this.auth.user$.subscribe(user => {
         this.basket$$.next(user?.baskets ?? []);
      });
   }

   updateUser(updateUserDto: UpdateUserDto) {
      return this.http.post<LoginData>('/api/user', updateUserDto);
   }

   getBasket() {
      return this.http.get<Product[]>('/api/user/basket');
   }

   addToBasket(product: Product) {
      return this.http
         .post<number>(`/api/user/basket/${product.id}`, undefined)
         .pipe(
            tap(() => {
               const basket = this.basket$$.value;
               if (basket.findIndex(p => p.id === product.id) === -1) {
                  this.basket$$.next([...basket, product]);
               }
            }),
         );
   }

   removeFromBasket(productId: number) {
      return this.http.delete<number>(`/api/user/basket/${productId}`).pipe(
         tap(() => {
            const basket = this.basket$$.value;
            const index = basket.findIndex(p => p.id === productId);
            if (index === -1) return;

            basket.splice(index, 1);
            this.basket$$.next(basket);
         }),
      );
   }

   profileStatistics(userId: number) {
      return this.http.get<RatingsStatistics>(`/api/user/statistics/${userId}`);
   }
}
