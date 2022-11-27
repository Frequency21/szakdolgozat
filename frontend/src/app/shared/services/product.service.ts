import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryProperties } from 'src/app/models/category.model';
import {
   BuyerRatingDto,
   CreateProductDto,
   Product,
   ProductProperties,
   ProductSimple,
   SellerRatingDto,
} from 'src/app/models/product.model';

export type CategoryFilterDto = {
   categoryId: number;
   properties: CategoryProperties;
} & ProductProperties;

@Injectable({ providedIn: 'root' })
export class ProductService {
   constructor(private httpClient: HttpClient) {}

   getProduct(id: number) {
      return this.httpClient.get<Product>(`/api/product/${id}`);
   }

   getSimpleProductsForCategory(categoryId: number) {
      return this.httpClient.get<ProductSimple[]>('/api/product/simple', {
         params: {
            categoryId,
         },
      });
   }

   createProduct(createProductDto: CreateProductDto) {
      return this.httpClient.post<
         {
            name: string;
            signedUrl: string;
            url: string;
         }[]
      >('/api/product', createProductDto);
   }

   findWhere(payload: CategoryFilterDto) {
      return this.httpClient.post<Product[]>('/api/product/filter', payload);
   }

   bid(newPrice: number, productId: number) {
      return this.httpClient.post<
         | {
              success: true;
           }
         | {
              success: false;
              product: {
                 price: number;
                 highestBidder: { name: string; picture: string };
              };
           }
      >('/api/product/bid', {
         newPrice,
         productId,
      });
   }

   getBoughtProducts() {
      return this.httpClient.get<ProductSimple[]>('/api/product/bought');
   }

   getWonAuctions() {
      return this.httpClient.get<ProductSimple[]>('/api/product/won');
   }

   getExpiredAuctions() {
      return this.httpClient.get<ProductSimple[]>('/api/product/expired');
   }

   getPendingProducts() {
      return this.httpClient.get<ProductSimple[]>('/api/product/pending');
   }

   getSuccessProducts() {
      return this.httpClient.get<ProductSimple[]>('/api/product/success');
   }

   getSuccessAuctions() {
      return this.httpClient.get<ProductSimple[]>(
         '/api/product/success-auctions',
      );
   }

   rating() {
      return this.httpClient.delete('/api/rating/seller/1');
   }

   deleteProduct(id: number) {
      return this.httpClient.delete(`/api/product/${id}`);
   }

   rateSeller(dto: SellerRatingDto) {
      return this.httpClient.post(`/api/rating/seller`, dto);
   }

   rateBuyer(dto: BuyerRatingDto) {
      return this.httpClient.post(`/api/rating/buyer`, dto);
   }
}
