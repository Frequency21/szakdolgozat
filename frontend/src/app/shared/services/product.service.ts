import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateProductDto } from 'src/app/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
   constructor(private httpClient: HttpClient) {}

   createProduct(createProductDto: CreateProductDto) {
      return this.httpClient.post<
         {
            name: string;
            signedUrl: string;
            url: string;
         }[]
      >('/api/product', createProductDto);
   }
}
