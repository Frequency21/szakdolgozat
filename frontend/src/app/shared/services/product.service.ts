import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryProperties } from 'src/app/models/category.model';
import {
   CreateProductDto,
   Product,
   ProductProperties,
   ProductSimple,
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
}
